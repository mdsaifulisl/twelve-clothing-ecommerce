/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../../features/cart/useCart";
import { Heart, Minus, Plus, Loader2 } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { showAlertModal } from "../../../features/alert/alertSlice";
import { useProduct } from "../../../features/product/useProduct";

export const ItemDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // 🚀 useProduct থেকে product, fetchSingleProduct, isLoading এবং error নেওয়া হলো
  const { product, fetchSingleProduct, isLoading, error } = useProduct();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // URL-এর ID পরিবর্তন হলে বা কম্পোনেন্ট রেন্ডার হলে ব্যাকএন্ড থেকে সিঙ্গেল প্রোডাক্ট ফেচ করা
  useEffect(() => {
    if (id) {
      fetchSingleProduct(id);
    }
  }, [id]);

  // প্রোডাক্ট লোড হওয়ার পর ডিফল্ট সাইজ সেট করার জন্য
  useEffect(() => {
    if (
      product &&
      product.availableSizes &&
      product.availableSizes.length > 0
    ) {
      setSelectedSize(product.availableSizes[0]);
    } else {
      setSelectedSize("Free Size");
    }
  }, [product]);

  // লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-3" />
        <p className="text-xs text-gray-500 font-medium">
          প্রোডাক্টের বিবরণ লোড হচ্ছে...
        </p>
      </div>
    );
  }

  // এরর বা প্রোডাক্ট না পাওয়া গেলে
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-base font-semibold text-red-600">
          {error || "প্রোডাক্টটি খুঁজে পাওয়া যায়নি!"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-lg cursor-pointer"
        >
          ফিরে যান
        </button>
      </div>
    );
  }

  const hasSizes = product.availableSizes && product.availableSizes.length > 0;

  const finalPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      dispatch(
        showAlertModal({
          message: "দয়া করে প্রথমে একটি সাইজ সিলেক্ট করুন!",
          type: "error",
          title: "সাইজ প্রয়োজন",
        }),
      );
      return;
    }

    // ব্যাকএন্ডের প্রোডাক্ট অবজেক্ট অনুযায়ী ইমেজের অ্যারে হ্যান্ডেল করা
    const productImage = Array.isArray(product.image)
      ? product.image[0]
      : (product.image as unknown as string) || "";

    addItem({
      id: product.id,
      title: product.title,
      price: finalPrice,
      image: productImage,
      size: selectedSize || "Free Size",
      quantity: quantity,
      color: product.color || "",
      sku: product.sku || "",
    });

    // dispatch(showAlertModal({
    //   message: 'প্রোডাক্টটি সফলভাবে কার্টে যোগ করা হয়েছে!',
    //   type: 'success',
    //   title: 'Success',
    // }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  // ইমেজ অ্যারে সেফটি চেক
  const images = Array.isArray(product.image)
    ? product.image
    : [product.image as unknown as string].filter(Boolean);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden border border-gray-100 rounded-xl">
            <img
              src={
                images[selectedImageIndex] ||
                images[0] ||
                "https://via.placeholder.com/400"
              }
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 aspect-[4/5] flex-shrink-0 border-2 overflow-hidden bg-gray-50 rounded-lg transition-all cursor-pointer ${
                    selectedImageIndex === index
                      ? "border-black"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-primary">
              {product.title}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-primary mt-2">
              Tk {finalPrice.toLocaleString()}.00 VAT Included
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="underline cursor-pointer hover:text-black">
                Shipping
              </span>{" "}
              calculated at checkout.
            </p>
          </div>

          {/* Dynamic Size Section */}
          {hasSizes && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Size: <span className="font-normal">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  className="text-xs underline text-gray-600 hover:text-black cursor-pointer"
                >
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes!.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[40px] h-10 px-3 border text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-primary hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Display */}
          {product.color && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                Color: <span className="font-normal">{product.color}</span>
              </span>
              <div className="inline-block border border-black px-3.5 py-1 bg-black text-white text-xs font-medium uppercase tracking-widest rounded-md">
                {product.color}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
              Quantity
            </span>
            <div className="flex items-center border border-gray-300 w-32 h-11 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="flex-1 text-center text-sm font-semibold text-primary">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Wishlist Link */}
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              <Heart size={16} /> Add to wishlist
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 border-2 border-black text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-xl cursor-pointer"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-colors rounded-xl cursor-pointer"
            >
              Buy it now
            </button>
          </div>

          {/* Dynamic Description & Care Details */}
          <div className="border-t border-gray-200 pt-6 space-y-4 text-xs text-gray-600 leading-relaxed">
            {product.description && <p>{product.description}</p>}
            {product.material && (
              <p className="font-semibold text-primary">
                Material: {product.material}
              </p>
            )}
            {product.fit && (
              <p className="font-semibold text-primary">Fit: {product.fit}</p>
            )}

            {product.careInstructions &&
              product.careInstructions.length > 0 && (
                <div className="space-y-1 pt-2">
                  <p className="font-bold text-primary uppercase">
                    Care Instruction:
                  </p>
                  {product.careInstructions.map((instruction, idx) => (
                    <p key={idx}>✓ {instruction}</p>
                  ))}
                </div>
              )}

            {product.sku && (
              <p className="text-[11px] text-gray-400 font-mono pt-2">
                SKU: {product.sku}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ItemDetailsPage;
