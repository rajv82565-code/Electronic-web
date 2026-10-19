'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Zap,
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Wrench,
  MapPin,
  Shield,
  Flame,
  ArrowRight,
  LayoutDashboard,
  Package,
  LogOut,
  GitCompare,
} from 'lucide-react';
import { useAuthStore, useCartStore, useCompareStore } from '@/lib/store';
import { formatPrice } from '@/components/ProductCard';
import toast from 'react-hot-toast';

export const NAV_CATEGORIES = [
  { href: '/smartphones', label: 'Smartphones', slug: 'smartphones', aliases: ['smartphones', 'phones', 'mobiles'] },
  { href: '/laptops', label: 'Laptops', slug: 'laptops', aliases: ['laptops', 'notebooks'] },
  { href: '/tablets', label: 'Tablets', slug: 'tablets', aliases: ['tablets', 'ipads'] },
  { href: '/wearables', label: 'Wearables', slug: 'smart-watches', aliases: ['smart-watches', 'wearables', 'watches'] },
  { href: '/audio', label: 'Audio & ANC', slug: 'headphones', aliases: ['headphones', 'audio', 'audio-anc', 'earbuds'] },
  { href: '/gaming', label: 'Gaming', slug: 'gaming-devices', aliases: ['gaming-devices', 'gaming'] },
  { href: '/accessories', label: 'Accessories', slug: 'computer-accessories', aliases: ['computer-accessories', 'accessories', 'chargers'] },
  { href: '/smart-home', label: 'Smart Home', slug: 'smart-home', aliases: ['smart-home'] },
  { href: '/deals', label: 'Deals', slug: 'deals', aliases: ['deals'] },
];

function CategoryNavIcon({ slug, isActive }: { slug: string; isActive: boolean }) {
  const accentColor = '#1D63ED';
  const slateColor = isActive ? '#1D63ED' : '#334155';

  switch (slug) {
    case 'smartphones':
      return (
        <svg className="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <rect x="6.5" y="2" width="11" height="20" rx="2.5" stroke={accentColor} strokeWidth="1.8" fill={isActive ? '#BFDBFE' : '#93C5FD'} fillOpacity="0.45" />
          <circle cx="12" cy="18.5" r="0.75" fill={accentColor} />
          <line x1="10.5" y1="4.5" x2="13.5" y2="4.5" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'laptops':
      return (
        <svg className="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <rect x="4.5" y="5.5" width="15" height="10" rx="1.5" stroke="#334155" strokeWidth="1.8" fill={isActive ? '#3B82F6' : '#60A5FA'} />
          <path d="M2.5 19H21.5C20.5 16.5 19 16.5 19 16.5H5C5 16.5 3.5 16.5 2.5 19Z" fill="#334155" stroke="#334155" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      );
    case 'tablets':
      return (
        <svg className="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="2.5" width="14" height="19" rx="2.5" stroke="#334155" strokeWidth="1.8" fill={isActive ? '#BFDBFE' : '#93C5FD'} fillOpacity="0.5" />
          <circle cx="12" cy="18.5" r="0.75" fill="#334155" />
        </svg>
      );
    case 'smart-watches':
    case 'wearables':
      return (
        <svg className="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <path d="M8.5 6V2H15.5V6" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.5 18V22H15.5V18" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="6" y="6" width="12" height="12" rx="3.5" stroke="#1E293B" strokeWidth="1.8" fill={isActive ? '#2563EB' : '#1D4ED8'} />
        </svg>
      );
    case 'headphones':
    case 'audio':
    case 'audio-anc':
      return (
        <svg className="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <path d="M4 13V11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V13" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="2.5" y="11" width="4" height="9" rx="2" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
          <rect x="17.5" y="11" width="4" height="9" rx="2" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
        </svg>
      );
    case 'gaming-devices':
    case 'gaming':
      return (
        <svg className="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <path d="M6 10H18C20.5 10 21.8 12.5 21 15.5L19.5 19.5C19 21 17 20.5 16 19L14 16.5H10L8 19C7 20.5 5 21 4.5 19.5L3 15.5C2.2 12.5 3.5 10 6 10Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M6.5 13H8.5M7.5 12V14" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="15.5" cy="12.5" r="0.8" fill="#60A5FA" />
          <circle cx="17.5" cy="13.5" r="0.8" fill="#60A5FA" />
        </svg>
      );
    case 'computer-accessories':
    case 'accessories':
      return (
        <svg className="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <path d="M7 21V15C7 13.5 9 12.5 9 9V4" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <rect x="6.5" y="3" width="5" height="5.5" rx="1" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
          <path d="M17 21V15C17 13.5 15 12.5 15 9V4" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <rect x="12.5" y="3" width="5" height="5.5" rx="1" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.2" />
        </svg>
      );
    case 'smart-home':
      return (
        <svg className="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <path d="M3 10L12 2.5L21 10V20.5C21 21.0523 20.5523 21.5 20 21.5H4C3.44772 21.5 3 21.0523 3 20.5V10Z" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
          <path d="M8.5 12.5C9.5 11.5 10.7 11 12 11C13.3 11 14.5 11.5 15.5 12.5" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M10 15C10.6 14.4 11.3 14 12 14C12.7 14 13.4 14.4 14 15" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="18" r="1" fill="#2563EB" />
        </svg>
      );
    case 'deals':
      return (
        <svg className="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="13" rx="2" stroke="#E11D48" strokeWidth="1.8" />
          <path d="M12 8V21" stroke="#E11D48" strokeWidth="1.8" />
          <path d="M3 13H21" stroke="#E11D48" strokeWidth="1.8" />
          <path d="M12 8C12 8 8 5 9.5 3C11 1 12 5 12 8Z" stroke="#E11D48" strokeWidth="1.5" fill="#FFE4E6" />
          <path d="M12 8C12 8 16 5 14.5 3C13 1 12 5 12 8Z" stroke="#E11D48" strokeWidth="1.5" fill="#FFE4E6" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Header({ activeCategory }: { activeCategory?: string } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Delivery Pincode Modal
  const [pincode, setPincode] = useState('560001');
  const [city, setCity] = useState('Bengaluru');
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState('560001');

  // Active Category Detection via client query string or prop
  const [currentQuerySlug, setCurrentQuerySlug] = useState(activeCategory || '');

  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore(s => s.count);
  const compareCount = useCompareStore(s => s.items.length);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync category query parameter on client safely
  useEffect(() => {
    if (activeCategory) {
      setCurrentQuerySlug(activeCategory);
      return;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCurrentQuerySlug(params.get('category') || '');
    }
  }, [pathname, activeCategory]);

  // Debounced live search autocomplete
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data.products?.slice(0, 5) || []);
          setIsSearching(false);
          setShowSearchDropdown(true);
        })
        .catch(() => {
          setIsSearching(false);
        });
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePincodeSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(tempPincode)) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }
    setPincode(tempPincode);
    const mockCities: Record<string, string> = {
      '560001': 'Bengaluru',
      '400001': 'Mumbai',
      '110001': 'New Delhi',
      '600001': 'Chennai',
      '500001': 'Hyderabad',
      '700001': 'Kolkata',
      '411001': 'Pune',
    };
    setCity(mockCities[tempPincode] || 'Express Hub');
    setPincodeModalOpen(false);
    toast.success(`Delivery location updated to ${mockCities[tempPincode] || tempPincode}`);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    setUserMenuOpen(false);
  };

  // Determine breadcrumb current label
  const getBreadcrumbLabel = () => {
    if (pathname === '/') return 'Categories';
    if (pathname === '/categories') return 'Categories';
    const matchDirect = NAV_CATEGORIES.find(c => pathname === c.href || (c.aliases && c.aliases.some(a => pathname === `/${a}`)));
    if (matchDirect) return matchDirect.label;
    if (pathname.startsWith('/products')) {
      const eff = activeCategory || currentQuerySlug;
      const activeCat = NAV_CATEGORIES.find(c => c.slug === eff || c.aliases?.includes(eff));
      if (activeCat) return activeCat.label;
      return 'Products';
    }
    if (pathname.startsWith('/cart')) return 'Shopping Cart';
    if (pathname.startsWith('/checkout')) return 'Checkout';
    if (pathname.startsWith('/dashboard')) return 'Customer Dashboard';
    if (pathname.startsWith('/warranty')) return 'SmartShield Warranty';
    if (pathname.startsWith('/repairs')) return 'Doorstep Repairs';
    if (pathname.startsWith('/compare')) return 'Compare Hardware';
    return 'Categories';
  };

  return (
    <>
      {/* ==================================================
          1. TOP UTILITY BAR (Navy Bar, ~34px)
          ================================================== */}
      <div
        className="top-utility-bar w-full text-[11px] sm:text-[12px] h-[34px] flex items-center border-b border-[#1E293B]/40 select-none"
        style={{ backgroundColor: '#0F1B35', color: '#CBD5E1' }}
      >
        <div
          className="header-container w-[min(96%,1480px)] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4"
          style={{ width: 'min(96%, 1480px)', marginLeft: 'auto', marginRight: 'auto' }}
        >
          {/* Left Side: Guarantees */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 overflow-hidden text-slate-300">
            <span className="flex items-center gap-1.5 shrink-0 hover:text-white transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> Official Brand Guarantee
            </span>
            <span className="text-[#334155] hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1.5 shrink-0 hover:text-white transition-colors">
              <Truck className="w-3.5 h-3.5 text-slate-300" /> Free Express Delivery above ₹999
            </span>
            <span className="text-[#334155] hidden md:inline">|</span>
            <span className="hidden md:flex items-center gap-1.5 shrink-0 hover:text-white transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-300" /> 100% Genuine Products
            </span>
            <span className="text-[#334155] hidden xl:inline">|</span>
            <span className="hidden xl:flex items-center gap-1.5 shrink-0 hover:text-white transition-colors">
              <Wrench className="w-3.5 h-3.5 text-slate-300" /> 24h Doorstep Repairs
            </span>
          </div>

          {/* Right Side: Location & Core Services */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 shrink-0 font-medium">
            {/* Deliver To Selector Button */}
            <button
              type="button"
              onClick={() => setPincodeModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer group"
              title="Change delivery location"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-[11px] sm:text-[12px]">
                Deliver to: <strong className="text-white font-bold" style={{ color: '#FFFFFF' }}>{pincode} {city}</strong>
              </span>
            </button>

            <span className="text-[#334155] hidden sm:inline">|</span>

            <Link
              href="/warranty"
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#0EA5A0]" /> SmartShield Warranty
            </Link>

            <span className="text-[#334155] hidden md:inline">|</span>

            <Link
              href="/repairs"
              className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Wrench className="w-3.5 h-3.5 text-[#F59E0B]" /> Repair Desk
            </Link>

            {user?.role === 'admin' && (
              <>
                <span className="text-[#334155]">|</span>
                <Link
                  href="/admin"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          STICKY HEADER: 2. MAIN HEADER + 3. CATEGORY NAVIGATION
          ================================================== */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        {/* ==================================================
            2. MAIN HEADER (White, 76px - 82px)
            ================================================== */}
        <div className="border-b border-[#E2E8F0]/80 bg-white">
          <div
            className="header-container w-[min(96%,1480px)] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4 md:gap-8 min-h-[76px]"
            style={{ width: 'min(96%, 1480px)', marginLeft: 'auto', marginRight: 'auto' }}
          >
            {/* Left Column (~20%): TechVolt Logo */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 -ml-1 md:hidden text-[#475569] hover:text-[#172033] rounded-lg cursor-pointer"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-3 group">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-white stroke-none" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-[27px] font-extrabold tracking-tight leading-none text-[#0F1B35]">
                    Tech<span style={{ color: '#2563EB' }} className="text-[#2563EB]">Volt</span>
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-[#64748B] font-medium tracking-normal mt-1 leading-none">
                    Electronics for a Smarter Tomorrow
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Column (~55%): Desktop Search Bar (Shown on lg >= 1024px) */}
            <div
              ref={searchRef}
              className="desktop-search-bar flex-1 max-w-[720px] mx-auto relative px-2"
              style={{ maxWidth: '720px' }}
            >
              <form onSubmit={handleSearch} className="relative flex items-center w-full">
                <div className="relative w-full flex items-center">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search smartphones, laptops, headphones, and more..."
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setShowSearchDropdown(true);
                    }}
                    onFocus={() => setShowSearchDropdown(true)}
                    className="header-search-input"
                    style={{ paddingLeft: '44px', paddingRight: '110px' }}
                  />
                  <button
                    type="submit"
                    className="header-search-btn absolute right-1.5"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && (searchQuery.trim().length >= 2 || searchResults.length > 0) && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden text-xs divide-y divide-[#F1F5F9]">
                  {isSearching ? (
                    <div className="p-4 text-center text-[#64748B] flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                      Searching inventory...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="px-4 py-2 bg-[#F8FAFC] text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-between">
                        <span>Top Product Matches</span>
                        <span>{searchResults.length} results</span>
                      </div>
                      {searchResults.map(prod => (
                        <Link
                          key={prod.product_id}
                          href={`/products/${prod.product_id}`}
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center gap-3 p-3 hover:bg-blue-50/50 transition-colors group"
                        >
                          <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#172033] truncate group-hover:text-[#2563EB] transition-colors">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-[#64748B]">
                              {prod.brand} • <span className="text-[#0EA5A0]">🛡️ 12M Warranty</span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-[#172033]">{formatPrice(prod.price)}</p>
                            {prod.discount > 0 && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                                {prod.discount}% OFF
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="p-3 text-center text-[#2563EB] hover:bg-blue-50 font-bold block flex items-center justify-center gap-1.5"
                      >
                        View all results for &ldquo;{searchQuery}&rdquo; <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </>
                  ) : (
                    <div className="p-4 text-center text-[#64748B]">
                      No products found matching &ldquo;{searchQuery}&rdquo;. Try another term.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column (~25%): Actions (Cart, Wishlist, Account) */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 shrink-0 justify-end">
              {/* Compare Icon (compact desktop) */}
              <Link
                href="/compare"
                className="hidden 2xl:flex items-center gap-1.5 text-[#172033] hover:text-[#2563EB] px-2.5 py-1.5 rounded-xl hover:bg-[#F8FAFC] transition-colors relative group"
                title="Compare Hardware"
              >
                <div className="relative">
                  <GitCompare className="w-5 h-5 text-[#172033] group-hover:text-[#2563EB] stroke-[1.8]" />
                  {compareCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#0EA5A0] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {compareCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-2 text-[#172033] hover:text-[#2563EB] px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-[#F8FAFC] transition-colors relative group cursor-pointer"
                title="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-[#172033] group-hover:text-[#2563EB] stroke-[1.8]" />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 bg-[#2563EB] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: '#2563EB' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-[#172033] group-hover:text-[#2563EB] hidden sm:inline">
                  Cart
                </span>
              </Link>

              {/* Wishlist */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[#172033] hover:text-[#2563EB] px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-[#F8FAFC] transition-colors relative group cursor-pointer"
                title="Saved Wishlist"
              >
                <Heart className="w-5 h-5 text-[#172033] group-hover:text-[#2563EB] stroke-[1.8]" />
                <span className="text-sm font-semibold text-[#172033] group-hover:text-[#2563EB] hidden sm:inline">
                  Wishlist
                </span>
              </Link>

              {/* User Account / Profile */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 text-left px-2 sm:px-3 py-1.5 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  >
                    <div
                      className="w-9 h-9 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0"
                      style={{ backgroundColor: '#2563EB' }}
                    >
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden lg:flex flex-col text-left leading-tight">
                      <span className="text-[13px] font-bold text-[#172033] truncate max-w-[100px]">
                        {user.name?.split(' ')[0]}
                      </span>
                      <span className="text-[11px] font-medium text-[#64748B]">My Account</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden lg:block group-hover:text-[#2563EB]" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2.5 text-left px-2 sm:px-3 py-1.5 rounded-xl hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                  >
                    <div
                      className="w-9 h-9 rounded-full text-white flex items-center justify-center shadow-xs shrink-0"
                      style={{ backgroundColor: '#2563EB' }}
                    >
                      <User className="w-5 h-5 stroke-[2] text-white" />
                    </div>
                    <div className="hidden lg:flex flex-col text-left leading-tight">
                      <span className="text-[13px] font-bold text-[#172033] group-hover:text-[#2563EB]">Sign In</span>
                      <span className="text-[11px] font-medium text-[#64748B]">My Account</span>
                    </div>
                  </Link>
                )}

                {/* User Dropdown Menu */}
                {user && userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-[#F1F5F9]">
                      <p className="font-bold text-[#172033] truncate">{user.name}</p>
                      <p className="text-[#64748B] text-[11px] truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#172033] hover:bg-blue-50 hover:text-[#2563EB] font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#2563EB]" /> Customer Dashboard
                    </Link>

                    <Link
                      href="/dashboard?tab=orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#172033] hover:bg-blue-50 hover:text-[#2563EB] font-medium"
                    >
                      <Package className="w-4 h-4 text-[#64748B]" /> My Orders
                    </Link>

                    <Link
                      href="/dashboard?tab=warranties"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#172033] hover:bg-blue-50 hover:text-[#2563EB] font-medium"
                    >
                      <Shield className="w-4 h-4 text-[#0EA5A0]" /> My Warranties
                    </Link>

                    <Link
                      href="/dashboard?tab=repairs"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#172033] hover:bg-blue-50 hover:text-[#2563EB] font-medium"
                    >
                      <Wrench className="w-4 h-4 text-[#F59E0B]" /> My Repairs
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-[#2563EB] bg-blue-50 font-bold"
                      >
                        <Zap className="w-4 h-4 text-[#2563EB]" /> Admin Console
                      </Link>
                    )}

                    <div className="pt-1 mt-1 border-t border-[#F1F5F9]">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tablet & Mobile Search Bar (Only shown on screens < 1024px) */}
          <div className="mobile-search-bar px-4 pb-3">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <div className="relative w-full flex items-center">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search smartphones, laptops, headphones, and more..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="mobile-search-input"
                  style={{ paddingLeft: '40px', paddingRight: '95px' }}
                />
                <button
                  type="submit"
                  className="mobile-search-btn absolute right-1.5"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ==================================================
            3. CATEGORY NAVIGATION (Icon on top + Label below)
            ================================================== */}
        <div className="bg-white border-b border-[#E2E8F0]">
          <div
            className="header-container w-[min(96%,1480px)] mx-auto px-4 sm:px-6 lg:px-8"
            style={{ width: 'min(96%, 1480px)', marginLeft: 'auto', marginRight: 'auto' }}
          >
            {/* Horizontal 8-Category Navigation Row */}
            <nav className="flex items-center justify-between sm:justify-center gap-2 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-14 overflow-x-auto no-scrollbar pt-2 pb-0">
              {NAV_CATEGORIES.map(cat => {
                const eff = activeCategory || currentQuerySlug;
                const isActive =
                  pathname === cat.href ||
                  (cat.aliases && cat.aliases.some(a => pathname === `/${a}`)) ||
                  (pathname.startsWith('/products') && (eff === cat.slug || cat.aliases?.includes(eff))) ||
                  ((pathname === '/' || pathname === '/products') && !eff && cat.slug === 'smartphones');

                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className={`relative shrink-0 flex flex-col items-center justify-center px-3.5 sm:px-5 lg:px-6 pt-2 pb-2.5 rounded-t-xl transition-all group ${
                      isActive
                        ? 'bg-[#F0F6FF] text-[#1D63ED]'
                        : 'text-[#1E293B] hover:bg-slate-50/80 hover:text-[#1D63ED]'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-center h-7">
                      <CategoryNavIcon slug={cat.slug} isActive={isActive} />
                    </div>

                    <span
                      className={`text-xs sm:text-[13px] whitespace-nowrap transition-colors ${
                        isActive
                          ? 'font-bold text-[#1D63ED]'
                          : 'font-medium text-[#1E293B] group-hover:text-[#1D63ED]'
                      }`}
                    >
                      {cat.label}
                    </span>

                    {/* Active Bottom Indicator Bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1D63ED] rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ==================================================
          4. CLEAN BREADCRUMB (Below Category Navigation)
          ================================================== */}
      <div className="bg-[#FFFFFF] border-b border-[#E2E8F0]/80 py-2 select-none">
        <div
          className="header-container w-[min(96%,1480px)] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-[12px] sm:text-[13px] text-[#64748B]"
          style={{ width: 'min(96%, 1480px)', marginLeft: 'auto', marginRight: 'auto' }}
        >
          <Link href="/" className="hover:text-[#2563EB] transition-colors">
            Home
          </Link>
          <span className="text-[#94A3B8]">›</span>
          <span className="text-[#172033] font-semibold" style={{ color: '#172033' }}>
            {getBreadcrumbLabel()}
          </span>
        </div>
      </div>

      {/* ==================================================
          MOBILE NAVIGATION DRAWER
          ================================================== */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="w-[280px] max-w-[85vw] h-full bg-white p-5 space-y-4 shadow-2xl overflow-y-auto animate-in slide-in-from-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  <Zap className="w-4 h-4 fill-white stroke-none" />
                </div>
                <span className="font-extrabold text-lg text-[#0F1B35]">
                  Tech<span style={{ color: '#2563EB' }}>Volt</span>
                </span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-[#94A3B8] hover:text-[#172033] p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="font-bold text-xs text-[#94A3B8] uppercase tracking-wider mb-2">Browse Categories</p>
              <Link
                href="/categories"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-[#2563EB] font-bold text-sm"
                style={{ color: '#2563EB' }}
              >
                ☰ All Categories
              </Link>
              {NAV_CATEGORIES.map(cat => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-[#172033] hover:text-[#2563EB] font-medium text-sm border-b border-[#F8FAFC]"
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                href="/products?deals=true"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 py-2 font-bold text-sm mt-1"
                style={{ color: '#EA580C' }}
              >
                <Flame className="w-4 h-4 fill-[#EA580C]" /> Deal Zone
              </Link>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] space-y-2.5">
              <p className="font-bold text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Services & Vault</p>
              <Link
                href="/warranty"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-1 text-[#0EA5A0] font-semibold text-sm"
              >
                <Shield className="w-4 h-4" /> SmartShield Warranty
              </Link>
              <Link
                href="/repairs"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-1 text-[#C2410C] font-semibold text-sm"
                style={{ color: '#C2410C' }}
              >
                <Wrench className="w-4 h-4" /> Doorstep Repair Desk
              </Link>
              <Link
                href="/compare"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-1 text-[#475569] font-medium text-sm"
              >
                <GitCompare className="w-4 h-4" /> Compare Hardware
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          DELIVERY PINCODE MODAL
          ================================================== */}
      {pincodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[#172033] text-base">Select Delivery Location</h3>
              </div>
              <button onClick={() => setPincodeModalOpen(false)} className="text-[#94A3B8] hover:text-[#172033] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#64748B] mb-4">
              Enter your postal pincode to see accurate delivery speed, local repair pickup slots, and doorstep technicians.
            </p>

            <form onSubmit={handlePincodeSave} className="space-y-3">
              <input
                type="text"
                maxLength={6}
                value={tempPincode}
                onChange={e => setTempPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode (e.g. 560001)"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#172033] font-mono tracking-wider focus:outline-none focus:border-[#2563EB]"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTempPincode('560001')}
                  className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-[#475569] py-1 px-2.5 rounded-full cursor-pointer"
                >
                  Bengaluru
                </button>
                <button
                  type="button"
                  onClick={() => setTempPincode('400001')}
                  className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-[#475569] py-1 px-2.5 rounded-full cursor-pointer"
                >
                  Mumbai
                </button>
                <button
                  type="button"
                  onClick={() => setTempPincode('110001')}
                  className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-[#475569] py-1 px-2.5 rounded-full cursor-pointer"
                >
                  Delhi
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPincodeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2 px-5 rounded-xl shadow-xs cursor-pointer"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  Apply Pincode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
