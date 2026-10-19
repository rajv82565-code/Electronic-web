'use client';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Check,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const CATEGORY_SHORTCUTS = [
  {
    name: 'Smartphones',
    tag: 'Up to 30% Off',
    href: '/products?category=smartphones',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&q=80',
  },
  {
    name: 'Laptops',
    tag: 'Intel & M4',
    href: '/products?category=laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
  },
  {
    name: 'Audio & ANC',
    tag: 'Studio Sound',
    href: '/products?category=headphones',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&q=80',
  },
  {
    name: 'Wearables',
    tag: 'ECG Certified',
    href: '/products?category=smart-watches',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&q=80',
  },
  {
    name: 'Accessories',
    tag: 'GaN Chargers',
    href: '/products?category=computer-accessories',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&q=80',
  },
  {
    name: 'Gaming Gear',
    tag: 'PS5 & OLED',
    href: '/products?category=gaming-devices',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&q=80',
  },
];

const BENEFIT_CARDS = [
  {
    title: '100% Genuine Tech',
    desc: 'Direct OEM factory-sealed devices with manufacturer verification.',
    badge: 'OEM Verified',
    icon: ShieldCheck,
    iconBg: 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]',
    badgeClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  },
  {
    title: 'Official Warranty',
    desc: 'Up to 24 months SmartShield coverage with 1-click claims.',
    badge: '24-Month Coverage',
    icon: Award,
    iconBg: 'bg-[#F0FDFA] text-[#0EA5A0] border-[#CCFBF1]',
    badgeClass: 'bg-[#F0FDFA] text-[#0EA5A0] border-[#99F6E4]',
  },
  {
    title: 'Free Express Delivery',
    desc: 'Lightning-fast delivery across 19,000+ pincodes on orders over ₹999.',
    badge: 'Above ₹999 Orders',
    icon: Truck,
    iconBg: 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]',
    badgeClass: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
  },
  {
    title: '7-Day Easy Replacement',
    desc: 'No-questions-asked doorstep replacements for damaged or defective items.',
    badge: 'Hassle-Free Return',
    icon: RotateCcw,
    iconBg: 'bg-[#FAF5FF] text-[#9333EA] border-[#F3E8FF]',
    badgeClass: 'bg-[#FAF5FF] text-[#9333EA] border-[#E9D5FF]',
  },
];

const BRANDS = [
  {
    name: 'Samsung',
    tier: 'Flagship Partner',
    renderLogo: () => (
      <span className="font-sans font-black text-[16px] sm:text-[17px] tracking-wider text-[#1428A0]">
        SAMSUNG
      </span>
    ),
  },
  {
    name: 'Sony',
    tier: 'Official Alpha & Audio Hub',
    renderLogo: () => (
      <span className="font-serif font-black text-[17px] sm:text-[18px] tracking-[0.2em] text-[#000000]">
        SONY
      </span>
    ),
  },
  {
    name: 'Dell',
    tier: 'Premier Commercial Partner',
    renderLogo: () => (
      <div className="flex items-center justify-center">
        <svg className="h-[22px] w-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#0076CE" strokeWidth="7" />
          <text x="50" y="60" textAnchor="middle" fill="#0076CE" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="26" letterSpacing="1">DELL</text>
        </svg>
      </div>
    ),
  },
  {
    name: 'Bose',
    tier: 'Certified Acoustics Partner',
    renderLogo: () => (
      <span className="font-sans font-black italic text-[17px] sm:text-[18px] tracking-widest text-[#000000]">
        BOSE
      </span>
    ),
  },
  {
    name: 'OnePlus',
    tier: 'Direct Brand Authorized',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 justify-center">
        <div className="w-[18px] h-[18px] bg-[#EB0029] rounded-[3px] flex items-center justify-center text-white text-[10px] font-black leading-none">
          1+
        </div>
        <span className="font-sans font-black text-[14px] sm:text-[15px] tracking-wide text-[#EB0029]">
          ONEPLUS
        </span>
      </div>
    ),
  },
  {
    name: 'Apple',
    tier: 'Authorized Reseller',
    renderLogo: () => (
      <div className="flex items-center justify-center">
        <svg className="w-[20px] h-[20px] fill-black" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.93-12-14.54-6.42-9.87-11.5-20.9-15.24-33.09-3.74-12.19-5.61-23.75-5.61-34.69 0-14.49 3.65-26.68 10.95-36.57 7.3-9.89 16.58-14.93 27.84-15.12 4.9.13 10.22 1.34 15.96 3.62 5.74 2.29 9.87 3.5 12.39 3.63 2.12-.13 6.37-1.38 12.74-3.75 6.37-2.37 11.83-3.44 16.39-3.21 12.59.87 22.84 5.74 30.76 14.61-11.05 6.69-16.48 15.86-16.29 27.51.2 9.07 3.65 16.92 10.36 23.55 6.71 6.63 14.78 10.45 24.2 11.46-2.12 6.69-4.78 13.58-7.98 20.67zM119.22 31.84c0-7.25 2.53-13.97 7.59-20.16 5.06-6.19 11.22-9.83 18.48-10.92.2 1.3.3 2.55.3 3.75 0 7.15-2.67 14.07-8.01 20.76-5.34 6.69-11.45 10.37-18.36 11.04-.1-.8-.1-2-.1-4.47z" />
        </svg>
      </div>
    ),
  },
];

export default function BrandAuthorizedStrip() {
  return (
    <section id="techvolt-trust-section" className="w-full bg-[#F8FAFC] py-10 sm:py-14 border-b border-[#E2E8F0]">
      <div
        className="brand-strip-container w-[min(96%,1440px)] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10"
        style={{ width: 'min(96%, 1440px)', marginLeft: 'auto', marginRight: 'auto' }}
      >
        
        {/* ==================================================
            1. CATEGORY SHORTCUTS
            ================================================== */}
        <div>
          {/* Eyebrow Label */}
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE]/80 px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> Fast Department Navigation
            </span>
          </div>

          {/* Title Row: Heading & Subtitle (Left) + All Categories Button (Right) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-[#172033] tracking-tight">
                Category <span className="text-[#2563EB]">Shortcuts</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-normal">
                Quick access to our most popular categories. Find what you need, faster.
              </p>
            </div>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-white border border-[#DCE5F0] hover:border-[#2563EB] hover:bg-blue-50/50 text-[#2563EB] font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all duration-200 self-start sm:self-auto shrink-0"
            >
              <span>All Categories</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 6 Category Cards Grid: Full-Width 6-Columns on Desktop, 3 on Tablet, 2 on Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORY_SHORTCUTS.map(c => (
              <Link
                key={c.name}
                href={c.href}
                className="group bg-white border border-[#DCE5F0] hover:border-[#BFDBFE] rounded-[14px] p-3 sm:p-3.5 flex items-center gap-3 w-full shadow-sm hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* 54x54px Product Thumbnail Box */}
                <div className="w-[54px] h-[54px] min-w-[54px] rounded-[14px] bg-[#EFF6FF] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-250 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Name & Subtitle */}
                <div className="flex-1 min-w-0 pr-1">
                  <h3 className="font-bold text-[14px] sm:text-[15px] text-[#172033] group-hover:text-[#2563EB] transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                    {c.name}
                  </h3>
                  <p className="text-[12px] sm:text-[13px] font-semibold text-[#14B8A6] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                    {c.tag}
                  </p>
                </div>

                {/* Right Arrow */}
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0 ml-auto" />
              </Link>
            ))}
          </div>
        </div>

        {/* ==================================================
            2. WHY SHOP WITH TECHVOLT (Buyer Protection Container)
            ================================================== */}
        <div className="relative rounded-[20px] border border-[#DCEAF8] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(30,64,175,0.05)] overflow-hidden bg-gradient-to-br from-[#F8FBFF] to-[#EEF6FF]">
          
          {/* Top-Right Decorative Slanted Slashes */}
          <div className="absolute top-6 right-7 hidden md:flex items-center gap-1.5 select-none pointer-events-none opacity-30">
            <div className="w-1.5 h-7 bg-[#93C5FD] transform -skew-x-[25deg] rounded-full" />
            <div className="w-1.5 h-7 bg-[#93C5FD] transform -skew-x-[25deg] rounded-full" />
            <div className="w-1.5 h-7 bg-[#93C5FD] transform -skew-x-[25deg] rounded-full" />
            <div className="w-1.5 h-7 bg-[#93C5FD] transform -skew-x-[25deg] rounded-full" />
          </div>

          {/* Section Header */}
          <div className="mb-7">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE]/80 px-3.5 py-1 rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" /> Buyer Protection & Assurance
            </span>
            <h2 className="text-2xl sm:text-[26px] lg:text-[30px] font-extrabold text-[#172033] tracking-tight">
              Why Shop With <span className="text-[#2563EB]">TechVolt?</span>
            </h2>
            <p className="text-sm text-[#64748B] mt-1.5">
              Authorized factory-sealed hardware with verified warranty and doorstep services.
            </p>
          </div>

          {/* 4 Benefit Cards Grid: 4 cols on Desktop, 2 cols on Tablet, 1 col on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
            {BENEFIT_CARDS.map(b => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="bg-white rounded-[14px] border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex items-start gap-4 group"
                >
                  <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border ${b.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[15px] text-[#172033] group-hover:text-[#2563EB] transition-colors leading-tight">
                      {b.title}
                    </h3>
                    <p className="text-[12px] text-[#64748B] mt-1.5 leading-relaxed">
                      {b.desc}
                    </p>
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mt-2.5 ${b.badgeClass}`}>
                      {b.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            3. OFFICIAL BRAND AUTHORIZATION
            ================================================== */}
        <div className="rounded-[20px] bg-white border border-[#DCE5F0] px-6 sm:px-8 py-7 sm:py-9 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {/* Section Header centered on mobile, left-aligned on desktop */}
          <div className="mb-6 sm:mb-7">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0EA5A0] bg-[#F0FDFA] border border-[#99F6E4]/80 px-3.5 py-1 rounded-full mb-3">
              <Check className="w-3.5 h-3.5" /> Official Brand Authorization
            </span>
            <h2 className="text-xl sm:text-[22px] font-extrabold text-[#172033] tracking-tight">
              Trusted Global Brands. <span className="text-[#2563EB]">100% Authorized.</span>
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              TechVolt is an officially authorized reseller for all major electronics brands.
            </p>
          </div>

          {/* 6 Brand Cells: clean grid with separator lines */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {BRANDS.map(brand => (
              <div
                key={brand.name}
                className="flex flex-col items-center justify-center text-center py-4 px-2 rounded-[12px] bg-[#F8FAFC] hover:bg-white hover:border hover:border-[#E2E8F0] hover:shadow-sm transition-all duration-200 min-w-0 group"
              >
                <div className="h-7 flex items-center justify-center mb-2.5">
                  {brand.renderLogo()}
                </div>
                <span className="text-[10px] font-bold text-[#0EA5A0] bg-[#F0FDFA] border border-[#CCFBF1] px-2 py-0.5 rounded-full whitespace-nowrap">
                  {brand.tier}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
