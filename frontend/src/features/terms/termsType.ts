export interface TermsSection {
  heading: string;
  body: string;
}

export interface TermsPageContent {
  title: string;
  introduction: string;
  effectiveDate: string;
  sections: TermsSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TermsPageState {
  content: TermsPageContent;
  isLoading: boolean;
  isSaving: boolean;
  hasLoaded: boolean;
  error: string | null;
  requestId: string | null;
}

export const DEFAULT_TERMS_PAGE: TermsPageContent = {
  title: 'Terms & Conditions',
  introduction: 'These terms explain how orders are placed, processed, delivered, and tracked at Twelve Clothing.',
  effectiveDate: '2026-10-01',
  sections: [
    { heading: 'Using this store', body: 'By browsing this website or placing an order, you agree to use the store lawfully and to provide accurate information needed to process your order.' },
    { heading: 'Products, prices, and availability', body: 'Product information is provided to help you choose. Prices and discounts are calculated from current product information when an order is submitted. This website does not currently track stock quantities.' },
    { heading: 'Orders and order status', body: 'The server validates products, selected options, prices, and delivery charges when an order is submitted. Keep your order code and checkout phone number to track your order.' },
    { heading: 'Delivery charges', body: 'Delivery charges depend on the delivery area and current store settings. The server-calculated total shown in the order confirmation is authoritative.' },
    { heading: 'Payment methods', body: 'Selecting an online payment method records the selected method only; it does not mean payment has been verified or confirmed.' },
  ],
};
