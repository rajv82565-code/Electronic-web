'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Truck,
  Wrench,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Gamepad2,
  Tablet,
  Camera,
  Star,
  Quote,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import BrandAuthorizedStrip from '@/components/BrandAuthorizedStrip';
import FlashDeals from '@/components/FlashDeals';
import QuickRepairEstimator from '@/components/QuickRepairEstimator';
import WarrantyLookupWidget from '@/components/WarrantyLookupWidget';
import TechVoltProtectionSection from '@/components/TechVoltProtectionSection';

const CATEGORIES = [
  { name: 'Smartphones', slug: 'smartphones', icon: Smartphone, count: '14 Models' },
  { name: 'Laptops', slug: 'laptops', icon: Laptop, count: '18 Models' },
  { name: 'Tablets', slug: 'tablets', icon: Tablet, count: '9 Models' },
  { name: 'Smart Watches', slug: 'smart-watches', icon: Watch, count: '12 Models' },
  { name: 'Audio & ANC', slug: 'headphones', icon: Headphones, count: '15 Models' },
  { name: 'Gaming Gear', slug: 'gaming-devices', icon: Gamepad2, count: '8 Consoles' },
  { name: 'Cameras', slug: 'cameras', icon: Camera, count: '6 Cameras' },
];

const SERVICE_STEPS = [
  {
    step: '01',
    title: 'Order Genuine Hardware',
    desc: 'Choose from 100% brand-new, authorized OEM electronics with transparent pricing and tamper-evident packaging.',
    icon: CheckCircle2,
    badge: 'Step 1',
    highlight: false,
  },
  {
    step: '02',
    title: 'Auto-Registered Warranty',
    desc: 'Your serial numbers & invoices are instantly cataloged into your digital SmartShield warranty vault.',
    icon: Shield,
    badge: 'Step 2',
    highlight: true,
  },
  {
    step: '03',
    title: 'Doorstep Technician Repairs',
    desc: 'If anything malfunctions, book 24h certified repair with real-time stage progression tracking.',
    icon: Wrench,
    badge: 'Step 3',
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',
    city: 'Bengaluru',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    device: 'Samsung Galaxy S25 Ultra',
    deviceImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&auto=format&fit=crop&q=80',
    text: 'The warranty registration was instant after my Galaxy S25 Ultra arrived. When my screen had an issue, a certified technician picked it up next day and replaced the panel under warranty. Flawless service!',
    rating: 5,
    date: 'Purchased 2 weeks ago',
  },
  {
    name: 'Priya Sundaram',
    city: 'Mumbai',
    role: 'Software Architect',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    device: 'Apple MacBook Pro 16" M4',
    deviceImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&auto=format&fit=crop&q=80',
    text: 'Best retail electronics shopping experience. The specs compare tool helped me choose between Dell XPS 15 and MacBook Pro M4. Fast delivery and zero paperwork needed for warranty.',
    rating: 5,
    date: 'Purchased 1 month ago',
  },
  {
    name: 'Vikram Joshi',
    city: 'Delhi NCR',
    role: 'Tech Lead & Gamer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    device: 'PlayStation 5 Pro',
    deviceImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=150&auto=format&fit=crop&q=80',
    text: 'ElectroVolt sets a new standard. Knowing that repair requests have a live stage timeline with technician notes gave me complete peace of mind with my PS5 Pro purchase.',
    rating: 5,
    date: 'Purchased 3 weeks ago',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'deals'>('featured');

  useEffect(() => {
    fetch('/api/products?limit=16')
      .then(r => r.json())
      .then(d => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const featuredList = products.filter(p => p.featured === 1);
  const dealsList = products.filter(p => p.discount > 0);
  const displayList =
    activeTab === 'featured'
      ? featuredList.length
        ? featuredList
        : products.slice(0, 8)
      : activeTab === 'deals'
      ? dealsList.length
        ? dealsList
        : products.slice(0, 8)
      : products.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#1E293B]">
      <Header />

      {/* Hero Banner Carousel (Amazon/Flipkart full-width responsive stage) */}
      <HeroCarousel />

      {/* Manufacturer Trust Strip (4 equal-width cards on light band) */}
      <BrandAuthorizedStrip />

      {/* MegaTech Drop Limited-Time Deals Stage (Full-width up to 1800px) */}
      <FlashDeals />

      {/* Main Content Sections */}
      <main className="flex-1 w-full space-y-16 lg:space-y-20 py-8 sm:py-12 lg:py-16 pb-28 md:pb-20">

        {/* Category Grid (Clean Tiles across Mobile & Desktop) */}
        <section className="w-[min(96%,1440px)] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3 h-3" /> Hardware Departments
              </span>
              <h2 className="text-2xl sm:text-[28px] font-bold text-[#1E293B] tracking-tight">
                Shop by Hardware Category
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group py-1"
            >
              Explore All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  className="group bg-white rounded-xl border border-[#E5E7EB] p-5 text-center shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)] hover:border-[#2563EB]/50 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-50/70 group-hover:bg-[#2563EB] text-[#2563EB] group-hover:text-white flex items-center justify-center transition-all duration-200 mb-3 shadow-2xs">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
                    {c.name}
                  </h3>
                  <span className="text-[11px] text-[#94A3B8] font-medium mt-1">
                    {c.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Product Grid with Tabs */}
        <section className="w-[min(96%,1440px)] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full mb-2">
                Handpicked Hardware
              </span>
              <h2 className="text-2xl sm:text-[28px] font-bold text-[#1E293B] tracking-tight">
                Trending Electronics & Gadgets
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1.5 rounded-full self-start sm:self-auto border border-[#E2E8F0]">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === 'featured'
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Featured Devices
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === 'deals'
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Top Discount Deals
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === 'new'
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                All Arrivals
              </button>
            </div>
          </div>

          {/* 12-Column Responsive Product Grid: 2 cols on mobile, 4 cols on desktop, 24px gutters */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl h-80 sm:h-96 skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayList.map(prod => (
                <ProductCard key={prod.product_id} product={prod} />
              ))}
            </div>
          )}

          <div className="mt-8 mb-12 sm:mb-16 text-center">
            <Link
              href="/products"
              className="btn-secondary text-sm px-8 py-3.5 rounded-full inline-flex items-center gap-2 font-bold shadow-2xs hover:shadow-sm"
            >
              Explore Complete Product Catalog <ArrowRight className="w-4 h-4 text-[#2563EB]" />
            </Link>
          </div>
        </section>

        {/* Certified Service & Warranty Command Hub (Interactive Homepage Widgets - Equal Height Desktop Grid) */}
        <section className="w-[min(96%,1440px)] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0EA5A0] bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> CERTIFIED TECH SERVICES
            </span>
            <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1E293B] tracking-tight">
              Direct Warranty & Doorstep Repair Hub
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-2 leading-relaxed">
              Check your existing device warranty or calculate instant transparent repair prices with free doorstep pickup.
            </p>
          </div>

          {/* 2-Column Desktop Grid with Equal Height, 1-Col on Mobile/Tablet */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Quick Repair Estimator */}
            <QuickRepairEstimator />

            {/* SmartShield Warranty Lookup */}
            <WarrantyLookupWidget />
          </div>
        </section>

        {/* How TechVolt Protects Your Electronics & Customer Trustimonials (Full-Width Responsive 1800px Section) */}
        <TechVoltProtectionSection testimonials={TESTIMONIALS} />
      </main>

      {/* Mobile Sticky Quick CTA Bar (Above Bottom Nav) */}
      <aside
        aria-label="Quick Action Bar"
        className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] px-4 py-2.5 flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      >
        <Link
          href="/repairs/new"
          className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
        >
          <Wrench className="w-3.5 h-3.5" /> Book Repair
        </Link>
        <Link
          href="/warranty/lookup"
          className="flex-1 bg-white hover:bg-slate-50 border-2 border-[#2563EB] text-[#2563EB] text-xs font-bold py-2 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all"
        >
          <Shield className="w-3.5 h-3.5 text-[#0EA5A0]" /> Check Warranty
        </Link>
      </aside>

      <Footer />
    </div>
  );
}
