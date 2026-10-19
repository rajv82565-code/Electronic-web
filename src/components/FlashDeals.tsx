'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Clock,
  ShoppingCart,
  Shield,
  ShieldCheck,
  Truck,
  Heart,
  ChevronLeft,
  ChevronRight,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { formatPrice } from '@/components/ProductCard';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface FlashDealItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  claimedPercent: number;
  unitsLeft: number;
  specs: string;
}

const FLASH_ITEMS: FlashDealItem[] = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro (128GB – Natural Titanium)',
    brand: 'APPLE',
    price: 124900,
    originalPrice: 134900,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    claimedPercent: 88,
    unitsLeft: 3,
    specs: 'A17 Pro 3nm chip • 48MP Pro Raw • Titanium Frame',
  },
  {
    id: 3,
    name: 'Sony WH-1000XM5 Wireless ANC Headphones',
    brand: 'SONY',
    price: 26990,
    originalPrice: 34990,
    discount: 23,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    claimedPercent: 92,
    unitsLeft: 2,
    specs: 'Industry-leading ANC • 30h Battery • Auto NC Optimizer',
  },
  {
    id: 4,
    name: 'Apple Watch Series 9 GPS 45mm (Midnight)',
    brand: 'APPLE',
    price: 38990,
    originalPrice: 44900,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    claimedPercent: 76,
    unitsLeft: 6,
    specs: 'S9 SiP chip • Double Tap Gesture • ECG & Blood Oxygen',
  },
  {
    id: 2,
    name: 'Dell XPS 15 9530 OLED (i7 13th Gen, 16GB, 1TB SSD)',
    brand: 'DELL',
    price: 189990,
    originalPrice: 219990,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
    claimedPercent: 81,
    unitsLeft: 4,
    specs: '3.5K OLED Touch • RTX 4060 • CNC Aluminum Body',
  },
];

export default function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 27, seconds: 7 });
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());
  const [activeSlide, setActiveSlide] = useState(0);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (e: React.MouseEvent, item: FlashDealItem) => {
    e.preventDefault();
    addItem({
      product_id: item.id,
      name: item.name,
      price: item.price,
      discount: item.discount,
      images: JSON.stringify([item.image]),
      quantity: 1,
      stock: item.unitsLeft,
      brand: item.brand,
    });
    toast.success(`${item.name} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent, item: FlashDealItem) => {
    e.preventDefault();
    setWishlistedIds(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
        toast('Removed from saved items', { icon: '🗑️' });
      } else {
        next.add(item.id);
        toast.success(`Saved to Wishlist ❤️`);
      }
      return next;
    });
  };

  const handlePrevSlide = () => {
    setActiveSlide(prev => (prev === 0 ? FLASH_ITEMS.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide(prev => (prev === FLASH_ITEMS.length - 1 ? 0 : prev + 1));
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section
      className="megatech-section mt-6 sm:mt-10 mb-8 sm:mb-12 relative select-none"
      style={{
        width: 'min(96%, 1800px)',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {/* ==================================================
          1. MAIN DARK BLUE CONTAINER (Header + Product Stage)
          ================================================== */}
      <div
        className="relative rounded-t-[20px] p-5 sm:p-7 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #0B1736 0%, #102A63 50%, #07142F 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Soft Radial Ambient Glow */}
        <div className="absolute inset-0 overflow-hidden rounded-t-[20px] pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* --------------------------------------------------
            MEGATECH HEADER (Title, Badges, Trust Features, Countdown)
            -------------------------------------------------- */}
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5 pb-6 border-b border-white/10 relative z-10">
          {/* Left Block: Flame icon, Limited Time Deals, Title, Limited Stock, Description */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Golden Rounded Square Flame Box */}
            <div
              className="flex items-center justify-center shrink-0 shadow-lg"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: '#F59E0B',
                color: '#07142F',
              }}
            >
              <Flame className="w-8 h-8 fill-[#07142F] text-[#07142F]" />
            </div>

            <div>
              {/* Promotional Badge Above Title */}
              <div className="mb-1.5">
                <span
                  className="inline-block text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  LIMITED TIME DEALS
                </span>
              </div>

              {/* Title & Limited Stock Badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <h2
                  className="font-extrabold uppercase tracking-tight leading-none font-['Poppins']"
                  style={{
                    fontSize: 'clamp(28px, 3.4vw, 50px)',
                    letterSpacing: '-1.5px',
                    color: '#FFFFFF',
                  }}
                >
                  <span style={{ color: '#FFFFFF' }}>MEGATECH</span>{' '}
                  <span style={{ color: '#60A5FA' }}>DROP</span>
                </h2>

                <span
                  className="text-white text-[12px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs"
                  style={{ backgroundColor: '#F43F5E', color: '#FFFFFF' }}
                >
                  LIMITED STOCK
                </span>
              </div>

              {/* Description */}
              <p
                className="mt-2 leading-relaxed max-w-3xl xl:max-w-none text-[15px] sm:text-[16px]"
                style={{ color: '#CBD5E1', lineHeight: '1.5' }}
              >
                Verified flagship electronics at special clearance prices with full 12M SmartShield Warranty.
              </p>
            </div>
          </div>

          {/* Right Block: 3 Header Trust Features + Live Countdown Box */}
          <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between gap-4 shrink-0">
            {/* 3 Compact Trust Features */}
            <div className="flex items-center gap-4 sm:gap-6 text-slate-200 py-1">
              {/* Trust 1: 100% Genuine Products */}
              <div className="flex items-center gap-2 shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#38BDF8] shrink-0" />
                <div className="leading-tight">
                  <span className="font-bold text-white text-[13px] block">100%</span>
                  <span className="text-slate-300 text-[11px]">Genuine Products</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-[1px] h-7 bg-white/20 hidden sm:block" />

              {/* Trust 2: Free Express Delivery */}
              <div className="flex items-center gap-2 shrink-0">
                <Truck className="w-5 h-5 text-[#38BDF8] shrink-0" />
                <div className="leading-tight">
                  <span className="font-bold text-white text-[13px] block">Free</span>
                  <span className="text-slate-300 text-[11px]">Express Delivery</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-[1px] h-7 bg-white/20 hidden sm:block" />

              {/* Trust 3: 12 Months SmartShield Warranty */}
              <div className="flex items-center gap-2 shrink-0">
                <Shield className="w-5 h-5 text-[#38BDF8] shrink-0" />
                <div className="leading-tight">
                  <span className="font-bold text-white text-[13px] block">12 Months</span>
                  <span className="text-slate-300 text-[11px]">SmartShield Warranty</span>
                </div>
              </div>
            </div>

            {/* Countdown Box */}
            <div
              className="flex items-center gap-2.5 px-4 py-2 sm:py-2.5 rounded-xl shadow-inner text-xs sm:text-sm self-start sm:self-auto"
              style={{
                backgroundColor: '#07142F',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#FBBF24] shrink-0" />
              <span className="text-white font-semibold text-xs sm:text-sm">
                Ends in:
              </span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm">
                <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono font-extrabold border border-white/10">
                  {pad(timeLeft.hours)}h
                </span>
                <span className="text-white/60">:</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono font-extrabold border border-white/10">
                  {pad(timeLeft.minutes)}m
                </span>
                <span className="text-white/60">:</span>
                <span
                  className="px-2 py-0.5 rounded font-black shadow-xs font-mono"
                  style={{
                    backgroundColor: '#FBBF24',
                    color: '#07142F',
                  }}
                >
                  {pad(timeLeft.seconds)}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
            PRODUCT CARDS STAGE (With Circular Carousel Arrows)
            -------------------------------------------------- */}
        <div className="relative mt-6 sm:mt-7">
          {/* Left Carousel Arrow (Vertically centered on product image) */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Deal"
            className="hidden lg:flex absolute left-0 -translate-x-1/2 top-[120px] xl:top-[130px] -translate-y-1/2 z-20 w-[48px] h-[48px] xl:w-[54px] xl:h-[54px] rounded-full text-white shadow-[0_8px_20px_rgba(15,23,42,0.45)] transition-all cursor-pointer items-center justify-center border border-white/20 hover:scale-105 active:scale-95 hover:bg-[#1D4ED8]"
            style={{ backgroundColor: '#0F285E' }}
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Carousel Arrow (Vertically centered on product image) */}
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Deal"
            className="hidden lg:flex absolute right-0 translate-x-1/2 top-[120px] xl:top-[130px] -translate-y-1/2 z-20 w-[48px] h-[48px] xl:w-[54px] xl:h-[54px] rounded-full text-white shadow-[0_8px_20px_rgba(15,23,42,0.45)] transition-all cursor-pointer items-center justify-center border border-white/20 hover:scale-105 active:scale-95 hover:bg-[#1D4ED8]"
            style={{ backgroundColor: '#0F285E' }}
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* 4 Equal-Height Product Cards Grid */}
          <div className="megatech-grid relative z-10 items-stretch">
            {FLASH_ITEMS.map((item) => (
              <div
                key={item.id}
                className="megatech-card bg-white text-[#172033] flex flex-col group h-full rounded-[16px] border border-[#E2E8F0] overflow-hidden"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                }}
              >
                {/* 1. Product Image Stage (16:10 Aspect Ratio, Cover, Badges) */}
                <div
                  className="product-image-wrapper relative w-full aspect-[16/10] bg-[#F8FAFC] overflow-hidden p-3 flex items-center justify-center"
                  style={{
                    aspectRatio: '16 / 10',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-400 ease-out"
                  />

                  {/* Top-Left Discount Badge */}
                  <span
                    className="absolute top-3 left-3 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-[6px] shadow-xs z-10 uppercase tracking-wide"
                    style={{ backgroundColor: '#F43F5E' }}
                  >
                    {item.discount}% OFF
                  </span>

                  {/* Top-Right: Warranty Badge & Wishlist Heart */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <span
                      className="px-2 py-1 rounded-[6px] text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                      style={{
                        backgroundColor: '#ECFEFF',
                        color: '#0F766E',
                        border: '1px solid #99F6E4',
                      }}
                    >
                      <Shield className="w-3.5 h-3.5 text-[#0EA5A0]" /> 12M Warranty
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, item)}
                      className={`w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                        wishlistedIds.has(item.id)
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-white/95 text-[#64748B] hover:text-[#F43F5E] hover:bg-white'
                      }`}
                      title={wishlistedIds.has(item.id) ? 'Saved' : 'Save to Wishlist'}
                      aria-label="Add to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlistedIds.has(item.id) ? 'fill-rose-600 text-rose-600' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 2. Product Information (16px padding, flex-1 column) */}
                <div className="product-info flex flex-col flex-1 p-4 sm:p-4.5">
                  {/* Brand */}
                  <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    {item.brand}
                  </p>

                  {/* Product Title (18px, font-weight 750, clamp 2 lines) */}
                  <h3
                    className="product-title font-bold text-[17px] sm:text-[18px] text-[#172033] group-hover:text-[#2563EB] transition-colors leading-[1.3] mb-1.5"
                    style={{
                      fontWeight: 750,
                      minHeight: '46px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.name}
                  </h3>

                  {/* Product Description / Specs (14px, 2 lines) */}
                  <p
                    className="text-[13px] sm:text-[14px] text-[#64748B] leading-[1.5] mb-3"
                    style={{
                      minHeight: '40px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.specs}
                  </p>

                  {/* Price Row (26px current price, 14px old strikethrough price) */}
                  <div className="flex items-baseline gap-2.5 mb-3.5 flex-wrap">
                    <span
                      className="text-[24px] sm:text-[26px] font-extrabold text-[#172033] tracking-tight whitespace-nowrap leading-none"
                      style={{ fontWeight: 800 }}
                    >
                      {formatPrice(item.price)}
                    </span>
                    <span
                      className="text-[13px] sm:text-[14px] font-medium text-[#94A3B8] line-through whitespace-nowrap leading-none"
                      style={{ textDecoration: 'line-through' }}
                    >
                      {formatPrice(item.originalPrice)}
                    </span>
                  </div>

                  {/* Stock & Claimed Progress Area */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[13px] font-semibold mb-1.5 flex-wrap gap-1">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: '#FEF3C7',
                          color: '#B45309',
                        }}
                      >
                        Only {item.unitsLeft} units left
                      </span>
                      <span className="text-[#64748B] text-xs font-semibold">
                        {item.claimedPercent}% claimed
                      </span>
                    </div>

                    {/* Progress Bar (7px Track) */}
                    <div
                      className="w-full h-[7px] rounded-full overflow-hidden"
                      style={{ backgroundColor: '#E2E8F0' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.claimedPercent}%`,
                          background: 'linear-gradient(90deg, #F59E0B, #F43F5E)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons (Pinned to Bottom) */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2.5 w-full mt-auto">
                    <Link
                      href={`/products/${item.id}`}
                      className="flex-1 h-[40px] text-[13px] font-bold rounded-[10px] transition-all whitespace-nowrap flex items-center justify-center bg-white border border-[#CBD5E1] text-[#334155] hover:bg-slate-50 hover:border-[#94A3B8] hover:text-[#172033]"
                    >
                      View Specs
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, item)}
                      className="flex-1 h-[40px] text-white text-[13px] font-bold rounded-[10px] flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap hover:-translate-y-0.5"
                      style={{ backgroundColor: '#2563EB' }}
                      title="Add to Cart"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================
          2. BOTTOM PROMOTIONAL AREA (White Banner, Dots, CTA)
          ================================================== */}
      <div
        className="w-full bg-[#FFFFFF] border-x border-b border-[#E2E8F0] rounded-b-[20px] px-5 sm:px-7 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
        }}
      >
        {/* Left: Promotional Highlight Message */}
        <div className="flex items-center gap-2 text-sm sm:text-[15px] font-semibold text-[#1E293B]">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB] fill-[#2563EB] shrink-0" />
          <span>Big Brands. Bigger Savings. Don&apos;t Miss Out!</span>
        </div>

        {/* Center: Carousel Dot Indicators */}
        <div className="flex items-center gap-2">
          {FLASH_ITEMS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-200 cursor-pointer ${
                activeSlide === idx
                  ? 'w-6 h-2.5 rounded-full bg-[#2563EB]'
                  : 'w-2.5 h-2.5 rounded-full bg-[#CBD5E1] hover:bg-[#94A3B8]'
              }`}
            />
          ))}
        </div>

        {/* Right: View All Deals Pill Button */}
        <Link
          href="/products?deals=true"
          className="border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-bold transition-all flex items-center gap-1.5 group shrink-0"
        >
          <span>View All Deals</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
