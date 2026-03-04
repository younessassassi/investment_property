import React from 'react';
import { Listing } from '../util/listingClient';

interface PropertyPreviewProps {
  listing: Listing | null;
  loading: boolean;
  error: string;
}

export const PropertyPreview: React.FC<PropertyPreviewProps> = ({ listing, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded shadow border-2 border-blue-300 animate-pulse">
        <div className="h-48 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300 text-center">
        <div className="text-4xl mb-2">🏠</div>
        <p className="text-sm text-gray-600">Enter an address and click "Fetch Listing" to see property details</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow overflow-hidden border-2 border-green-300">
      {/* Image */}
      {listing.imageUrl ? (
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={listing.imageUrl}
            alt={listing.address}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            ✓ Loaded
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-3xl">🏠</span>
        </div>
      )}

      {/* Property Details */}
      <div className="p-4 space-y-2">
        <div>
          <div className="text-xs text-gray-500 font-medium">PROPERTY ADDRESS</div>
          <div className="font-semibold text-sm text-gray-800 break-words">{listing.address}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-xs text-gray-600">List Price</div>
            <div className="text-lg font-bold text-blue-600">
              ${listing.listPrice.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-xs text-gray-600">Est. Annual Rent</div>
            <div className="text-lg font-bold text-green-600">
              ${listing.grossAnnualRent?.toLocaleString() || '—'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
          <div className="text-center">
            <div className="text-gray-600">Property Tax</div>
            <div className="font-semibold text-gray-800">${listing.taxes?.toLocaleString() || '—'}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Insurance</div>
            <div className="font-semibold text-gray-800">${listing.insurance?.toLocaleString() || '—'}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">HOA</div>
            <div className="font-semibold text-gray-800">${listing.hoa?.toLocaleString() || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
