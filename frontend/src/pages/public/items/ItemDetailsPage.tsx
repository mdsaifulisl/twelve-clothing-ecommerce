import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsData from '../../../data/products.json';
import { useCart } from '../../../features/cart/useCart';
import { Heart, Minus, Plus } from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { showAlertModal } from '../../../features/alert/alertSlice';

export interface ProductDetail {
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
  description?: string;
  material?: string;
  fit?: string;
  careInstructions?: string[];
  sku?: string;
}

export const ItemDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const product = (productsData as ProductDetail[]).find((p) => p.id === id) || (productsData[0] as ProductDetail);

  const hasSizes = product.availableSizes && product.availableSizes.length > 0;

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    hasSizes ? product.availableSizes![0] : 'Free Size'
  );
  const [quantity, setQuantity] = useState<number>(1);

  const finalPrice = product.discount 
    ? Math.round(product.price - (product.price * product.discount) / 100) 
    : product.price;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      dispatch(showAlertModal({
        message: 'দয়া করে প্রথমে একটি সাইজ সিলেক্ট করুন!',
        type: 'error', // 'success' | 'error' | 'info'
        title: 'সাইজ প্রয়োজন',
      }));
      // alert('দয়া করে প্রথমে একটি সাইজ সিলেক্ট করুন!');
      return;
    }

    addItem({
      id: product.id,
      title: product.title,
      price: finalPrice,
      image: product.image[0] || '',
      size: selectedSize || 'Free Size',
      quantity: quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden border border-gray-100">
            <img
              src={product.image[selectedImageIndex] || product.image[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {product.image.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 aspect-[4/5] flex-shrink-0 border-2 overflow-hidden bg-gray-50 transition-all ${
                    selectedImageIndex === index ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
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
              <span className="underline cursor-pointer hover:text-black">Shipping</span> calculated at checkout.
            </p>
          </div>

          {/* Dynamic Size Section */}
          {hasSizes && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Size: <span className="font-normal">{selectedSize}</span>
                </span>
                <button className="text-xs underline text-gray-600 hover:text-black">
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes!.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[40px] h-10 px-3 border text-xs font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-primary hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Display */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
              Color: <span className="font-normal">{product.color}</span>
            </span>
            <div className="inline-block border border-black px-3 py-1 bg-black text-white text-xs font-medium uppercase tracking-widest">
              {product.color}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
              Quantity
            </span>
            <div className="flex items-center border border-gray-300 w-32 h-11">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="flex-1 text-center text-sm font-semibold text-primary">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Wishlist Link */}
          <div>
            <button className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-black transition-colors">
              <Heart size={16} /> Add to wishlist
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 border-2 border-black text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Add to cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-colors"
            >
              Buy it now
            </button>
          </div>

          {/* Dynamic Description & Care Details */}
          <div className="border-t border-gray-200 pt-6 space-y-4 text-xs text-gray-600 leading-relaxed">
            {product.description && <p>{product.description}</p>}
            {product.material && <p className="font-semibold text-primary">Material: {product.material}</p>}
            {product.fit && <p className="font-semibold text-primary">{product.fit}</p>}

            {product.careInstructions && product.careInstructions.length > 0 && (
              <div className="space-y-1 pt-2">
                <p className="font-bold text-primary uppercase">Care Instruction:</p>
                {product.careInstructions.map((instruction, idx) => (
                  <p key={idx}>✓ {instruction}</p>
                ))}
              </div>
            )}

            {product.sku && (
              <p className="text-[11px] text-gray-400 font-mono pt-2">SKU: {product.sku}</p>
            )}
          </div>

        </div>

      </div>
    </main>
  );
};