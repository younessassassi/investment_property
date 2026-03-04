import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();

app.use(cors());
app.use(express.json());

// Helper: Scrape property data from Redfin
async function scrapeRedfin(address) {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.redfin.com/search?q=${encodedAddress}`;

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    const response = await axios.get(url, { headers, timeout: 10000 });
    const $ = cheerio.load(response.data);

    let listPrice = null;
    let address_found = null;
    let imageUrl = null;

    // Try to find structured data (JSON-LD)
    const scripts = $('script[type="application/ld+json"]');
    scripts.each((i, elem) => {
      try {
        const data = JSON.parse($(elem).html());
        if (data.name) address_found = data.name;
        if (data.price) listPrice = data.price;
        if (data.image) imageUrl = Array.isArray(data.image) ? data.image[0] : data.image;
      } catch (e) {
        // Skip parsing errors
      }
    });

    // Try to find price in page content if not in structured data
    if (!listPrice) {
      const priceMatch = $('body').text().match(/\$[\d,]+/);
      if (priceMatch) {
        listPrice = parseInt(priceMatch[0].replace(/\$|,/g, ''));
      }
    }

    if (!listPrice) {
      console.log(`⚠️  Redfin scrape incomplete for "${address}"`);
      return null;
    }

    return {
      address: address_found || address,
      listPrice,
      imageUrl,
      source: 'redfin'
    };
  } catch (error) {
    console.error(`Redfin scrape error: ${error.message}`);
    return null;
  }
}

// Helper: Scrape property data from Zillow (fallback)
async function scrapeZillow(address) {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.zillow.com/homes/for_sale/${encodedAddress}`;

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    const response = await axios.get(url, { headers, timeout: 10000 });
    const $ = cheerio.load(response.data);

    let listPrice = null;
    let address_found = null;
    let imageUrl = null;

    // Try to find structured data (JSON-LD)
    const scripts = $('script[type="application/ld+json"]');
    scripts.each((i, elem) => {
      try {
        const data = JSON.parse($(elem).html());
        if (data.name) address_found = data.name;
        if (data.price) listPrice = data.price;
        if (data.image) imageUrl = Array.isArray(data.image) ? data.image[0] : data.image;
      } catch (e) {
        // Skip parsing errors
      }
    });

    if (!listPrice) {
      console.log(`⚠️  Zillow scrape incomplete for "${address}"`);
      return null;
    }

    return {
      address: address_found || address,
      listPrice,
      imageUrl,
      source: 'zillow'
    };
  } catch (error) {
    console.error(`Zillow scrape error: ${error.message}`);
    return null;
  }
}

// Helper: Estimate rental income (1% rule)
function estimateRentalIncome(listPrice) {
  return Math.round((listPrice * 0.01) * 12);
}

// Helper: Estimate property tax (~1.2% average)
function estimatePropertyTax(listPrice) {
  return Math.round(listPrice * 0.012);
}

// Helper: Get image from Unsplash
async function getPropertyImage(address) {
  try {
    const keywords = ['house', 'modern home', 'residential', 'property', 'apartment'];
    const idx = Math.abs(String(address).charCodeAt(0) % keywords.length);
    const query = keywords[idx];
    
    return `https://source.unsplash.com/featured/400x300/?${query}`;
  } catch (err) {
    return null;
  }
}

// Helper: Generate realistic mock data based on address
// Uses regional price data to be more realistic than pure hash-based
function getMockListing(address) {
  const hashCode = String(address)
    .split('')
    .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  
  // Determine region based on state in address (if present)
  let basePrice = 400000;
  
  if (address.toLowerCase().includes('ca') || address.toLowerCase().includes('california')) {
    basePrice = 650000; // California is more expensive
  } else if (address.toLowerCase().includes('ny') || address.toLowerCase().includes('new york')) {
    basePrice = 550000;
  } else if (address.toLowerCase().includes('tx') || address.toLowerCase().includes('texas')) {
    basePrice = 350000;
  } else if (address.toLowerCase().includes('fl') || address.toLowerCase().includes('florida')) {
    basePrice = 420000;
  } else if (address.toLowerCase().includes('vt') || address.toLowerCase().includes('vermont')) {
    basePrice = 350000;
  }
  
  // Add variation based on hash
  const variation = (Math.abs(hashCode) % 200000) - 100000; // -100k to +100k variation
  const finalPrice = Math.max(150000, basePrice + variation);
  const roundedPrice = Math.round(finalPrice / 10000) * 10000;
  
  return {
    address: address,
    listPrice: roundedPrice,
    grossAnnualRent: estimateRentalIncome(roundedPrice),
    propertyTax: estimatePropertyTax(roundedPrice),
    insurance: 1200,
    hoa: 0,
    source: 'mock',
    isMockData: true,
    dataQuality: 'estimated'
  };
}

// Main endpoint
app.get('/api/listing', async (req, res) => {
  const address = req.query.address || 'Unknown Address';
  
  console.log(`\n📍 Fetching listing for: "${address}"`);

  try {
    // Try Redfin first (less aggressive bot protection)
    console.log(`🔍 Attempting Redfin scrape...`);
    let listing = await scrapeRedfin(address);

    // Fall back to Zillow if Redfin fails
    if (!listing) {
      console.log(`⚠️  Redfin unavailable, attempting Zillow...`);
      listing = await scrapeZillow(address);
    }

    // Fall back to mock data if both fail (most likely case)
    if (!listing) {
      console.log(`⚠️  Web scraping failed, using estimated data based on region`);
      listing = getMockListing(address);
    } else {
      // If we got real data, calculate missing fields
      if (!listing.grossAnnualRent && listing.listPrice) {
        listing.grossAnnualRent = estimateRentalIncome(listing.listPrice);
      }
      if (!listing.propertyTax && listing.listPrice) {
        listing.propertyTax = estimatePropertyTax(listing.listPrice);
      }
      console.log(`✅ Successfully scraped real data from ${listing.source}`);
    }

    // Ensure all fields exist
    if (!listing.imageUrl) {
      listing.imageUrl = await getPropertyImage(address);
    }
    if (!listing.insurance) {
      listing.insurance = 1200;
    }
    if (listing.hoa === undefined || listing.hoa === null) {
      listing.hoa = 0;
    }

    console.log(`✅ Response: $${listing.listPrice.toLocaleString()} | Rent: $${listing.grossAnnualRent.toLocaleString()}/yr | Tax: $${listing.propertyTax.toLocaleString()}`);
    res.json(listing);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    const mockListing = getMockListing(address);
    mockListing.imageUrl = await getPropertyImage(address);
    res.json(mockListing);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    method: 'Web Scraper (cheerio)',
    sources: ['Redfin (primary)', 'Zillow (fallback)', 'Mock data (fallback)'],
    note: 'No API key required'
  });
});

const PORT = process.env.PORT || 5180;
app.listen(PORT, () => {
  console.log(`✅ Listing API server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoint: GET http://localhost:${PORT}/api/listing?address=<address>`);
  console.log(`🔧 Method: Web Scraper (cheerio) - Redfin Primary, Zillow Fallback`);
  console.log(`⚠️  Sources: Redfin → Zillow → Mock Data`);
});
