import React, { useState } from 'react';
import { MapPin, Phone, Clock, Plus, Trash2, ExternalLink, CalendarX } from 'lucide-react';

export interface StoreLocation {
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

export const StoreLocations: React.FC = () => {
  const [locations, setLocations] = useState<StoreLocation[]>([
    {
      id: "3",
      division: "Dhaka Division",
      name: "Uttara Flagship",
      address: "House # 12, Road # 11, Sector # 1, Uttara, Dhaka - 1230",
      phone: "01847-425568",
      offDay: "Tuesday",
      openingTime: "10:00 AM",
      closingTime: "10:00 PM",
      mapLink: "https://maps.google.com"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<StoreLocation>>({
    division: "Dhaka Division",
    name: "",
    address: "",
    phone: "",
    offDay: "Sunday",
    openingTime: "10:00 AM",
    closingTime: "10:00 PM",
    mapLink: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation: StoreLocation = {
      id: Date.now().toString(),
      division: formData.division || "Dhaka Division",
      name: formData.name || "",
      address: formData.address || "",
      phone: formData.phone || "",
      offDay: formData.offDay || "",
      openingTime: formData.openingTime || "",
      closingTime: formData.closingTime || "",
      mapLink: formData.mapLink || "#"
    };

    setLocations([...locations, newLocation]);
    setIsModalOpen(false);
    setFormData({
      division: "Dhaka Division",
      name: "",
      address: "",
      phone: "",
      offDay: "Sunday",
      openingTime: "10:00 AM",
      closingTime: "10:00 PM",
      mapLink: ""
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this store location?")) {
      setLocations(locations.filter(loc => loc.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Store Locations</h1>
          <p className="text-gray-500 text-sm mt-1">Manage physical outlets and flagship stores across Bangladesh</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cardHeader text-white text-xs font-bold rounded-xl hover:bg-cardAccent transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Outlet</span>
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-white rounded-2xl border border-borderLight p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                    {loc.division}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-primary mt-2">{loc.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(loc.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cardHeader shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cardHeader shrink-0" />
                  <span className="font-semibold text-gray-800">{loc.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cardHeader shrink-0" />
                  <span>{loc.openingTime} - {loc.closingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarX className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Off Day: <strong className="text-amber-700">{loc.offDay}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-borderLight flex items-center justify-between">
              <a
                href={loc.mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cardHeader hover:underline"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Location Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-primary border-b border-borderLight pb-2">Add Store Outlet</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Outlet Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uttara Flagship"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Division</label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="01847-XXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Full address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Opening Time</label>
                  <input
                    type="text"
                    value={formData.openingTime}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Closing Time</label>
                  <input
                    type="text"
                    value={formData.closingTime}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Off Day</label>
                  <input
                    type="text"
                    value={formData.offDay}
                    onChange={(e) => setFormData({ ...formData, offDay: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Google Maps Link</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={formData.mapLink}
                  onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-borderLight rounded-xl text-xs font-bold text-gray-600 hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cardHeader text-white rounded-xl text-xs font-bold hover:bg-cardAccent"
                >
                  Save Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreLocations;