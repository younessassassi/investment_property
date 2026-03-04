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
  const serverUrl = 'http://localhost:5180';
  const url = new URL('/api/listing', serverUrl);
  url.searchParams.set('address', address);
  
  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Failed to fetch listing: ${res.statusText}`);
    }
    return res.json();
  } catch (error: any) {
    // Provide more helpful error message
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Cannot connect to server at ${serverUrl}. Make sure it's running on port 5180.`);
    }
    throw error;
  }
}
