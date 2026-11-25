import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Layers } from "lucide-react";
import { ProductModal } from "./ProductModal";
import { useProduct } from "../../../features/product/useProduct";
import type { IProduct } from "../../../features/product/ProductType";
import { useAppDispatch } from "../../../app/hooks";
import { openModal } from "../../../features/alert/modalSlice";
import productData from "../../../data/products.json"; 

export const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Redux হুক থেকে ডেটা এবং ফাংশনগুলো নিয়ে আসা হলো
  const { products: serverProducts, isLoading, fetchAllProducts, removeProduct } = useProduct();

  // কম্পোনেন্ট মাউন্ট হওয়ার সাথে সাথে সার্ভার থেকে প্রোডাক্ট ফেচ করা
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // 🚀 ফলব্যাক লজিক: সার্ভারে ডেটা না থাকলে বা লোডিং শেষ হলে ফেক ডাটা (productData) ব্যবহার হবে
  const products = useMemo(() => {
    if (serverProducts && serverProducts.length > 0) {
      return serverProducts;
    }
    // Type casting নিশ্চিত করার জন্য (যদি JSON-এর স্ট্রাকচার IProduct-এর সাথে মিলে যায়)
    return (productData as unknown as IProduct[]) || [];
  }, [serverProducts]);

  // মোডাল স্টেট
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);

  // ক্যাটাগরি তালিকা ফিল্টার (ডাইনামিকালি ডেটা থেকে আসবে)
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  // ফিল্টারিং লজিক
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // ডিলিট প্রোডাক্ট (ব্যাকএন্ড এপিআই কল সহ)
  const handleDeleteProduct = (id: string, productTitle: string) => {
    dispatch(
      openModal({
        title: "Delete Product Confirmation",
        message: `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`,
        onConfirm: async () => {
          try {
            await removeProduct(id);
            await fetchAllProducts();
          } catch (error) {
            console.error("Failed to delete product:", error);
          }
        },
      })
    );
  };

  // অ্যাড মডাল ওপেন
  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  // এডিট মডাল ওপেন
  const handleOpenEditModal = (product: IProduct) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* ১. পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Products List
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your store's product inventory, prices, and details.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cardHeader text-white text-sm font-semibold rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* ২. ফিল্টার এবং সার্চ বার */}
      <div className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none text-primary focus:border-cardHeader transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* লোডিং বা প্রোডাক্ট লিস্ট */}
      {isLoading && serverProducts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-borderLight text-gray-500 text-sm">
          Loading products from server...
        </div>
      ) : (
        <>
          {/* ৩. MOBILE VIEW: কার্ড লেআউট */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const finalPrice =
                  (product.discount ?? 0) > 0
                    ? product.price -
                      (product.price * (product.discount ?? 0)) / 100
                    : product.price;

                const imageUrl = product.image?.[0]
                  ? product.image[0].startsWith("http")
                    ? product.image[0]
                    : `http://localhost:5001${product.image[0]}`
                  : "https://via.placeholder.com/150";

                return (
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-16 h-16 rounded-xl object-cover border border-borderLight shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-surface text-gray-500 rounded-md border border-borderLight">
                            {product.sku || "N/A"}
                          </span>
                          <span className="text-xs font-semibold text-cardHeader">
                            {product.productType}
                          </span>
                        </div>
                        <h4 className="font-semibold text-primary text-sm mt-1 truncate">
                          {product.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Color:{" "}
                          <span className="font-medium text-gray-600">
                            {product.color}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-borderLight text-xs">
                      <div>
                        <span className="text-gray-400 block">Category:</span>
                        <span className="font-medium text-primary flex items-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3 text-cardHeader" />
                          {product.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Price:</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-bold text-primary text-sm">
                            ৳{finalPrice.toLocaleString("en-BD")}
                          </span>
                          {(product.discount ?? 0) > 0 && (
                            <span className="text-gray-400 line-through text-[11px]">
                              ৳{product.price.toLocaleString("en-BD")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-borderLight">
                      <div className="flex items-center gap-1">
                        {product.availableSizes?.length > 0 ? (
                          product.availableSizes.map((size, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-surface text-gray-700 text-[10px] font-semibold rounded border border-borderLight"
                            >
                              {size}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Free Size
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.title)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-8 text-center rounded-2xl border border-borderLight text-gray-400 text-sm">
                No products found matching your search.
              </div>
            )}
          </div>

          {/* ৪. DESKTOP VIEW: টেবিল লেআউট */}
          <div className="hidden md:block bg-white rounded-2xl border border-borderLight shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface text-gray-500 text-xs uppercase tracking-wider border-b border-borderLight">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">SKU</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Sizes</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight text-sm text-gray-700">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const finalPrice =
                        (product.discount ?? 0) > 0
                          ? product.price -
                            (product.price * (product.discount ?? 0)) / 100
                          : product.price;

                      const imageUrl = product.image?.[0]
                        ? product.image[0].startsWith("http")
                          ? product.image[0]
                          : `http://localhost:5001${product.image[0]}`
                        : "https://via.placeholder.com/150";

                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-surface/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={imageUrl}
                                alt={product.title}
                                className="w-12 h-12 rounded-xl object-cover border border-borderLight shrink-0"
                              />
                              <div>
                                <h4 className="font-semibold text-primary line-clamp-1">
                                  {product.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-gray-400 font-mono">
                                    Color: {product.color}
                                  </span>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-xs text-cardHeader font-medium">
                                    {product.productType}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 font-mono text-xs font-semibold text-gray-600">
                            {product.sku || "N/A"}
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-medium text-primary flex items-center gap-1 text-xs">
                                <Layers className="w-3.5 h-3.5 text-cardHeader" />
                                {product.category}
                              </span>
                              <span className="text-xs text-gray-400 mt-0.5">
                                {product.subCategory}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-primary">
                                ৳ {finalPrice.toLocaleString("en-BD")}
                              </span>
                              {(product.discount ?? 0) > 0 && (
                                <span className="text-xs text-gray-400 line-through">
                                  ৳ {product.price.toLocaleString("en-BD")}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            {product.availableSizes?.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {product.availableSizes.map((size, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-surface text-gray-700 text-xs font-semibold rounded-md border border-borderLight"
                                  >
                                    {size}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">
                                Free Size
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                title="Edit"
                                onClick={() => handleOpenEditModal(product)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                title="Delete"
                                onClick={() => handleDeleteProduct(product.id, product.title)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400 text-sm"
                      >
                        No products found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* প্রোডাক্ট মডাল (অ্যাড ও এডিট) */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default Products;