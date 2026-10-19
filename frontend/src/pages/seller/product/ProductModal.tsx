import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload } from "lucide-react";
import type { Product } from "./Products";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
}

// অটো-জেনারেটেড SKU তৈরির ফংশন (কম্পোনেন্টের বাইরে রাখা হয়েছে যাতে রি-রেন্ডার ইস্যু না হয়)
const generateSKU = (cat: string, sub: string, col: string) => {
  const c = (cat || "GEN").slice(0, 3).toUpperCase();
  const s = (sub || "PRD").slice(0, 3).toUpperCase();
  const cl = (col || "CLR").slice(0, 3).toUpperCase();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `RA-${c}-${s}-TW26-${randomNum}-${cl}`;
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    price: 0,
    discount: 0,
    category: "Men",
    subCategory: "Panjabi",
    productType: "Mens Basic Panjabi",
    image: [],
    color: "MAROON",
    availableSizes: ["S", "M", "L", "XL"],
    description: "",
    material: "100% Fine Cotton",
    fit: "Regular Fit",
    careInstructions: ["Machine wash cold", "Do not bleach"],
    sku: generateSKU("Men", "Panjabi", "MAROON"),
  });

  const [newSizeInput, setNewSizeInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // মডাল ওপেন হলে বা এডিট প্রোডাক্ট চেঞ্জ হলে স্টেট আপডেট
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(productToEdit);
        setImagePreviews(productToEdit.image || []);
      } else {
        setFormData({
          title: "",
          price: 0,
          discount: 0,
          category: "Men",
          subCategory: "Panjabi",
          productType: "Mens Basic Panjabi",
          image: ["https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=600"],
          color: "MAROON",
          availableSizes: ["S", "M", "L", "XL"],
          description: "",
          material: "100% Fine Cotton",
          fit: "Regular Fit",
          careInstructions: ["Machine wash cold", "Do not bleach"],
          sku: generateSKU("Men", "Panjabi", "MAROON"),
        });
        setImagePreviews(["https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=600"]);
      }
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // ইনপুট হ্যান্ডলার
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (!productToEdit && (name === "category" || name === "subCategory" || name === "color")) {
        updated.sku = generateSKU(
          updated.category || "Men",
          updated.subCategory || "Panjabi",
          updated.color || "CLR"
        );
      }
      return updated;
    });
  };

  // একাধিক ফাইল আপলোড ও প্রিভিউ হ্যান্ডলার
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));

      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setFormData((prev) => ({
        ...prev,
        image: [...(prev.image || []), ...newPreviews],
      }));
    }
  };

  // নির্দিষ্ট ছবি রিমুভ করা
  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      image: prev.image?.filter((_, i) => i !== index),
    }));
  };

  // সাইজ অ্যাড ও রিমুভ
  const handleAddSize = () => {
    if (newSizeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        availableSizes: [...(prev.availableSizes || []), newSizeInput.trim().toUpperCase()],
      }));
      setNewSizeInput("");
    }
  };

  const handleRemoveSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes?.filter((_, i) => i !== index),
    }));
  };

  // কেয়ার ইন্সট্রাকশন হ্যান্ডলিং
  const handleCareChange = (index: number, val: string) => {
    const updated = [...(formData.careInstructions || [])];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, careInstructions: updated }));
  };

  const handleAddCare = () => {
    setFormData((prev) => ({
      ...prev,
      careInstructions: [...(prev.careInstructions || []), ""],
    }));
  };

  const handleRemoveCare = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      careInstructions: prev.careInstructions?.filter((_, i) => i !== index),
    }));
  };

  // সাবমিট হ্যান্ডলার
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProduct: Product = {
      id: productToEdit ? productToEdit.id : Date.now().toString(),
      title: formData.title || "Untitled Product",
      price: Number(formData.price) || 0,
      discount: Number(formData.discount) || 0,
      category: formData.category || "Men",
      subCategory: formData.subCategory || "Panjabi",
      productType: formData.productType || "General",
      image: formData.image && formData.image.length > 0 ? formData.image : ["https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=600"],
      color: formData.color || "N/A",
      availableSizes: formData.availableSizes || [],
      description: formData.description || "",
      material: formData.material || "",
      fit: formData.fit || "Regular Fit",
      careInstructions: formData.careInstructions || [],
      sku: formData.sku || generateSKU("GEN", "PRD", "CLR"),
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-borderLight shadow-xl font-sans">
        {/* হেডার */}
        <div className="p-6 border-b border-borderLight flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-heading text-xl font-bold text-primary">
              {productToEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {productToEdit ? "Update product details below." : "Fill in information to create a new product."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-primary rounded-xl hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ফর্ম */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ১. বেসিক ইনফরমেশন */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Mens Maroon Panjabi"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  <span>SKU (Auto-Generated by Server)</span>
                  <span className="text-[10px] text-cardHeader flex items-center gap-1 font-normal">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 5.6L5 7l1.4-2.5L5 2l2.5 1.4L10 2 8.6 4.5 10 7 7.5 5.6zm12 9.8l-2.5 1.4 1.4 2.5-2.5-1.4-2.5 1.4 1.4-2.5-1.4-2.5 2.5 1.4 2.5-1.4-1.4 2.5zM19 3l1.4 2.5L23 7l-2.5-1.4L19 7l-1.4-2.5L15 3l2.5 1.4L19 3zM14.7 9.3l-9.9 9.9c-.4.4-.4 1 0 1.4l1.6 1.6c.4.4 1 .4 1.4 0l9.9-9.9-3-3z"/>
                    </svg>
                    Auto
                  </span>
                </label>
                <input
                  type="text"
                  name="sku"
                  disabled
                  value={formData.sku}
                  className="w-full px-3.5 py-2 bg-gray-100 border border-borderLight rounded-xl text-sm font-mono font-semibold text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader cursor-pointer"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sub Category</label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  placeholder="e.g. Panjabi, Three Piece"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Type</label>
                <input
                  type="text"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  placeholder="e.g. Mens Embroidery Panjabi"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
            </div>
          </div>

          {/* ২. প্রাইসিং ও স্টক */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
              Pricing & Variants
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Price (৳) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g. MAROON, BLUE"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader uppercase"
                />
              </div>
            </div>

            {/* সাইজ ট্যাগ হ্যান্ডলার */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Available Sizes</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSizeInput}
                  onChange={(e) => setNewSizeInput(e.target.value)}
                  placeholder="e.g. S, M, XL, 4-5Y"
                  className="px-3 py-1.5 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="px-3 py-1.5 bg-cardHeader text-white text-xs font-semibold rounded-xl hover:bg-cardAccent transition-colors cursor-pointer"
                >
                  Add Size
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.availableSizes?.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-borderLight rounded-lg text-xs font-semibold text-primary"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(idx)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ৩. একাধিক ফাইল আপলোড (Multiple File Upload) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
              Product Images
            </h3>

            <div className="border-2 border-dashed border-borderLight rounded-2xl p-6 text-center bg-surface hover:border-cardHeader transition-colors relative cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="p-3 bg-white rounded-full shadow-xs border border-borderLight text-cardHeader">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-primary">
                  Click to upload or drag & drop multiple images
                </p>
                <p className="text-xs text-gray-400">SVG, PNG, JPG or WEBP</p>
              </div>
            </div>

            {/* আপলোড করা ছবির প্রিভিউ গ্রিড */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-borderLight aspect-square bg-surface">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ৪. ম্যাটেরিয়াল ও ডেসক্রিপশন */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
              Specifications & Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g. Cotton Silk Blend"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fit</label>
                <input
                  type="text"
                  name="fit"
                  value={formData.fit}
                  onChange={handleChange}
                  placeholder="e.g. Regular Fit, Slim Fit"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
                className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
              />
            </div>

            {/* ডাইনামিক কেয়ার ইন্সট্রাকশনস */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-700">Care Instructions</label>
                <button
                  type="button"
                  onClick={handleAddCare}
                  className="text-xs font-semibold text-cardHeader hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Rule
                </button>
              </div>
              <div className="space-y-2">
                {formData.careInstructions?.map((care, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={care}
                      onChange={(e) => handleCareChange(idx, e.target.value)}
                      placeholder="e.g. Dry clean only"
                      className="w-full px-3 py-1.5 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCare(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* অ্যাকশন বাটনসমূহ */}
          <div className="pt-4 border-t border-borderLight flex items-center justify-end gap-3 sticky bottom-0 bg-white py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-borderLight text-gray-600 font-medium text-sm rounded-xl hover:bg-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-cardHeader text-white font-semibold text-sm rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer"
            >
              {productToEdit ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};