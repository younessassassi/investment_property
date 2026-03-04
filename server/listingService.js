import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Helper: Fetch image from Unsplash API (demo)
// For production, use real estate images from Zillow, Realtor.com, or property photos
async function getPropertyImage(address) {
  try {
    // Use a deterministic image based on address hash for demo
    // In production, fetch from Zillow or Realtor.com API
    const keywords = ['house', 'modern home', 'residential', 'property', 'apartment'];
    const idx = Math.abs(String(address).charCodeAt(0) % keywords.length);
    const query = keywords[idx];
    
    // Unsplash demo - replace with real estate API in production
    const unsplashUrl = `https://source.unsplash.com/featured/400x300/?${query}`;
    return unsplashUrl;
  } catch (err) {
    return null;
  }
}

// Mock endpoint: GET /api/listing?address=...
app.get('/api/listing', async (req, res) => {
  const address = req.query.address || 'Unknown Address';

  // Simple mock based on address hash for demo purposes
  const hashCode = String(address)
    .split('')
    .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  
  const basePrice = 300000 + Math.abs(hashCode % 500000);
  
  // Get image
  const imageUrl = await getPropertyImage(address);
  
  const mockListing = {
    address,
    listPrice: Math.round(basePrice / 1000) * 1000,
    imageUrl,
    grossAnnualRent: Math.round((basePrice * 0.08) / 100) * 100,
    taxes: Math.round((basePrice * 0.012) / 100) * 100,
    insurance: 1200,
    hoa: 0,
  };

  res.json(mockListing);
});

const PORT = process.env.PORT || 5179;
app.listen(PORT, () => {
  console.log(`✅ Listing API server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoint: GET http://localhost:${PORT}/api/listing?address=<address>`);
});
