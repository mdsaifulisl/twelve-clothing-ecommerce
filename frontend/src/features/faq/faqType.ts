export interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

export interface FaqState {
  items: FaqItem[];
  isLoading: boolean;
  isSaving: boolean;
  hasLoaded: boolean;
  error: string | null;
  requestId: string | null;
}

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  { category: 'Orders', question: 'How do I place an order?', answer: 'Choose a product, select the available options, add it to your cart, and complete checkout with your contact and delivery information.' },
  { category: 'Orders', question: 'How can I track my order?', answer: 'Open the Order Tracking page and enter the order code and phone number used at checkout.' },
  { category: 'Orders', question: 'Can I cancel or change an order?', answer: 'Contact the store as soon as possible with your order code. Changes depend on whether the order has already been processed or dispatched.' },
  { category: 'Delivery', question: 'How much does delivery cost?', answer: 'Delivery charges are calculated at checkout based on the delivery area and current store settings.' },
  { category: 'Delivery', question: 'How long does delivery take?', answer: 'Delivery time depends on your location and courier availability. The store may contact you to confirm delivery details.' },
  { category: 'Payment', question: 'Which payment methods can I use?', answer: 'Available payment methods are shown during checkout. Selecting an online method does not itself confirm that a payment has been received.' },
  { category: 'Products', question: 'How do I choose the right size?', answer: 'Review the available sizes and product details on the product page. If you need help, contact the store before placing your order.' },
  { category: 'Returns', question: 'What should I do if there is a problem with my order?', answer: 'Contact the store with your order code and a description of the issue so the team can review it.' },
];
