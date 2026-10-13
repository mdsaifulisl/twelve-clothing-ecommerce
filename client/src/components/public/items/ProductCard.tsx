import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../features/cart/useCart";
import { useAppDispatch } from "../../../app/hooks";
import { showAlertModal } from "../../../features/alert/alertSlice";
export interface Product {
  id: string;
  title: string;
  price: number;
  discount?: number;
  category: string;
  subCategory: string;
  productType: string;
  image: string[];
  color: string;
  availableSizes?: string[];
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const hasSizes = product.availableSizes && product.availableSizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<string | null>(
    hasSizes ? null : "Free Size",
  );

  const finalPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const handleActionClick = () => {
    if (hasSizes && !selectedSize) {
      dispatch(
        showAlertModal({
          message: "দয়া করে প্রথমে একটি সাইজ সিলেক্ট করুন!",
          type: "error", // 'success' | 'error' | 'info'
          title: "সাইজ প্রয়োজন",
        }),
      );
      // alert('দয়া করে প্রথমে একটি সাইজ সিলেক্ট করুন!');
      return;
    }

    addItem({
      id: product.id,
      title: product.title,
      price: finalPrice,
      image: product.image[0] || "",
      size: selectedSize || "Free Size",
    });

    // dispatch(
    //   showAlertModal({
    //     message: "পণ্যটি কার্টে যুক্ত হয়েছে",
    //     type: "success",
    //     title: "সফল হয়েছে!",
    //     isToast: true,
    //   }),
    // );
  };

  return (
    <div className="bg-white flex flex-col justify-between h-full group">
      <div>
        {/* Product Image & Discount Badge (Clickable to Details) */}
        <div
          onClick={() => navigate(`/items/${product.id}`)}
          className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 cursor-pointer"
        >
          {product.discount && product.discount > 0 ? (
            <div className="absolute top-0 left-0 bg-[#D92323] text-white text-xs font-bold px-3 py-1 z-10">
              {product.discount}% OFF
            </div>
          ) : null}

          <img
            src={product.image[0]}
            alt={product.title}
            className={`w-full h-full object-cover object-center transition-transform duration-500 ${
              product.image[1]
                ? "group-hover:opacity-0 absolute inset-0"
                : "group-hover:scale-105"
            }`}
          />
          {product.image[1] && (
            <img
              src={product.image[1]}
              alt={`${product.title} hover`}
              className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>

        {/* Title & Price (Clickable Title) */}
        <div className="mt-3 space-y-1">
          <h3 className="font-heading font-semibold text-sm text-primary line-clamp-1">
            <Link
              to={`/items/${product.id}`}
              className="hover:text-cardHeader transition-colors"
            >
              {product.title}
            </Link>
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Tk {finalPrice.toLocaleString()}.00 VAT Included
          </p>
        </div>

        {/* Available Sizes List */}
        {hasSizes && (
          <div className="flex flex-wrap gap-1 mt-3">
            {product.availableSizes!.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Color Badge */}
        <div className="mt-3">
          <span className="inline-block border border-gray-200 px-2 py-0.5 text-[10px] tracking-wider text-gray-500 font-medium">
            {product.color}
          </span>
        </div>
      </div>

      {/* Dynamic Button: Choose Size vs Add to Cart */}
      <div className="mt-4 pt-2">
        <button
          onClick={handleActionClick}
          className={`w-full py-2.5 text-xs font-medium transition-colors border ${
            hasSizes && !selectedSize
              ? "border-gray-300 text-primary bg-white hover:border-black"
              : "border-black bg-black text-white hover:bg-opacity-90"
          }`}
        >
          {hasSizes && !selectedSize ? "Choose Size" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};
