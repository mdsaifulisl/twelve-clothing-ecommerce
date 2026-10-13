import React, { useState, useMemo } from 'react';
import storesData from '../../../data/stores.json';

interface Store {
  id: string;
  division: string;
  name: string;
  address: string;
  phone: string;
  offDay: string;
  openingTime: string;
  closingTime: string;
  mapLink: string;
}

export const StoreLocatorPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // সার্চ কুয়েরি অনুযায়ী স্টোর ফিল্টার করা
  const filteredStores = useMemo(() => {
    return (storesData as Store[]).filter((store) => {
      const query = searchTerm.toLowerCase();
      return (
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        store.division.toLowerCase().includes(query)
      );
    });
  }, [searchTerm]);

  // ডিভিশন অনুযায়ী স্টোরগুলো গ্রুপিং করা
  const groupedStores = useMemo(() => {
    return filteredStores.reduce((acc, store) => {
      if (!acc[store.division]) {
        acc[store.division] = [];
      }
      acc[store.division].push(store);
      return acc;
    }, {} as Record<string, Store[]>);
  }, [filteredStores]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-white">
      {/* Header Section */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-primary tracking-tight">
          Track Twelve
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-light">
          Find the nearest Twelve Clothing outlet across Bangladesh
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-3xl mx-auto mb-12">
        <input
          type="text"
          placeholder="Search by outlet name, city, address or area"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Stores List grouped by Division */}
      <div className="space-y-10 max-w-3xl mx-auto">
        {Object.keys(groupedStores).length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">কোনো আউটলেট পাওয়া যায়নি!</p>
          </div>
        ) : (
          Object.entries(groupedStores).map(([division, stores]) => (
            <div key={division} className="space-y-4">
              {/* Division Black Header Bar */}
              <div className="bg-[#1A1A1A] text-white px-5 py-3 rounded-t">
                <h2 className="font-heading font-bold text-sm sm:text-base tracking-wide uppercase">
                  {division}
                </h2>
              </div>

              {/* Store Cards */}
              <div className="space-y-4">
                {stores.map((store) => (
                  <div 
                    key={store.id} 
                    className="bg-white border border-gray-200 rounded p-6 shadow-xs space-y-3 text-xs sm:text-sm text-gray-700"
                  >
                    <h3 className="font-heading font-bold text-base text-primary">
                      {store.name}
                    </h3>

                    <div className="space-y-1.5 leading-relaxed font-light">
                      <p>
                        <strong className="font-medium text-primary">Address:</strong> {store.address}
                      </p>
                      <p>
                        <strong className="font-medium text-primary">Call:</strong>{' '}
                        <a href={`tel:${store.phone}`} className="text-[#F26522] hover:underline">
                          {store.phone}
                        </a>
                      </p>
                      <p>
                        <strong className="font-medium text-primary">Off Day:</strong> {store.offDay}
                      </p>
                      <p>
                        <strong className="font-medium text-primary">Opening Time:</strong> {store.openingTime}
                      </p>
                      <p>
                        <strong className="font-medium text-primary">Closing Time:</strong> {store.closingTime}
                      </p>
                      <p>
                        <strong className="font-medium text-primary">Map:</strong>{' '}
                        <a 
                          href={store.mapLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#F26522] hover:underline"
                        >
                          Google Map
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};