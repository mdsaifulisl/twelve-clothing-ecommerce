/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload } from "lucide-react";
import type { IProduct } from "../../../features/product/ProductType";
import { useProduct } from "../../../features/product/useProduct";
import { useAppDispatch } from "../../../app/hooks";
import { showAlertModal } from "../../../features/alert/alertSlice";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: IProduct | null;
}

interface ImageItem {
  url: string;      // সার্ভারের পুরনো ছবির পাথ অথবা নতুন ফাইলের blob URL
  file?: File;      // নতুন ফাইল হলে আসল File অবজেক্ট
  isServer: boolean;// true = সার্ভার ইমেজ, false = নতুন আপলোড
}

const generateSKU = (cat: string, sub: string, col: string) => {
  const c = (cat || "GEN").slice(0, 3).toUpperCase();
  const s = (sub || "PRD").slice(0, 3).toUpperCase();
  const cl = (col || "CLR").slice(0, 3).toUpperCase();
  
  // সময় এবং বড় র্যান্ডম সংখ্যা ব্যবহার করে ডুপ্লিকেট রোধ করা
  const timestampPart = Date.now().toString().slice(-4);
  const randomNum = Math.floor(1000 + Math.random() * 9000); // ৪ ডিজিট

  return `RA-${c}-${s}-${timestampPart}-${randomNum}-${cl}`;
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const dispatch = useAppDispatch();
  const { addProduct, editProduct, fetchAllProducts } = useProduct();

  // ফর্মের সাধারণ ফিল্ডগুলোর স্টেট
  const [formData, setFormData] = useState<Partial<IProduct>>({
    title: "",
    price: 0,
    discount: 0,
    category: "Men",
    subCategory: "Panjabi",
    productType: "Mens Basic Panjabi",
    color: "MAROON",
    availableSizes: ["S", "M", "L", "XL"],
    description: "",
    material: "100% Fine Cotton",
    fit: "Regular Fit",
    careInstructions: ["Machine wash cold", "Do not bleach"],
    sku: generateSKU("Men", "Panjabi", "MAROON"),
  });

  const [newSizeInput, setNewSizeInput] = useState("");
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);

  // মডাল ওপেন হলে বা এডিট প্রোডাক্ট চেঞ্জ হলে স্টেট ইনিশিয়ালাইজ করা
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(productToEdit);
        const serverImages: ImageItem[] = (productToEdit.image || []).map((url) => ({
          url,
          isServer: true,
        }));
        setImageItems(serverImages);
      } else {
        setFormData({
          title: "",
          price: 0,
          discount: 0,
          category: "Men",
          subCategory: "Panjabi",
          productType: "Mens Basic Panjabi",
          color: "MAROON",
          availableSizes: ["S", "M", "L", "XL"],
          description: "",
          material: "100% Fine Cotton",
          fit: "Regular Fit",
          careInstructions: ["Machine wash cold", "Do not bleach"],
          sku: generateSKU("Men", "Panjabi", "MAROON"),
        });
        setImageItems([]);
      }
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // ইনপুট পরিবর্তনের হ্যান্ডলার
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (
        !productToEdit &&
        (name === "category" || name === "subCategory" || name === "color")
      ) {
        updated.sku = generateSKU(
          updated.category || "Men",
          updated.subCategory || "Panjabi",
          updated.color || "CLR"
        );
      }
      return updated;
    });
  };

  // নতুন ফাইল সিলেক্ট করার হ্যান্ডলার
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newItems: ImageItem[] = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
        isServer: false,
      }));
      setImageItems((prev) => [...prev, ...newItems]);
    }
  };

  // নির্দিষ্ট ছবি লিস্ট থেকে রিমুভ করার হ্যান্ডলার
  const handleRemoveImage = (index: number) => {
    setImageItems((prev) => prev.filter((_, i) => i !== index));
  };

  // সাইজ অ্যাড ও রিমুভ হ্যান্ডলার
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

  // কেয়ার ইন্সট্রাকশন হ্যান্ডলার
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

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title || "");
    data.append("price", String(formData.price || 0));
    data.append("discount", String(formData.discount || 0));
    data.append("category", formData.category || "Men");
    data.append("subCategory", formData.subCategory || "");
    data.append("productType", formData.productType || "");
    data.append("color", formData.color || "");
    data.append("description", formData.description || "");
    data.append("material", formData.material || "");
    data.append("fit", formData.fit || "");
    data.append("sku", formData.sku || "");

    formData.availableSizes?.forEach((size) => {
      data.append("availableSizes[]", size);
    });

    formData.careInstructions?.forEach((instruction) => {
      data.append("careInstructions[]", instruction);
    });

    // ১. যে সার্ভার ইমেজগুলো স্ক্রিনে রাখা হয়েছে, সেগুলোর পাথ পাঠানো
    imageItems.forEach((item) => {
      if (item.isServer && item.url) {
        let cleanUrl = item.url;
        if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
          try {
            cleanUrl = new URL(cleanUrl).pathname;
          } catch {
            // ignore
          }
        }
        data.append("existingImages[]", cleanUrl);
      }
    });

    // ২. নতুন আপলোড করা ফাইলগুলো পাঠানো
    imageItems.forEach((item) => {
      if (!item.isServer && item.file) {
        data.append("images", item.file);
      }
    });

    try {
      if (productToEdit) {
        await editProduct(productToEdit.id, data);
        dispatch(
          showAlertModal({
            message: "Product updated successfully",
            type: "success",
            title: "Successfully Updated Product",
            isToast: true,
          })
        );
      } else {
        await addProduct(data);
        dispatch(
          showAlertModal({
            message: "Product saved successfully",
            type: "success",
            title: "Successfully Saved Product",
            isToast: true,
          })
        );
      }

      await fetchAllProducts();
      onClose();
    } catch (error: any) {
      dispatch(
        showAlertModal({
          message: error || "Something went wrong while saving the product.",
          type: "error",
          title: "Error Saving Product",
          isToast: true,
        })
      ); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-borderLight shadow-xl font-sans">
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
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-primary rounded-xl hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
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
                  value={formData.title || ""}
                  onChange={handleChange}
                  placeholder="e.g. Mens Maroon Panjabi"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">SKU (Auto-Generated)</label>
                <input
                  type="text"
                  name="sku"
                  disabled
                  value={formData.sku || ""}
                  className="w-full px-3.5 py-2 bg-gray-100 border border-borderLight rounded-xl text-sm font-mono font-semibold text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category || "Men"}
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
                  value={formData.subCategory || ""}
                  onChange={handleChange}
                  placeholder="e.g. Panjabi"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Type</label>
                <input
                  type="text"
                  name="productType"
                  value={formData.productType || ""}
                  onChange={handleChange}
                  placeholder="e.g. Formal Wear"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Variants */}
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
                  value={formData.price || 0}
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
                  value={formData.discount || 0}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color || ""}
                  onChange={handleChange}
                  placeholder="e.g. Maroon"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Available Sizes</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSizeInput}
                  onChange={(e) => setNewSizeInput(e.target.value)}
                  placeholder="e.g. M, L, XL"
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

          {/* Product Images */}
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
                <p className="text-sm font-semibold text-primary">Click to upload or drag & drop multiple images</p>
                <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
              </div>
            </div>

            {imageItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {imageItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-borderLight aspect-square bg-surface"
                  >
                    <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
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

          {/* Specifications & Details */}
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
                  value={formData.material || ""}
                  onChange={handleChange}
                  placeholder="e.g. 100% Cotton"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fit</label>
                <input
                  type="text"
                  name="fit"
                  value={formData.fit || ""}
                  onChange={handleChange}
                  placeholder="e.g. Slim Fit"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Product description..."
                className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
              />
            </div>

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
                      placeholder="e.g. Hand wash only"
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

          {/* Modal Actions */}
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

export default ProductModal;

