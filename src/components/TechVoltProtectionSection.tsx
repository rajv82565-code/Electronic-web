'use client';

import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  Wrench,
  FileCheck,
  ArrowRight,
  MapPin,
  Users,
  Star,
} from 'lucide-react';

export interface TestimonialItem {
  name: string;
  city: string;
  role: string;
  avatar: string;
  device: string;
  deviceImage: string;
  text: string;
  rating: number;
  date: string;
}

interface ProtectionProps {
  testimonials?: TestimonialItem[];
}

export default function TechVoltProtectionSection({ testimonials }: ProtectionProps) {
  return (
    <section className="protection-section w-full select-none">
      <div className="protection-container mx-auto">
        {/* ==================================================
            1. SECTION HEADER (Centered Badge, Title, Subtitle)
            ================================================== */}
        <div className="text-center max-w-5xl mx-auto mb-[28px]">
          {/* Top Center Pill Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-3"
            style={{
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 12px',
            }}
          >
            <Shield className="w-3.5 h-3.5 fill-[#2563EB] text-[#2563EB]" />
            <span>YOUR TRUST, OUR PRIORITY</span>
          </div>

          {/* Main Heading with "TechVolt" in #2563EB */}
          <h2
            className="font-extrabold tracking-tight text-[#172033] font-['Poppins']"
            style={{
              fontSize: 'clamp(32px, 3.8vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
            }}
          >
            How <span style={{ color: '#2563EB' }}>TechVolt</span> Protects Your Electronics
          </h2>

          {/* Subtitle */}
          <p
            className="mt-3 text-[#64748B] text-[15px] sm:text-[17px] leading-relaxed max-w-3xl mx-auto"
            style={{ lineHeight: 1.6 }}
          >
            Every gadget comes backed by authentic warranty registration, official certified service, and
            <br className="hidden sm:inline" /> doorstep repair tracking.
          </p>
        </div>

        {/* ==================================================
            2. THREE FEATURE CARDS (Equal Height, Responsive Grid)
            ================================================== */}
        <div className="protection-grid grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* --------------------------------------------------
              CARD 1: Order Genuine Hardware
              -------------------------------------------------- */}
          <div className="protection-card relative group flex flex-col justify-between overflow-hidden">
            {/* Top row: Faded 01 + Circular Arrow Button */}
            <div className="flex items-start justify-between w-full mb-3 sm:mb-4">
              <span
                className="font-black select-none tracking-tighter"
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#DCE8FA',
                  lineHeight: 1,
                }}
              >
                01
              </span>

              <Link
                href="/products"
                className="w-[38px] h-[38px] rounded-full bg-white border border-[#DCE5F2] flex items-center justify-center text-[#2563EB] shadow-2xs hover:bg-[#EFF6FF] hover:border-[#2563EB] transition-all cursor-pointer group/btn"
                title="Browse Genuine Hardware"
                aria-label="Browse Genuine Hardware"
              >
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Middle Section: Content + Visual Stage */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-1">
              <div className="flex-1 min-w-0 pr-1">
                {/* Icon Container */}
                <div
                  className="flex items-center justify-center mb-3 sm:mb-4 shadow-2xs"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    backgroundColor: '#EFF6FF',
                  }}
                >
                  <ShieldCheck className="w-7 h-7 text-[#2563EB]" />
                </div>

                {/* Title */}
                <h3 className="text-[18px] sm:text-[19px] xl:text-[20px] font-bold text-[#172033] mb-1.5 leading-snug">
                  Order Genuine Hardware
                </h3>

                {/* Description */}
                <p className="text-[13px] sm:text-[14px] text-[#64748B] leading-[1.6]">
                  Direct from 100% brand-new, authorized OEM devices with verified serial numbers and genuine sealed packaging.
                </p>
              </div>

              {/* Right Side Visual Mockup (Smartphone + Laptop) */}
              <div className="w-[140px] sm:w-[160px] lg:w-[150px] xl:w-[200px] shrink-0 max-w-[45%] flex items-center justify-center relative self-end sm:self-center">
                <img
                  src="/images/protection-card1-devices.jpg"
                  alt="Genuine Smartphone and Laptop Hardware"
                  className="w-full h-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* --------------------------------------------------
              CARD 2: Auto-Registered Warranty
              -------------------------------------------------- */}
          <div className="protection-card relative group flex flex-col justify-between overflow-hidden">
            {/* Top row: Faded 02 */}
            <div className="flex items-start justify-between w-full mb-3 sm:mb-4">
              <span
                className="font-black select-none tracking-tighter"
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#DCE8FA',
                  lineHeight: 1,
                }}
              >
                02
              </span>
            </div>

            {/* Middle Section: Content + Visual Stage */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-1">
              <div className="flex-1 min-w-0 pr-1">
                {/* Icon Container */}
                <div
                  className="flex items-center justify-center mb-3 sm:mb-4 shadow-2xs"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    backgroundColor: '#EFF6FF',
                  }}
                >
                  <FileCheck className="w-7 h-7 text-[#2563EB]" />
                </div>

                {/* Title */}
                <h3 className="text-[18px] sm:text-[19px] xl:text-[20px] font-bold text-[#172033] mb-1.5 leading-snug">
                  Auto-Registered Warranty
                </h3>

                {/* Description */}
                <p className="text-[13px] sm:text-[14px] text-[#64748B] leading-[1.6]">
                  Your purchase is automatically registered with brand warranty systems for hassle-free claims.
                </p>
              </div>

              {/* Right Side Visual Mockup (Shield + Warranty Registered Badge) */}
              <div className="w-[130px] sm:w-[150px] lg:w-[150px] xl:w-[200px] shrink-0 max-w-[45%] flex items-center justify-center relative self-end sm:self-center">
                <img
                  src="/images/protection-card2-warranty.jpg"
                  alt="Auto Registered SmartShield Warranty"
                  className="w-full h-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Bottom Row: Circular Arrow Button in bottom-right corner */}
            <div className="flex justify-end w-full mt-3">
              <Link
                href="/warranty"
                className="w-[38px] h-[38px] rounded-full bg-white border border-[#DCE5F2] flex items-center justify-center text-[#2563EB] shadow-2xs hover:bg-[#EFF6FF] hover:border-[#2563EB] transition-all cursor-pointer group/btn"
                title="View SmartShield Warranty"
                aria-label="View SmartShield Warranty"
              >
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* --------------------------------------------------
              CARD 3: Doorstep Technician Repairs
              -------------------------------------------------- */}
          <div className="protection-card relative group flex flex-col justify-between overflow-hidden">
            {/* Top row: Faded 03 */}
            <div className="flex items-start justify-between w-full mb-3 sm:mb-4">
              <span
                className="font-black select-none tracking-tighter"
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#DCE8FA',
                  lineHeight: 1,
                }}
              >
                03
              </span>
            </div>

            {/* Middle Section: Content + Visual Stage */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-1">
              <div className="flex-1 min-w-0 pr-1">
                {/* Icon Container */}
                <div
                  className="flex items-center justify-center mb-3 sm:mb-4 shadow-2xs"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    backgroundColor: '#EFF6FF',
                  }}
                >
                  <Wrench className="w-7 h-7 text-[#2563EB]" />
                </div>

                {/* Title */}
                <h3 className="text-[18px] sm:text-[19px] xl:text-[20px] font-bold text-[#172033] mb-1.5 leading-snug">
                  Doorstep Technician Repairs
                </h3>

                {/* Description with subtle bolding on doorstep repairs */}
                <p className="text-[13px] sm:text-[14px] text-[#64748B] leading-[1.6]">
                  Track and schedule <strong className="font-semibold text-[#334155]">doorstep repairs</strong> with certified technicians and genuine parts, right from your account.
                </p>
              </div>

              {/* Right Side Visual Stage (Technician Photo + Location Pin Badge) */}
              <div className="w-[130px] sm:w-[150px] lg:w-[150px] xl:w-[190px] shrink-0 max-w-[45%] relative self-end sm:self-center">
                {/* Blue Map Location Pin Badge */}
                <div className="absolute top-1 left-1 z-10 w-8 h-8 rounded-full bg-blue-100/90 text-[#2563EB] flex items-center justify-center shadow-xs border border-blue-200">
                  <MapPin className="w-4 h-4 fill-[#2563EB] text-white" />
                </div>

                <div className="w-full h-[130px] sm:h-[145px] xl:h-[160px] rounded-xl overflow-hidden shadow-2xs border border-slate-100">
                  <img
                    src="/images/protection-card3-technician.jpg"
                    alt="Doorstep Certified Technician"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row: Circular Arrow Button in bottom-right corner */}
            <div className="flex justify-end w-full mt-3">
              <Link
                href="/repairs"
                className="w-[38px] h-[38px] rounded-full bg-white border border-[#DCE5F2] flex items-center justify-center text-[#2563EB] shadow-2xs hover:bg-[#EFF6FF] hover:border-[#2563EB] transition-all cursor-pointer group/btn"
                title="Book Doorstep Repair"
                aria-label="Book Doorstep Repair"
              >
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================
            3. MANUAL WARRANTY FULL-WIDTH HORIZONTAL CTA
            ================================================== */}
        <div
          className="protection-cta flex flex-col md:flex-row items-center justify-between gap-5 transition-all shadow-xs"
          style={{
            background: 'linear-gradient(90deg, #F0F7FF 0%, #F8FBFF 100%)',
            border: '1px solid #D7E7FF',
            borderRadius: '18px',
          }}
        >
          {/* Left: Shield Icon + Text */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 text-center sm:text-left flex-1">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#A7F3D0] text-[#059669] flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-6 h-6 text-[#10B981]" />
            </div>

            <div>
              <h4 className="text-base sm:text-[17px] font-bold text-[#172033] leading-snug">
                Have an existing device? You can also register manual warranties.
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                Scan your invoice, enter device details, and get verified warranty coverage.
              </p>
            </div>
          </div>

          {/* Right: Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
            <Link
              href="/warranty/register"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-full text-xs sm:text-[13px] font-bold transition-all bg-white text-[#2563EB] border-2 border-[#2563EB] hover:bg-blue-50 active:scale-95 shadow-2xs whitespace-nowrap"
              style={{
                borderRadius: '999px',
                padding: '12px 22px',
                fontWeight: 700,
                color: '#2563EB',
                borderColor: '#2563EB',
              }}
            >
              Register Warranty &rarr;
            </Link>

            <Link
              href="/repairs/new"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-full text-xs sm:text-[13px] font-bold transition-all bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:scale-95 shadow-sm hover:shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
              style={{
                borderRadius: '999px',
                padding: '12px 22px',
                fontWeight: 700,
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
              }}
            >
              <Wrench className="w-4 h-4" />
              <span>Book Doorstep Repair &rarr;</span>
            </Link>
          </div>
        </div>

        {/* ==================================================
            4. TRUSTED USERS SECTION (Divider, Badge, Heading)
            ================================================== */}
        <div className="pt-7 sm:pt-9 text-center">
          {/* Badge with horizontal lines */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-[1px] bg-slate-200 flex-1 max-w-[120px] sm:max-w-[200px]" />
            <span
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
              style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                borderRadius: '999px',
              }}
            >
              <Users className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>JOIN OUR GROWING COMMUNITY</span>
            </span>
            <div className="h-[1px] bg-slate-200 flex-1 max-w-[120px] sm:max-w-[200px]" />
          </div>

          {/* Heading with 50,000 in Blue */}
          <h2
            className="font-extrabold text-[#172033] tracking-tight font-['Poppins']"
            style={{
              fontSize: 'clamp(24px, 4vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            Trusted by Over{' '}
            <span style={{ color: '#2563EB' }}>50,000</span>{' '}
            Tech Enthusiasts
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-2xl mx-auto">
            Real feedback on retail speed, warranty activation, and doorstep certified repairs.
          </p>
        </div>

        {/* Optional Customer Review Grid */}
        {testimonials && testimonials.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)] transition-all duration-200 flex flex-col justify-between h-full"
              >
                <div>
                  {/* Top: Customer info & stars */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-2xs ring-1 ring-[#E2E8F0]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-[#1E293B] text-base">{t.name}</h4>
                          <span className="inline-flex items-center text-[10px] font-extrabold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded-full">
                            ✓ Verified
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B]">{t.city} • {t.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-[#F59E0B]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                      ))}
                    </div>
                  </div>

                  {/* Review Quote */}
                  <p className="text-[#334155] text-sm sm:text-[15px] leading-relaxed italic mb-6 relative pl-4 border-l-2 border-blue-400">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                {/* Device Purchased Footer Badge */}
                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2 bg-[#F8FAFC]/80 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-4 sm:p-5 rounded-b-2xl">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={t.deviceImage}
                      alt={t.device}
                      className="w-11 h-11 rounded-lg object-contain bg-white border border-[#E5E7EB] p-1 shadow-2xs"
                    />
                    <div>
                      <span className="text-[10px] font-semibold text-[#64748B] block">Verified Hardware</span>
                      <span className="text-xs font-bold text-[#1E293B] line-clamp-1">{t.device}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#94A3B8] font-medium shrink-0">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
