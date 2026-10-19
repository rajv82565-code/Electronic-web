'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Clock,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Cpu,
  Gamepad2,
  Sparkles,
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  badgeType: 'primary' | 'warranty' | 'alert';
  title: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  perks: string[];
  imageUrl: string;
  bgGradient: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'FLAGSHIP LAUNCH 2026',
    badgeType: 'primary',
    title: 'Experience The Future of',
    highlight: 'Flagship Electronics',
    subtitle: 'Official Apple, Samsung & Sony devices with direct OEM sealed warranty, instant delivery & zero-cost EMI starting ₹1,499/mo.',
    ctaText: 'Explore Flagship Tech',
    ctaLink: '/products',
    secondaryCtaText: 'Compare Devices',
    secondaryCtaLink: '/compare',
    perks: ['100% Genuine Sealed Units', 'Free Express Delivery', '7-Day Return Guarantee'],
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=85',
    bgGradient: 'from-blue-100/90 via-slate-50 to-white',
  },
  {
    id: 2,
    badge: 'SMARTSHIELD PROTECTION',
    badgeType: 'warranty',
    title: 'Zero Paperwork. Complete',
    highlight: 'Digital Warranty Vault',
    subtitle: 'Every order automatically registers serial numbers into your SmartShield vault for instant 1-click doorstep claims & repairs.',
    ctaText: 'Activate SmartShield',
    ctaLink: '/warranty',
    secondaryCtaText: 'Register Serial No.',
    secondaryCtaLink: '/warranty/register',
    perks: ['Genuine OEM Parts', 'Digital Certificate Storage', 'Instant 1-Click Claims'],
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=85',
    bgGradient: 'from-teal-100/80 via-slate-50 to-white',
  },
  {
    id: 3,
    badge: 'CERTIFIED REPAIR HUB',
    badgeType: 'alert',
    title: 'Doorstep Technician Service &',
    highlight: 'Live Stage Kanban Tracking',
    subtitle: 'Certified hardware engineers arrive at your door for screens, batteries, and logic board issues with upfront transparent quotes.',
    ctaText: 'Book Doorstep Repair',
    ctaLink: '/repairs/new',
    secondaryCtaText: 'Track Repair Status',
    secondaryCtaLink: '/repairs',
    perks: ['Free Doorstep Pickup', 'Stage-by-Stage Tracking', '90-Day Service Warranty'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=85',
    bgGradient: 'from-amber-100/70 via-slate-50 to-white',
  },
];

const CATEGORY_STRIP = [
  { name: 'Smartphones', href: '/products?category=smartphones', icon: Smartphone, tag: 'Up to 30% Off' },
  { name: 'Laptops', href: '/products?category=laptops', icon: Laptop, tag: 'Intel & M4' },
  { name: 'Audio & ANC', href: '/products?category=headphones', icon: Headphones, tag: 'Studio Sound' },
  { name: 'Wearables', href: '/products?category=smart-watches', icon: Watch, tag: 'ECG Certified' },
  { name: 'Accessories', href: '/products?category=computer-accessories', icon: Cpu, tag: 'GaN Chargers' },
  { name: 'Gaming Consoles', href: '/products?category=gaming-devices', icon: Gamepad2, tag: 'PS5 & OLED' },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = () => {
    setCurrent(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = SLIDES[current];

  return (
    <div className="w-full bg-[#F8FAFC]">
      {/* Full-Width Amazon-Style Banner Stage */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden bg-white border-b border-[#E2E8F0]"
      >
        <div
          className={`min-h-[460px] md:min-h-[520px] flex items-center transition-all duration-700 bg-gradient-to-r ${slide.bgGradient}`}
        >
          <div className="w-[min(94%,1440px)] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Left Content */}
              <div className="md:col-span-7 space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2">
                  {slide.badgeType === 'warranty' ? (
                    <span className="bg-teal-50 text-teal-800 border border-teal-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <Shield className="w-3.5 h-3.5 text-[#0EA5A0]" />
                      {slide.badge}
                    </span>
                  ) : slide.badgeType === 'alert' ? (
                    <span className="bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <Wrench className="w-3.5 h-3.5 text-[#F59E0B]" />
                      {slide.badge}
                    </span>
                  ) : (
                    <span className="bg-blue-50 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <Zap className="w-3.5 h-3.5 fill-[#2563EB] text-[#2563EB]" />
                      {slide.badge}
                    </span>
                  )}
                </div>

                {/* H1 Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight leading-[1.12]">
                  {slide.title}{' '}
                  <span className="text-[#2563EB] block sm:inline">
                    {slide.highlight}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-[#475569] text-sm sm:text-base leading-relaxed max-w-xl">
                  {slide.subtitle}
                </p>

                {/* Standardized Pill Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={slide.ctaLink}
                    className="btn-primary text-sm py-3 px-7 flex items-center gap-2"
                  >
                    {slide.ctaText} <ArrowRight className="w-4 h-4" />
                  </Link>

                  {slide.secondaryCtaText && slide.secondaryCtaLink && (
                    <Link
                      href={slide.secondaryCtaLink}
                      className="btn-secondary text-sm py-3 px-6"
                    >
                      {slide.secondaryCtaText}
                    </Link>
                  )}
                </div>

                {/* Trust Perks */}
                <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E2E8F0]">
                  {slide.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#0EA5A0]" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Visual Stage */}
              <div className="md:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-[420px] aspect-4/3 sm:aspect-square rounded-2xl bg-white p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E2E8F0] flex items-center justify-center overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="relative z-10 w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E2E8F0] shadow-sm flex items-center gap-2 text-xs font-bold text-[#1E293B]">
                    <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>24/7 Verified Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#1E293B] hover:text-[#2563EB] shadow-md border border-[#E2E8F0] flex items-center justify-center transition-all cursor-pointer z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#1E293B] hover:text-[#2563EB] shadow-md border border-[#E2E8F0] flex items-center justify-center transition-all cursor-pointer z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === current ? 'w-8 h-2.5 bg-[#2563EB]' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
