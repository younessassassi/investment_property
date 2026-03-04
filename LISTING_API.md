# Running the Rental Property Analyzer with Listing Data

## Quick Start (Both App & Server)

After installing Node.js:

```bash
npm install
npm run dev:all
```

This launches:
- **React App** at `http://localhost:5173`
- **Listing API Server** at `http://localhost:5179`

## Manual Startup (Separate Terminals)

### Terminal 1: Start the Listing API Server

```bash
npm run server
```

Expected output:
```
✅ Listing API server running on http://localhost:5179
📍 Endpoint: GET http://localhost:5179/api/listing?address=<address>
```

### Terminal 2: Start the React App

```bash
npm run dev
```

Open browser to `http://localhost:5173`

## How to Use the Listing Feature

1. **Enter an Address**: In the app, type a property address (e.g., "123 Main St, New York, NY")
2. **Click "Fetch Listing"**: The button will fetch estimated data from the API
3. **Auto-populated Fields**: Purchase price, rent, taxes, insurance, and HOA will populate
4. **Adjust as Needed**: Manually tweak any field for your specific scenario
5. **Analyze**: All calculations update automatically

## Production Deployment

To use real listing data instead of mock data, update `server/listingService.js`:

### Option 1: Zillow API
```javascript
// Install: npm install zillow-ts
const { getPropertyDetails } = require('zillow-ts');
const result = await getPropertyDetails(address, process.env.ZILLOW_API_KEY);
```

### Option 2: Realtor.com API
```javascript
// Install: npm install realtor-com-api
const realtor = require('realtor-com-api');
const result = await realtor.searchByAddress(address);
```

### Option 3: MLS Integration
Connect to your local MLS provider with API credentials in environment variables.

## Environment Variables

Create a `.env` file in the project root:

```env
# Optional: Override listing server URL
VITE_LISTING_SERVER=http://localhost:5179

# For real API integrations:
LISTING_API_KEY=your_api_key_here
ZILLOW_API_KEY=your_zillow_key
REALTOR_API_KEY=your_realtor_key
```

## Troubleshooting

### "Cannot reach listing server" error
- Ensure server is running: `npm run server`
- Check port 5179 is available: `lsof -i :5179` (Mac/Linux) or `netstat -ano | findstr :5179` (Windows)

### CORS errors
- Server includes CORS headers; ensure `cors` middleware is active
- Verify `http://localhost:5173` is allowed in server

### Mock data showing 0 or very low rent
- Mock data is calculated from address hash; it's deterministic but may be unrealistic
- Replace with real API for production use

## Next Steps

1. Add error handling for network failures
2. Implement address autocomplete (Google Places API)
3. Cache listing results in localStorage
4. Add multiple MLS provider support
5. Store fetched listings alongside saved properties

---

**Questions?** Check `src/util/listingClient.ts` for client-side code and `server/listingService.js` for backend.
