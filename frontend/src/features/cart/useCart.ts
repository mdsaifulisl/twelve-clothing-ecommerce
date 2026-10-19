import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleCartDrawer,
  clearCart,
  type CartItem,
} from './cartSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // addItem ফাংশনে quantity অপশনাল হিসেবে গ্রহণ করা হচ্ছে
  const addItem = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch(addToCart(product));
  };

  const removeItem = (id: string, size: string) => {
    dispatch(removeFromCart({ id, size }));
  };

  const changeQuantity = (id: string, size: string, quantity: number) => {
    dispatch(updateQuantity({ id, size, quantity }));
  };

  const openCart = () => {
    dispatch(toggleCartDrawer(true));
  };

  const closeCart = () => {
    dispatch(toggleCartDrawer(false));
  };

  const emptyCart = () => {
    dispatch(clearCart());
  };

  return {
    items,
    isOpen,
    totalQuantity,
    totalPrice,
    addItem,
    removeItem,
    changeQuantity,
    openCart,
    closeCart,
    emptyCart,
  };
};