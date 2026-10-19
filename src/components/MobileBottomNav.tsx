'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Wrench, ShoppingBag, User } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore(s => s.count);
  const user = useAuthStore(s => s.user);

  // Hide on admin routes
  if (pathname.startsWith('/admin')) return null;

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      href: '/categories',
      label: 'Explore',
      icon: Compass,
      isActive: pathname === '/categories' || pathname.startsWith('/products'),
    },
    {
      href: '/repairs',
      label: 'Repairs',
      icon: Wrench,
      isActive: pathname.startsWith('/repairs') || pathname.startsWith('/warranty'),
      badge: 'Certified',
    },
    {
      href: '/cart',
      label: 'Cart',
      icon: ShoppingBag,
      isActive: pathname === '/cart' || pathname === '/checkout',
      count: cartCount,
    },
    {
      href: user ? '/dashboard' : '/login',
      label: user ? 'Account' : 'Sign In',
      icon: User,
      isActive: pathname === '/dashboard' || pathname === '/login' || pathname === '/profile',
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg px-2 py-1.5 safe-area-bottom"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg relative transition-all duration-150 ${
                active ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />

                {/* Cart Badge */}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#2563EB] text-white text-[10px] font-bold min-w-4 h-4 rounded-full flex items-center justify-center px-1 shadow-2xs">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}

                {/* Service Tag */}
                {item.badge && (
                  <span className="absolute -top-2 -right-3.5 bg-teal-500 text-white text-[8px] font-extrabold px-1 rounded-full uppercase scale-85">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                  active ? 'font-bold text-[#2563EB]' : 'text-[#64748B]'
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator Bar */}
              {active && (
                <span className="absolute -top-1.5 w-6 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
