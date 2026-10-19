import { Route } from "react-router-dom";
import { Dashboard } from "../pages/seller/dashboard/Dashboard";
import { Products } from "../pages/seller/product/Products";
import { Orders } from "../pages/seller/order/Orders";
import { Customers } from "../pages/seller/order/Customers";
import { Sliders } from "../pages/seller/sliders/Sliders";
import { TeamStaff } from "../pages/seller/settings/TeamStaff";
import { ActivityLogs } from "../pages/seller/settings/ActivityLogs";
import { Settings } from "../pages/seller/settings/Settings";
import { StoreLocations } from "../pages/seller/store-locations/StoreLocations";
import { AboutSettings } from "../pages/seller/about/AboutSettings";

export const sellerRoutes = (
  <>
    <Route index path="/seller" element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="orders" element={<Orders />} />
    <Route path="customers" element={<Customers />} />
    <Route path="sliders" element={<Sliders />} />
    <Route path="team" element={<TeamStaff />} />
    <Route path="activity-logs" element={<ActivityLogs />} />
    <Route path="settings" element={<Settings />} />
    <Route path="locations" element={<StoreLocations />} />
    <Route path="about-settings" element={<AboutSettings />} />
  </>
);