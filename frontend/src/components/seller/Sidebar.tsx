
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree, 
  Settings, 
  LogOut,
  X,
  SlidersHorizontal,
  ShieldCheck, // টিম ও রোল ম্যানেজমেন্টের জন্য
  Activity     // এক্টিভিটি লোগ / অডিট ট্রেইল দেখার জন্য
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', href: '/seller', icon: LayoutDashboard },
    { name: 'Products', href: '/seller/products', icon: Package },
    { name: 'Categories', href: '/seller/categories', icon: FolderTree },
    { name: 'Sliders', href: '/seller/sliders', icon: SlidersHorizontal },
    { name: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/seller/customers', icon: Users },
    // মাল্টি-ইউজার বা টিম ম্যানেজমেন্টের নতুন রাউটসমূহ:
    { name: 'Team & Staff', href: '/seller/team', icon: ShieldCheck }, // অ্যাডমিন ও মডারেটর ম্যানেজ করতে
    { name: 'Activity Logs', href: '/seller/activity-logs', icon: Activity }, // কে কী কাজ করলো তা ট্র্যাক করতে
    { name: 'Settings', href: '/seller/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-cardAccent text-white flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        
        {/* Brand Logo & Header */}
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <span className="font-heading text-xl font-bold tracking-wide text-cardBody">
            Twelve Clothing
          </span>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-300 hover:text-white p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            
            const isActive = item.href === '/seller' 
              ? location.pathname === '/seller' 
              : location.pathname.startsWith(item.href);

            return (
              <Link
                key={index}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-cardHeader text-white shadow-sm' 
                    : 'text-gray-200 hover:bg-cardHeader/20 hover:text-cardBody'
                } group`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-cardBody group-hover:text-white'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}