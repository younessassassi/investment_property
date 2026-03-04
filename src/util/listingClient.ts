export interface Listing {
  address: string;
  listPrice: number;
  imageUrl?: string;
  grossAnnualRent?: number;
  taxes?: number;
  insurance?: number;
  hoa?: number;
}

export async function fetchListing(address: string): Promise<Listing> {
  const serverUrl = 'http://localhost:5179';
  const url = new URL('/api/listing', serverUrl);
  url.searchParams.set('address', address);
  
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch listing: ${res.statusText}`);
  }
  return res.json();
}
