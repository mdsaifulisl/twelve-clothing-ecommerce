import { NavLink } from 'react-router-dom';
import {
  Activity,
  FileText,
  HelpCircle,
  Info,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface SidebarLink {
  name: string;
  href: string;
  icon: LucideIcon;
  end?: boolean;
}

const sections: Array<{ label: string; links: SidebarLink[] }> = [
  {
    label: 'Overview',
    links: [{ name: 'Dashboard', href: '/seller', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Store Operations',
    links: [
      { name: 'Products', href: '/seller/products', icon: Package },
      { name: 'Orders', href: '/seller/orders', icon: ShoppingCart },
      { name: 'Customers', href: '/seller/customers', icon: Users },
    ],
  },
  {
    label: 'Storefront',
    links: [
      { name: 'Sliders', href: '/seller/sliders', icon: SlidersHorizontal },
      { name: 'Store Locations', href: '/seller/locations', icon: MapPin },
      { name: 'About Section', href: '/seller/about-settings', icon: Info },
      { name: 'FAQ', href: '/seller/faq-settings', icon: HelpCircle },
      { name: 'Terms & Conditions', href: '/seller/terms-settings', icon: FileText },
    ],
  },
  {
    label: 'Administration',
    links: [
      { name: 'Team & Staff', href: '/seller/team', icon: ShieldCheck },
      { name: 'Activity Logs', href: '/seller/activity-logs', icon: Activity },
      { name: 'Settings', href: '/seller/settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close seller navigation"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        aria-label="Seller navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-cardAccent text-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <NavLink to="/seller" onClick={() => setIsOpen(false)} className="min-w-0">
            <span className="block truncate font-heading text-lg font-bold tracking-wide text-white">Twelve Clothing</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">Seller Panel</span>
          </NavLink>
          <button
            type="button"
            aria-label="Close seller navigation"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Seller pages">
          {sections.map((section) => (
            <section key={section.label}>
              <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">{section.label}</h2>
              <div className="space-y-1">
                {section.links.map(({ name, href, icon: Icon, end }) => (
                  <NavLink
                    key={href}
                    to={href}
                    end={end}
                    onClick={() => setIsOpen(false)}
                    aria-label={name}
                    className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-cardHeader text-white shadow-sm'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {({ isActive }) => <>
                      <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white'}`} />
                      <span className="truncate">{name}</span>
                    </>}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          <p className="text-xs font-medium text-white/80">Twelve Clothing</p>
          <p className="mt-1 text-[10px] text-white/45">Store management</p>
        </div>
      </aside>
    </>
  );
}
