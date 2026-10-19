'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Camera,
  Zap,
  Keyboard,
  Music2,
  Gamepad2,
  Headphones,
  Laptop,
  BatteryCharging,
  Home,
  Watch,
  Smartphone,
  Tablet,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Wrench,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice } from '@/components/ProductCard';

interface CategoryMetadata {
  icon: any;
  iconBg: string;
  desc: string;
  image: string;
  popularBrands: string[];
}

const CATEGORY_META: Record<string, CategoryMetadata> = {
  Cameras: {
    icon: Camera,
    iconBg: 'bg-blue-50 text-[#2563EB]',
    desc: 'Full-frame mirrorless cameras, 4K/8K cine lenses & creator vlogging gear.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Sony', 'Canon', 'Fujifilm', 'Nikon', 'DJI'],
  },
  Chargers: {
    icon: Zap,
    iconBg: 'bg-emerald-50 text-[#059669]',
    desc: 'GaN ultra-fast multi-port chargers, MagSafe wireless pucks & travel adapters.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Anker', 'Apple', 'Samsung', 'Belkin', 'Ugreen'],
  },
  'Computer Accessories': {
    icon: Keyboard,
    iconBg: 'bg-purple-50 text-[#7C3AED]',
    desc: 'Ergonomic mechanical keyboards, precision mice, monitors & desktop docks.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Logitech', 'Razer', 'Dell', 'Apple', 'Keychron'],
  },
  Earbuds: {
    icon: Music2,
    iconBg: 'bg-rose-50 text-[#E11D48]',
    desc: 'True wireless earbuds with active noise cancellation & spatial audio.',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Apple', 'Sony', 'Bose', 'Sennheiser', 'JBL'],
  },
  'Gaming Devices': {
    icon: Gamepad2,
    iconBg: 'bg-indigo-50 text-[#4F46E5]',
    desc: 'Next-gen gaming consoles, VR headsets, mechanical controllers & gear.',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['PlayStation', 'Xbox', 'Nintendo', 'Razer', 'ASUS ROG'],
  },
  Headphones: {
    icon: Headphones,
    iconBg: 'bg-amber-50 text-[#D97706]',
    desc: 'Over-ear audiophile headphones, wireless ANC headsets & studio monitors.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Sony', 'Bose', 'Sennheiser', 'Marshall', 'Apple'],
  },
  Laptops: {
    icon: Laptop,
    iconBg: 'bg-blue-50 text-[#2563EB]',
    desc: 'Ultra-thin notebooks, high-performance creator workstations & gaming laptops.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Apple', 'Dell', 'ASUS ROG', 'HP', 'Lenovo'],
  },
  'Power Banks': {
    icon: BatteryCharging,
    iconBg: 'bg-teal-50 text-[#0D9488]',
    desc: 'High-capacity portable batteries, fast-charging PD packs & solar bricks.',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Anker', 'Xiaomi', 'Belkin', 'Ambrane', 'Baseus'],
  },
  'Smart Home': {
    icon: Home,
    iconBg: 'bg-orange-50 text-[#EA580C]',
    desc: '4K OLED Smart TVs, AI voice hubs, smart lighting & home automation.',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['LG', 'Samsung', 'Philips Hue', 'Amazon Echo', 'Google Nest'],
  },
  'Smart Watches': {
    icon: Watch,
    iconBg: 'bg-pink-50 text-[#DB2777]',
    desc: 'Fitness trackers, cellular smartwatches, AMOLED displays & health monitors.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Amazfit'],
  },
  Smartphones: {
    icon: Smartphone,
    iconBg: 'bg-blue-50 text-[#2563EB]',
    desc: 'Flagship smartphones, 5G smartphones, foldables, and everyday powerhouses.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Apple', 'Samsung', 'OnePlus', 'Google Pixel', 'Xiaomi'],
  },
  Tablets: {
    icon: Tablet,
    iconBg: 'bg-violet-50 text-[#7C3AED]',
    desc: 'Productivity tablets, stylus-ready screens, lightweight pads & kids editions.',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80',
    popularBrands: ['Apple', 'Samsung', 'Lenovo', 'Xiaomi', 'OnePlus'],
  },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col justify-between text-[#172033]"
      style={{
        background:
          'radial-gradient(circle at 15% 10%, rgba(37,99,235,0.08), transparent 35%), #F8FAFC',
      }}
    >
      <Header />

      <main className="w-[min(94%,1440px)] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-14">
        {/* Premium Section Header with Right-Side CTA Card */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-7">
          <div className="max-w-[650px]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Curated Technology Collections
            </div>

            {/* Main Heading */}
            <h1
              className="font-extrabold text-[#172033] tracking-tight leading-[1.15] mb-3"
              style={{ fontSize: 'clamp(30px, 3.5vw, 44px)' }}
            >
              Explore <span className="text-[#2563EB]">Gadget Categories</span>
            </h1>

            {/* Description */}
            <p className="text-[#64748B] text-base leading-[1.6]">
              Discover 100% genuine consumer electronics backed by official brand warranty,
              doorstep certified repairs, and lightning-fast delivery.
            </p>
          </div>

          {/* Right-Side Lifestyle CTA Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-4 sm:gap-6 lg:max-w-md w-full lg:w-auto shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 shadow-2xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#172033] leading-snug">
                  Find the perfect tech for your lifestyle
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Top brands. Best prices. Trusted by 50,000+ customers.
                </p>
              </div>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md shrink-0 whitespace-nowrap cursor-pointer"
            >
              View All Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Category Grid */}
        {loading ? (
          <div className="category-discovery-grid">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#E2E8F0] rounded-[18px] h-96 skeleton animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="category-discovery-grid">
            {categories.map(cat => {
              const meta: CategoryMetadata = CATEGORY_META[cat.category_name] || {
                icon: Layers,
                iconBg: 'bg-blue-50 text-[#2563EB]',
                desc: 'Explore authentic high-tech devices and reliable electronic accessories.',
                image:
                  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
                popularBrands: ['Samsung', 'Apple', 'Sony'],
              };
              const IconComponent = meta.icon;

              return (
                <div
                  key={cat.category_id}
                  className="category-card group"
                >
                  {/* Category Image Stage (16:7 aspect ratio) */}
                  <div className="category-img-stage">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={meta.image}
                      alt={cat.category_name}
                      loading="lazy"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  {/* Card Content Area */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Category Header Row: Icon + Title + Product Count */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`category-icon-box ${meta.iconBg}`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#172033] truncate group-hover:text-[#2563EB] transition-colors">
                            {cat.category_name}
                          </h2>
                        </div>
                        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569]">
                          {cat.product_count || 0} Products
                        </span>
                      </div>

                      {/* Description (2 lines clamp) */}
                      <p className="text-[#64748B] text-[13px] leading-[1.5] line-clamp-2 min-h-[39px] mb-3.5">
                        {meta.desc}
                      </p>

                      {/* Top Brands Chips */}
                      <div className="mb-4">
                        <p className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                          Top brands:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {meta.popularBrands.map(brand => (
                            <span
                              key={brand}
                              className="category-brand-chip"
                            >
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Row: Starting Price + Browse CTA */}
                    <div className="pt-3.5 border-t border-[#F1F5F9] flex items-center justify-between mt-auto gap-2">
                      <div>
                        <span className="block text-[11px] text-[#64748B] font-medium leading-none mb-1">
                          Starting from
                        </span>
                        <span className="text-[16px] sm:text-[17px] font-extrabold text-[#172033] leading-none">
                          {cat.min_price ? formatPrice(cat.min_price) : '₹4,999'}
                        </span>
                      </div>
                      <Link
                        href={`/products?category=${cat.category_id}`}
                        className="category-browse-btn"
                      >
                        Browse Category <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Value Props Benefit Strip */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9] mt-7">
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4 first:pt-0 first:px-0">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-[#2563EB]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[#172033] font-bold text-sm">Direct Brand Warranty</h3>
              <p className="text-[#64748B] text-xs mt-0.5">
                Every gadget includes up to 24 months official OEM coverage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
            <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 text-[#0EA5A0]">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[#172033] font-bold text-sm">Doorstep Certified Repairs</h3>
              <p className="text-[#64748B] text-xs mt-0.5">
                Pickup, live stage tracking, and certified technician service.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 text-[#F59E0B]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[#172033] font-bold text-sm">Express Safe Shipping</h3>
              <p className="text-[#64748B] text-xs mt-0.5">
                Tamper-evident seal and shockproof protective packaging.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
