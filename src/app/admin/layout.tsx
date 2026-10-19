'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Shield,
  Wrench,
  MessageSquare,
  Zap,
  LogOut,
  ChevronRight,
  Tag,
  ArrowLeft,
  Kanban,
  BarChart3,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { href: '/admin', label: 'KPI Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Inventory Table', icon: Package },
  { href: '/admin/orders', label: 'Orders Table', icon: ShoppingBag },
  { href: '/admin/warranties', label: 'Warranty Tracker', icon: Shield },
  { href: '/admin/repairs', label: 'Repair Kanban Board', icon: Wrench },
  { href: '/admin/technicians', label: 'Technician Roster', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/chat', label: 'Support Live Desk', icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    toast.success('Signed out from Admin');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-800">
      {/* Sidebar (#0F172A Dark Navy with White Text) */}
      <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col fixed left-0 top-0 h-full z-40 text-white">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-tight">ElectroVolt</span>
              <p className="text-slate-400 text-[11px] font-medium tracking-wide uppercase">Operations Console</p>
            </div>
          </Link>
        </div>

        {/* User Card */}
        {user && (
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {user.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                <p className="text-slate-400 text-[11px] capitalize">{user.role} Access</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-white hover:bg-red-600/20 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area (Clean White Background #F8FAFC) */}
      <main className="flex-1 ml-64 min-h-screen bg-[#F8FAFC] text-slate-800 overflow-auto">
        {children}
      </main>
    </div>
  );
}
