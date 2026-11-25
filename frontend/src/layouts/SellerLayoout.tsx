import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/seller/Sidebar";
import { Menu, Bell, User, Search, LogOut, Globe } from "lucide-react";
import { CustomAlert } from "../components/common/CustomAlert";
import { ScrollToTop } from '../utils/ScrollToTop';
import { useAuth } from "../features/auth/useAuth";

export const SellerLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading, getProfile, logout } = useAuth();
  const navigate = useNavigate();

  // 🟢 প্রথমবার পেজে ঢোকার পর সেশন চেক শেষ হয়েছে কি না তা ট্র্যাক করার লোকাল স্টেট
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // ১. কম্পোনেন্ট মাউন্ট হলেই সেশন ভেরিফাই করতে গেটপ্রোফাইল কল করা
  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        await getProfile();
      } catch (error) {
        console.error("Session verification failed:", error);
      } finally {
        // সেশন চেক শেষ (সফল বা ব্যর্থ যাই হোক)
        setIsCheckingSession(false);
      }
    };

    verifyUserSession();
  }, []);

  console.log("Layout User" , user);

  // ২. সেশন চেক শেষ হওয়ার পর যদি ইউজার অথেন্টিকেটেড না থাকে, তবেই লগইন পেজে পাঠাবে
  useEffect(() => {
    if (!isCheckingSession && !isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, isCheckingSession, navigate]);

  // ৩. ব্যাকএন্ড থেকে ডেটা আসার সময় বা সেশন চেকিং চলাকালীন স্পিনার দেখাবে
  if (isCheckingSession || isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface flex font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <ScrollToTop />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-borderLight h-16 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-surface cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-surface px-3 py-2 rounded-lg border border-borderLight w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none w-full text-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 🟢 মেইন ওয়েবসাইটে যাওয়ার বাটন */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              title="View Main Website"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-primary hover:bg-surface rounded-xl border border-borderLight transition-colors"
            >
              <Globe className="w-4 h-4 text-cardHeader" />
              <span className="hidden md:inline">Visit Store</span>
            </Link>

            <button className="relative p-2 rounded-full text-gray-600 hover:bg-surface transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cardHeader rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-borderLight">
              <div className="w-9 h-9 rounded-full bg-cardHeader/20 text-cardAccent font-heading font-bold flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              
              <div className="hidden lg:block text-left">
                <h4 className="text-sm font-semibold text-primary">{user?.name || 'Seller'}</h4>
                <p className="text-xs text-gray-500">{user?.email || user?.phone || 'Dashboard'}</p>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <CustomAlert />
    </div>
  );
};

export default SellerLayout;