'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Shield, Search, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WarrantyLookupWidget() {
  const [serial, setSerial] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) {
      toast.error('Please enter a device serial number');
      return;
    }

    setChecking(true);
    setTimeout(() => {
      const clean = serial.trim().toUpperCase();
      if (clean.includes('IP') || clean.includes('SN') || clean.length >= 8) {
        setResult({
          valid: true,
          serial: clean,
          device: 'Apple iPhone 15 Pro Max 256GB',
          status: 'Active (SmartShield Certified)',
          plan: '24-Month Comprehensive OEM Protection',
          expiryDate: '15 October 2026',
          daysRemaining: 284,
          coveredIssues: 'Display Malfunctions, Internal Battery, Motherboard, Camera Module',
        });
        toast.success('Active Warranty Certificate Found!');
      } else {
        setResult({
          valid: false,
          serial: clean,
          message: 'No active warranty certificate found for this serial number. You can register your invoice now.',
        });
        toast.error('Serial not recognized in database');
      }
      setChecking(false);
    }, 600);
  };

  const handleAutofill = () => {
    setSerial('SN-IP15P-88219');
  };

  return (
    <div className="h-full flex flex-col justify-between bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)] transition-all">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-[#0EA5A0] flex items-center justify-center shrink-0 border border-teal-200 shadow-2xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-[#1E293B]">SmartShield Warranty Lookup</h3>
              <p className="text-xs sm:text-sm text-[#64748B]">Verify official warranty validity and claim eligibility instantly.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutofill}
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] hidden sm:block bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 transition-colors cursor-pointer"
          >
            Autofill Demo Serial
          </button>
        </div>

        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider">
                Enter Device Serial Number
              </label>
              <button
                type="button"
                onClick={handleAutofill}
                className="text-[11px] font-bold text-[#2563EB] sm:hidden underline cursor-pointer"
              >
                Autofill Demo
              </button>
            </div>

            {/* Desktop: side-by-side row; Mobile: stacked vertically */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={serial}
                  onChange={e => setSerial(e.target.value)}
                  placeholder="e.g. SN-IP15P-88219 or SN-GAL24-9910"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] rounded-xl sm:rounded-full pl-11 pr-4 py-3 text-xs sm:text-sm text-[#1E293B] font-mono uppercase tracking-wider focus:outline-none focus:bg-white transition-all shadow-2xs"
                />
              </div>
              <button
                type="submit"
                disabled={checking}
                className="btn-primary text-xs sm:text-sm py-3 px-6 shrink-0 shadow-2xs w-full sm:w-auto cursor-pointer font-bold"
              >
                {checking ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </div>

          {/* Result Box OR Rich Default Guidance State to prevent empty white space */}
          {result ? (
            <div className="animate-in fade-in zoom-in-95 mt-4">
              {result.valid ? (
                <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 sm:p-5 text-xs text-[#1E293B]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0EA5A0]" />
                      <span className="font-bold text-teal-800 text-sm">{result.status}</span>
                    </div>
                    <span className="bg-teal-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {result.daysRemaining} Days Left
                    </span>
                  </div>

                  <p className="font-bold text-[#1E293B] text-sm mb-0.5">{result.device}</p>
                  <p className="text-[#64748B] text-[11px] mb-2 font-mono">Serial: {result.serial}</p>
                  <p className="text-[#64748B] text-xs mb-3">Coverage: {result.coveredIssues}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-teal-200">
                    <span className="text-[11px] text-[#64748B]">
                      Valid through: <strong className="text-[#1E293B]">{result.expiryDate}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setResult(null); setSerial(''); }}
                        className="text-[11px] text-[#64748B] hover:text-[#1E293B] underline cursor-pointer"
                      >
                        Clear
                      </button>
                      <Link
                        href={`/repairs/new?serial=${encodeURIComponent(result.serial)}&device=${encodeURIComponent(
                          result.device
                        )}`}
                        className="btn-secondary text-xs py-1.5 px-4 inline-flex items-center gap-1.5 font-bold"
                      >
                        Claim Free Repair <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 text-xs text-[#1E293B]">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-900 text-sm">{result.message}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <Link
                          href="/warranty/register"
                          className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 font-bold"
                        >
                          Register New Warranty Certificate <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setResult(null); setSerial(''); }}
                          className="text-xs text-[#64748B] hover:text-[#1E293B] underline cursor-pointer"
                        >
                          Try Another
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Default Instruction State — Clean, balanced card filling natural height */
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-5 space-y-3.5 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-[#0EA5A0] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1E293B]">Warranty Status & Protection</h4>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                    Enter a serial number to check warranty eligibility, remaining validity, and instant doorstep claim status.
                  </p>
                </div>
              </div>

              {/* 3 Protection Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#E2E8F0]">
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 text-center shadow-2xs">
                  <span className="block text-[11px] font-bold text-[#1E293B]">100% Genuine</span>
                  <span className="text-[10px] text-[#64748B]">OEM certified parts</span>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 text-center shadow-2xs">
                  <span className="block text-[11px] font-bold text-[#1E293B]">Free Pickup</span>
                  <span className="text-[10px] text-[#64748B]">Doorstep logistics</span>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 text-center shadow-2xs">
                  <span className="block text-[11px] font-bold text-[#1E293B]">Instant Claims</span>
                  <span className="text-[10px] text-[#64748B]">Zero paperwork</span>
                </div>
              </div>

              {/* Footer info bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Database Live & Verified
                </span>
                <Link
                  href="/warranty/register"
                  className="font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline"
                >
                  Register External Invoice →
                </Link>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
