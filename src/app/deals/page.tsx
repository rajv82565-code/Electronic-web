'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  Star,
  ArrowRight,
  Zap,
  Flame,
  CreditCard,
  RotateCcw,
  Gift,
  Sparkles,
  Percent,
  Clock,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

const DEAL_TYPES = [
  "Today's Deals",
  'Flash Sale',
  'Bank Offers',
  'Exchange Offers',
  'Combo Deals',
  'Seasonal Sale',
];

const CATEGORIES = [
  'Smartphones',
  'Laptops',
  'Tablets',
  'Wearables',
  'Audio & ANC',
  'Gaming',
  'Accessories',
  'Smart Home',
];

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Sony', 'boAt', 'HP', 'Dell'];

const TODAY_DEALS_PRODUCTS = [
  {
    id: 901,
    name: 'Apple iPhone 15',
    brand: 'Apple',
    price: 62999,
    originalPrice: 87900,
    discount: 28,
    rating: 4.7,
    reviews: '12.4K',
    emi: '₹5,249',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
  },
  {
    id: 902,
    name: 'HP Victus Gaming Laptop',
    brand: 'HP',
    price: 54990,
    originalPrice: 84990,
    discount: 35,
    badgeDiscount: '36% OFF',
    rating: 4.5,
    reviews: '8.9K',
    emi: '₹4,582',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
  },
  {
    id: 903,
    name: 'Samsung Galaxy Buds2 Pro',
    brand: 'Samsung',
    price: 11999,
    originalPrice: 20999,
    discount: 42,
    rating: 4.6,
    reviews: '6.2K',
    emi: '₹1,000',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
  },
  {
    id: 904,
    name: 'boAt Wave Ultima',
    brand: 'boAt',
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    rating: 4.4,
    reviews: '9.1K',
    emi: '₹125',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
  },
  {
    id: 905,
    name: 'Sony DualSense Controller',
    brand: 'Sony',
    price: 3999,
    originalPrice: 5990,
    discount: 33,
    rating: 4.6,
    reviews: '3.8K',
    emi: '₹333',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&q=80',
  },
  {
    id: 906,
    name: 'Philips Hue Smart Bulb',
    brand: 'Philips',
    price: 1899,
    originalPrice: 2599,
    discount: 27,
    rating: 4.5,
    reviews: '2.1K',
    emi: '₹158',
    warranty: '2 Years Warranty',
    image: 'https://images.unsplash.com/photo-1550524514-9b51900118eb?w=600&q=80',
  },
];

export default function DealsPage() {
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const [selectedDealTypes, setSelectedDealTypes] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [discountFilter, setDiscountFilter] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(100000);
  const [inStockOnly, setInStockOnly] = useState(true);

  // Live Countdown Timer (Hours, Mins, Secs)
  const [timeLeft, setTimeLeft] = useState({ hrs: 12, mins: 36, secs: 25 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        return { hrs: 12, mins: 36, secs: 25 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addItem = useCartStore(s => s.addItem);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const next = !prev[id];
      if (next) toast.success('Added to Wishlist! ❤️');
      else toast('Removed from Wishlist', { icon: '💔' });
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (prod: any) => {
    addItem({
      product_id: prod.id,
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      discount: prod.discount,
      images: JSON.stringify([prod.image]),
      quantity: 1,
      stock: 10,
    });
    toast.success(`${prod.brand} ${prod.name} added to cart! 🛒`);
  };

  const clearAllFilters = () => {
    setSelectedDealTypes([]);
    setSelectedCats([]);
    setSelectedBrands([]);
    setDiscountFilter(0);
    setMaxPriceFilter(100000);
    setInStockOnly(false);
    toast.success('Filters cleared');
  };

  const filteredDeals = TODAY_DEALS_PRODUCTS.filter(p => {
    if (selectedBrands.length > 0 && !selectedBrands.some(b => b.toLowerCase() === p.brand.toLowerCase())) {
      return false;
    }
    if (p.price > maxPriceFilter) return false;
    if (p.discount < discountFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header activeCategory="deals" />

      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-rose-600">Deals</span>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ==================================================
              LEFT FILTERS SIDEBAR
              ================================================== */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6 text-xs text-slate-700">
              {/* 1. Deal Type Checkboxes */}
              <div>
                <p className="font-bold text-slate-900 text-[13px] py-1">Deal Type</p>
                <div className="mt-2.5 space-y-2.5 pl-0.5">
                  {DEAL_TYPES.map(type => (
                    <label key={type} className="flex items-center gap-3 py-0.5 cursor-pointer hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={selectedDealTypes.includes(type)}
                        onChange={e => {
                          if (e.target.checked) setSelectedDealTypes([...selectedDealTypes, type]);
                          else setSelectedDealTypes(selectedDealTypes.filter(t => t !== type));
                        }}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                      />
                      <span className="text-[13px]">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* 2. Category Checkboxes */}
              <div>
                <p className="font-bold text-slate-900 text-[13px] py-1">Category</p>
                <div className="mt-2.5 space-y-2.5 pl-0.5">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-3 py-0.5 cursor-pointer hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={selectedCats.includes(cat)}
                        onChange={e => {
                          if (e.target.checked) setSelectedCats([...selectedCats, cat]);
                          else setSelectedCats(selectedCats.filter(c => c !== cat));
                        }}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                      />
                      <span className="text-[13px]">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* 3. Brand Checkboxes */}
              <div>
                <p className="font-bold text-slate-900 text-[13px] py-1">Brand</p>
                <div className="mt-2.5 space-y-2.5 pl-0.5">
                  {BRANDS.map(brand => (
                    <label key={brand} className="flex items-center gap-3 py-0.5 cursor-pointer hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={e => {
                          if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                          else setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                      />
                      <span className="text-[13px]">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* 4. Discount Range Slider */}
              <div>
                <p className="font-bold text-slate-900 text-[13px] py-1">Discount Range</p>
                <div className="mt-3 space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="70"
                    step="5"
                    value={discountFilter}
                    onChange={e => setDiscountFilter(Number(e.target.value))}
                    className="w-full h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold pt-0.5">
                    <span>0%</span>
                    <span className="text-rose-600 font-extrabold">{discountFilter}%+</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* 5. Price Range Slider */}
              <div>
                <p className="font-bold text-slate-900 text-[13px] py-1">Price Range</p>
                <div className="mt-3 space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="2500"
                    value={maxPriceFilter}
                    onChange={e => setMaxPriceFilter(Number(e.target.value))}
                    className="w-full h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold pt-0.5">
                    <span>₹0</span>
                    <span className="text-rose-600 font-extrabold">₹{maxPriceFilter.toLocaleString('en-IN')}+</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* 6. Availability */}
              <div>
                <p className="font-bold text-slate-900 text-[13px] py-1">Availability</p>
                <label className="flex items-center gap-3 py-1 cursor-pointer hover:text-slate-900 select-none mt-1">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                  />
                  <span className="text-[13px]">In Stock</span>
                </label>
              </div>

              <div className="h-px bg-slate-100" />

              {/* 7. Customer Rating */}
              <div>
                <p className="font-bold text-slate-900 text-[13px] py-1">Customer Rating</p>
                <div className="mt-2.5 space-y-2 pl-0.5">
                  {[5, 4, 3, 2].map(r => (
                    <label key={r} className="flex items-center gap-2.5 py-0.5 cursor-pointer text-slate-700 hover:text-slate-900">
                      <input type="checkbox" className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300" />
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">& Up</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ==================================================
              RIGHT MAIN SECTION
              ================================================== */}
          <section className="lg:col-span-9 space-y-10 sm:space-y-12">
            {/* ==================================================
                HERO BANNER: MEGA DEALS FEST (RED THEME)
                ================================================== */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#990000] via-[#C91A1A] to-[#E62E2E] border border-rose-500/30 text-white p-8 sm:p-10 lg:p-12 shadow-xl">
              {/* Radial glow effects */}
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 right-12 w-80 h-80 bg-rose-400/25 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left: Titles & Offers */}
                <div className="md:col-span-7 space-y-5">
                  <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black leading-[1.15] tracking-tight text-white uppercase">
                    MEGA<br />DEALS FEST
                  </h1>

                  <div className="space-y-1.5">
                    <p className="text-base sm:text-lg font-bold text-amber-200">
                      Big Discounts. Bigger Happiness.
                    </p>
                    <p className="text-sm font-medium text-rose-100">
                      Limited Time Offers!
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#todays-deals"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-rose-700 font-extrabold text-sm hover:bg-rose-50 transition-all shadow-md group cursor-pointer"
                    >
                      <span>Shop Deals</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>

                  {/* 4 Value Badges */}
                  <div className="pt-6 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-rose-100 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Huge Discounts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Top Brands</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Easy EMI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Exchange Offers</span>
                    </div>
                  </div>
                </div>

                {/* Right: Floating Badges, Countdown Timer & Device Montage */}
                <div className="md:col-span-5 relative flex flex-col items-center">
                  <div className="w-full flex items-center justify-between gap-3 mb-4">
                    {/* Up to 70% Off Badge */}
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 fill-amber-900 text-amber-900" />
                      <span>Up to 70% Off</span>
                    </div>

                    {/* Countdown Timer Box */}
                    <div className="bg-slate-950/80 backdrop-blur-md border border-amber-400/40 rounded-xl px-3.5 py-2 text-center shadow-lg">
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-amber-300 uppercase tracking-widest mb-1">
                        <Zap className="w-3 h-3 fill-amber-300" />
                        <span>Limited Time Only</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-black text-white">
                        <span className="bg-slate-800 px-2 py-0.5 rounded">{String(timeLeft.hrs).padStart(2, '0')}</span>
                        <span>:</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded">{String(timeLeft.mins).padStart(2, '0')}</span>
                        <span>:</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-400">{String(timeLeft.secs).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Device Showcase Visual */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
                    <Image
                      src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80"
                      alt="Deals Fest Tech Showcase"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-950/70 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                SHOP BY DEAL TYPE (6 Cards Row)
                ================================================== */}
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-5">Shop by Deal Type</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
                {[
                  { title: "Today's Deals", desc: 'Top offers of the day', icon: Flame, color: 'text-amber-500' },
                  { title: 'Flash Sale', desc: 'Limited time deals', icon: Zap, color: 'text-rose-500' },
                  { title: 'Bank Offers', desc: 'Extra savings', icon: CreditCard, color: 'text-blue-500' },
                  { title: 'Exchange Offers', desc: 'Upgrade & save', icon: RotateCcw, color: 'text-purple-500' },
                  { title: 'Combo Deals', desc: 'More for less', icon: Gift, color: 'text-emerald-500' },
                  { title: 'Seasonal Sale', desc: 'Festive offers', icon: Sparkles, color: 'text-pink-500' },
                ].map((deal, idx) => {
                  const Icon = deal.icon;
                  return (
                    <div
                      key={idx}
                      className="group bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col items-center justify-between text-center hover:shadow-md hover:border-rose-400 transition-all cursor-pointer min-h-[145px]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Icon className={`w-6 h-6 ${deal.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                          {deal.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 flex items-center justify-center gap-1">
                          <span>{deal.desc}</span>
                          <span className="text-rose-600 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ==================================================
                TODAY'S DEALS PRODUCT ROW (With Live Timer)
                ================================================== */}
            <div id="todays-deals">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Today&apos;s Deals</h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                    <span>{String(timeLeft.hrs).padStart(2, '0')}:{String(timeLeft.mins).padStart(2, '0')}:{String(timeLeft.secs).padStart(2, '0')}</span>
                  </div>
                </div>

                <a
                  href="#todays-deals"
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
                >
                  View All Deals <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7">
                {filteredDeals.map(prod => {
                  const isWishlisted = !!wishlist[prod.id];
                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200 group relative"
                    >
                      {/* Top-Left Red Discount Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-[11px] font-black tracking-wider text-white bg-rose-600 px-2.5 py-1 rounded-lg shadow-xs uppercase">
                          {prod.discount}% OFF
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(prod.id)}
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full border flex items-center justify-center transition-colors z-10 cursor-pointer ${
                          isWishlisted
                            ? 'bg-rose-50 border-rose-200 text-rose-500'
                            : 'bg-white/80 backdrop-blur-xs border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                      </button>

                      {/* Product Image */}
                      <div className="w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-50/70 mb-4 flex items-center justify-center p-3">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Details */}
                      <div className="space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{prod.brand}</p>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 mt-0.5">
                            {prod.name}
                          </h4>

                          {/* Rating & Reviews */}
                          <div className="flex items-center gap-1.5 text-xs pt-1">
                            <div className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                              <span>{prod.rating}</span>
                            </div>
                            <span className="text-slate-400">({prod.reviews})</span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="pt-3">
                          <div className="flex items-baseline gap-2.5">
                            <span className="text-base sm:text-lg font-black text-slate-900">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{prod.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {prod.discount}% OFF
                            </span>
                          </div>

                          {prod.emi && (
                            <p className="text-[11px] text-slate-500 font-medium mt-1">
                              EMI from <span className="font-bold text-slate-700">{prod.emi}</span>/month
                            </p>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={() => handleAddToCart(prod)}
                          className="mt-4 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs hover:shadow-md cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ==================================================
                DEAL CATEGORIES (4 Cards Row)
                ================================================== */}
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-5">Deal Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                {[
                  {
                    name: 'Smartphones',
                    offer: 'Up to 40% OFF',
                    href: '/smartphones',
                    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80',
                  },
                  {
                    name: 'Laptops',
                    offer: 'Up to 45% OFF',
                    href: '/laptops',
                    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80',
                  },
                  {
                    name: 'Audio & ANC',
                    offer: 'Up to 60% OFF',
                    href: '/audio',
                    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
                  },
                  {
                    name: 'Smart Home',
                    offer: 'Up to 50% OFF',
                    href: '/smart-home',
                    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-md transition-all group min-h-[190px]"
                  >
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900">{item.name}</h4>
                      <p className="text-xs font-extrabold text-blue-600 mt-1">{item.offer}</p>
                    </div>

                    <div className="w-full h-24 relative rounded-xl overflow-hidden my-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================================================
                BOTTOM 3 HIGHLIGHT CARDS
                ================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-3">
              {/* Card 1: Bank Offers */}
              <div className="rounded-2xl p-6 sm:p-7 border border-rose-200/80 bg-gradient-to-br from-rose-50 to-red-100 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[180px]">
                <div className="space-y-2 max-w-[70%]">
                  <h4 className="text-base sm:text-lg font-black text-rose-900">Bank Offers</h4>
                  <p className="text-xs sm:text-[13px] text-rose-700 font-medium">
                    Up to ₹10,000 Instant Discount
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2.5">
                    <span className="text-[10px] font-black bg-white text-rose-700 px-2.5 py-1 rounded shadow-xs border border-rose-200">
                      SBI
                    </span>
                    <span className="text-[10px] font-black bg-white text-rose-700 px-2.5 py-1 rounded shadow-xs border border-rose-200">
                      HDFC
                    </span>
                    <span className="text-[10px] font-black bg-white text-rose-700 px-2.5 py-1 rounded shadow-xs border border-rose-200">
                      ICICI
                    </span>
                    <span className="text-[10px] font-black bg-white text-rose-700 px-2.5 py-1 rounded shadow-xs border border-rose-200">
                      AXIS
                    </span>
                  </div>
                </div>
                <div className="absolute right-3 bottom-3 w-20 h-20 rounded-2xl bg-rose-200/60 flex items-center justify-center">
                  <CreditCard className="w-9 h-9 text-rose-600" />
                </div>
              </div>

              {/* Card 2: Exchange Offers */}
              <div className="rounded-2xl p-6 sm:p-7 border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[180px]">
                <div className="space-y-2 max-w-[70%]">
                  <h4 className="text-base sm:text-lg font-black text-blue-900">Exchange Offers</h4>
                  <p className="text-xs sm:text-[13px] text-blue-700 font-medium">
                    Upgrade to new. Get best value.
                  </p>
                  <div className="pt-2.5">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      <span>Check Value</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                <div className="absolute right-3 bottom-3 w-20 h-20 rounded-2xl bg-blue-200/60 flex items-center justify-center">
                  <RotateCcw className="w-9 h-9 text-blue-600" />
                </div>
              </div>

              {/* Card 3: Combo Deals */}
              <div className="rounded-2xl p-6 sm:p-7 border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[180px]">
                <div className="space-y-2 max-w-[70%]">
                  <h4 className="text-base sm:text-lg font-black text-amber-900">Combo Deals</h4>
                  <p className="text-xs sm:text-[13px] text-amber-800 font-medium">
                    Buy More. Save More.
                  </p>
                  <div className="pt-2.5">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs"
                    >
                      <span>Explore Combos</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                <div className="absolute right-3 bottom-3 w-20 h-20 rounded-2xl bg-amber-200/60 flex items-center justify-center">
                  <Gift className="w-9 h-9 text-amber-600" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
