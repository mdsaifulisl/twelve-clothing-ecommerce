import React, { useState } from "react";
import { Plus, Trash2, Edit, Upload, X } from "lucide-react";

export interface BannerSlide {
  id: number | string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
}

const INITIAL_SLIDES: BannerSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=1600",
    title: "Men's WESTERN Styles",
    subtitle: "Discover the latest trend in Men Casuals",
    buttonText: "SHOP NOW",
    link: "/men",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600",
    title: "NEW EID COLLECTION",
    subtitle: "Exclusive Festive Wear for Everyone",
    buttonText: "EXPLORE ALL",
    link: "/all-item",
  },
];

export const Sliders: React.FC = () => {
  const [slides, setSlides] = useState<BannerSlide[]>(INITIAL_SLIDES);
  
  // মোডাল এবং এডিট স্টেট
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slideToEdit, setSlideToEdit] = useState<BannerSlide | null>(null);

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttonText: "SHOP NOW",
    link: "/shop",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  // ফাইল আপলোড হ্যান্ডলার (ফাইল থেকে প্রিভিউ ও স্ট্রিং জেনারেট করা)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  // অ্যাড মডাল ওপেন
  const handleOpenAddModal = () => {
    setSlideToEdit(null);
    setFormData({
      title: "",
      subtitle: "",
      buttonText: "SHOP NOW",
      link: "/shop",
      image: "",
    });
    setImagePreview("");
    setIsModalOpen(true);
  };

  // এডিট মডাল ওপেন
  const handleOpenEditModal = (slide: BannerSlide) => {
    setSlideToEdit(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      buttonText: slide.buttonText,
      link: slide.link,
      image: slide.image,
    });
    setImagePreview(slide.image);
    setIsModalOpen(true);
  };

  // স্লাইড ডিলিট হ্যান্ডলার
  const handleDelete = (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      setSlides((prev) => prev.filter((slide) => slide.id !== id));
    }
  };

  // সাবমিট হ্যান্ডলার (অ্যাড অথবা এডিট)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      alert("Please provide a title and upload an image.");
      return;
    }

    if (slideToEdit) {
      // এডিট আপডেট
      setSlides((prev) =>
        prev.map((item) =>
          item.id === slideToEdit.id ? { ...item, ...formData } : item
        )
      );
    } else {
      // নতুন স্লাইড যোগ
      const newSlide: BannerSlide = {
        id: Date.now(),
        ...formData,
      };
      setSlides((prev) => [...prev, newSlide]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Banner Sliders Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your store's homepage banner slides, upload images, and edit details.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cardHeader text-white text-sm font-semibold rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* স্লাইডার লিস্ট গ্রিড */}
      <div className="grid grid-cols-1 gap-6">
        {slides.length > 0 ? (
          slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-2xl border border-borderLight shadow-xs overflow-hidden flex flex-col md:flex-row items-center gap-6 p-5"
            >
              {/* স্লাইড ব্যানার ইমেজ */}
              <div className="w-full md:w-80 h-44 rounded-xl overflow-hidden border border-borderLight shrink-0 relative bg-surface">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-mono font-bold px-2 py-0.5 bg-black/70 text-white rounded">
                  ID: {slide.id}
                </span>
              </div>

              {/* স্লাইড তথ্য */}
              <div className="flex-1 min-w-0 space-y-1.5 w-full">
                <span className="text-xs font-semibold text-cardHeader uppercase tracking-wider block">
                  Redirect Link: <span className="font-mono text-gray-700">{slide.link}</span>
                </span>
                <h3 className="font-heading text-xl font-bold text-primary truncate">
                  {slide.title}
                </h3>
                <p className="text-xs text-gray-500">{slide.subtitle}</p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Button Label:</span>
                  <span className="px-2.5 py-1 bg-surface border border-borderLight text-xs font-bold text-primary rounded-lg">
                    {slide.buttonText}
                  </span>
                </div>
              </div>

              {/* একশন বাটন (Edit & Delete) */}
              <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-borderLight">
                <button
                  onClick={() => handleOpenEditModal(slide)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  title="Edit Slide"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Slide"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-borderLight text-gray-400 text-sm">
            No banner slides found. Add a new slide to display on your homepage.
          </div>
        )}
      </div>

      {/* স্লাইড অ্যাড বা এডিট করার মোডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-borderLight shadow-xl font-sans">
            <div className="p-6 border-b border-borderLight flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-primary">
                  {slideToEdit ? "Edit Banner Slide" : "Add New Banner Slide"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {slideToEdit ? "Update slider details below." : "Upload banner image and configure details."}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-primary rounded-xl hover:bg-surface transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Slide Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Men's WESTERN Styles"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Discover the latest trend in Men Casuals"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="e.g. SHOP NOW"
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Redirect Link URL</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="e.g. /men or /all-item"
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                  />
                </div>
              </div>

              {/* ফাইল আপলোড ইনপুট */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Banner Image File *</label>
                <div className="border-2 border-dashed border-borderLight rounded-2xl p-4 text-center bg-surface hover:border-cardHeader transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1 pointer-events-none">
                    <div className="p-2.5 bg-white rounded-full shadow-xs border border-borderLight text-cardHeader">
                      <Upload className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-primary">Click to upload banner image</p>
                  </div>
                </div>

                {/* ইমেজ প্রিভিউ */}
                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden border border-borderLight h-32 bg-surface mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-borderLight flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-borderLight text-gray-600 font-medium text-sm rounded-xl hover:bg-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-cardHeader text-white font-semibold text-sm rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer"
                >
                  {slideToEdit ? "Update Slide" : "Save Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sliders;