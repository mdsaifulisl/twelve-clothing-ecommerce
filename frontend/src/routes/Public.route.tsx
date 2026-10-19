/* eslint-disable react-refresh/only-export-components */
import { Route } from "react-router-dom";
import { AuthPage } from "../pages/auth/AuthPage";
import { CheckoutPage } from "../pages/public/checkout/CheckoutPage";

// pages
import { HomePage } from "../pages/public/home/HomePage";
import { ItemsPage } from "../pages/public/items/ItemsPage";
import { ItemDetailsPage } from "../pages/public/items/ItemDetailsPage";
import { AboutPage } from "../pages/public/about/AboutPage";
import { StoreLocatorPage } from "../pages/public/about/StoreLocatorPage";
import { ContactPage } from "../pages/public/about/ContactPage";
import { PrivacyPolicyPage } from "../pages/public/privacy-policy/PrivacyPolicyPage";


export const publicRoutes = (
  <>
    <Route index path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/login" element={<AuthPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/items" element={<ItemsPage />} />
    <Route path="/items/:id" element={<ItemDetailsPage />} />
    <Route path="/stores" element={<StoreLocatorPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
  </>
);
















