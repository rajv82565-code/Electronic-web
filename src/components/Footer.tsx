'use client';
import Link from 'next/link';
import { Shield, Wrench, Zap, Mail, Phone, MapPin, ArrowUp, Lock, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer mt-20 border-t-2 border-[#2563EB]/40 bg-[#0F172A] text-slate-300 text-sm w-full max-w-full overflow-x-hidden">
      {/* 1. Back to Top Bar (Full-Width, Centered) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className="w-full bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white py-3.5 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border-b border-slate-800/90 text-center tracking-wide"
      >
        <ArrowUp className="w-3.5 h-3.5" /> Back to Top
      </button>

      {/* 2. Main Footer Grid Container (1.5fr 1fr 1fr 1fr Desktop Grid) */}
      <div className="footer-container">
        {/* Column 1: TechVolt Brand Information */}
        <div className="footer-brand space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#2563EB] group-hover:bg-[#1D4ED8] rounded-xl flex items-center justify-center text-white shadow-sm transition-colors">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Tech<span className="text-[#2563EB]">Volt</span>
            </span>
          </Link>

          <p className="text-slate-400 text-xs leading-relaxed max-w-md">
            India&apos;s leading consumer electronics retail platform. Authorized direct brand electronics with integrated SmartShield digital warranty vault and nationwide certified doorstep technician repairs.
          </p>

          <div className="pt-2 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <span className="leading-snug">
                Customer Care: <strong className="text-white">1800-420-VOLT</strong>{' '}
                <span className="text-slate-400 text-[11px] block sm:inline">(Mon–Sun 9 AM – 9 PM)</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#0EA5A0] shrink-0" />
              <span>
                Warranty & Claims: <strong className="text-white">support@techvolt.in</strong>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span className="text-slate-400 leading-snug">
                Registered Office: Electronic City, Bengaluru, Karnataka 560100
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Shop Categories */}
        <div className="footer-column">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800/80">
            Shop Categories
          </h4>
          <ul className="space-y-3 text-xs">
            <li>
              <Link href="/products?category=smartphones" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Flagship Smartphones
              </Link>
            </li>
            <li>
              <Link href="/products?category=laptops" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Laptops & Workstations
              </Link>
            </li>
            <li>
              <Link href="/products?category=tablets" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Tablets & iPads
              </Link>
            </li>
            <li>
              <Link href="/products?category=smart-watches" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Smartwatches & Fitness
              </Link>
            </li>
            <li>
              <Link href="/products?category=headphones" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Studio Audio & ANC
              </Link>
            </li>
            <li>
              <Link href="/products?category=gaming-devices" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Gaming Consoles & VR
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Warranty & Services */}
        <div className="footer-column">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800/80">
            Warranty & Services
          </h4>
          <ul className="space-y-3 text-xs">
            <li>
              <Link href="/warranty" className="text-slate-300 hover:text-[#0EA5A0] hover:underline transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#0EA5A0] shrink-0" /> SmartShield Vault
              </Link>
            </li>
            <li>
              <Link href="/warranty/register" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Register Device Serial No.
              </Link>
            </li>
            <li>
              <Link href="/repairs" className="text-slate-300 hover:text-[#F59E0B] hover:underline transition-colors flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" /> Live Repair Tracker
              </Link>
            </li>
            <li>
              <Link href="/repairs/new" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Book Doorstep Technician
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Customer Portal Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Help & Policies */}
        <div className="footer-column">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800/80">
            Help & Policies
          </h4>
          <ul className="space-y-3 text-xs">
            <li>
              <Link href="/orders" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Track Existing Orders
              </Link>
            </li>
            <li>
              <Link href="/compare" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Hardware Comparison Tool
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-slate-300 hover:text-white hover:underline transition-colors block">
                Customer Sign In / Register
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors block">
                Admin Console
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Footer Bottom: Payment Methods & Assurance Strip */}
      <div className="footer-bottom border-t border-slate-800/80 py-5 bg-[#0B1120] text-xs text-slate-400">
        <div className="footer-bottom-inner flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-300">256-Bit SSL Encrypted Checkout</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">GSTIN: 29AABCE1234F1Z7</span>
          </div>

          {/* Payment method chips with wrapping */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
            {['UPI', 'Visa', 'Mastercard', 'RuPay', 'NetBanking', 'Cash on Delivery'].map((method) => (
              <span
                key={method}
                className="bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded text-[11px] font-semibold text-slate-200 shadow-2xs whitespace-nowrap"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Footer Bottom: Copyright & Legal Policies */}
      <div className="footer-bottom border-t border-slate-900 py-4 bg-[#080D1A] text-[11px] text-slate-500 pb-24 md:pb-6">
        <div className="footer-bottom-inner flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} TechVolt Retail & Repair Technologies Private Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Privacy Notice</span>
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Conditions of Use</span>
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Warranty Policy</span>
            <span className="hover:text-slate-200 cursor-pointer transition-colors">Security Assurance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
