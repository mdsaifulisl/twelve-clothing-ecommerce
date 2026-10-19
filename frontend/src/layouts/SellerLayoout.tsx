import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/seller/Sidebar";
import { Menu, Bell, User, Search } from "lucide-react";
import { CustomAlert } from "../components/common/CustomAlert";

export const SellerLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-borderLight h-16 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-surface"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Box */}
            <div className="hidden sm:flex items-center gap-2 bg-surface px-3 py-2 rounded-lg border border-borderLight w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none w-full text-primary"
              />
            </div>
          </div>

          {/* Right Side (Notification & Profile) */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full text-gray-600 hover:bg-surface transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cardHeader rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-borderLight">
              <div className="w-9 h-9 rounded-full bg-cardHeader/20 text-cardAccent font-heading font-bold flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="hidden lg:block text-left">
                <h4 className="text-sm font-semibold text-primary">Admin</h4>
                <p className="text-xs text-gray-500">Twelve Clothing</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Outlet */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <CustomAlert />
    </div>
  );
};