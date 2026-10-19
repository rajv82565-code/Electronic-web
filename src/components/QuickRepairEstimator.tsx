'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, ShieldCheck, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/components/ProductCard';

const DEVICE_OPTIONS = [
  {
    id: 'iphone',
    name: 'Apple iPhone',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=120&auto=format&fit=crop&q=80',
    modelBadge: '13 / 14 / 15 Series',
  },
  {
    id: 'galaxy',
    name: 'Samsung Galaxy',
    brand: 'Samsung',
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&auto=format&fit=crop&q=80',
    modelBadge: 'S23 / S24 / Ultra',
  },
  {
    id: 'macbook',
    name: 'Apple MacBook',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&auto=format&fit=crop&q=80',
    modelBadge: 'Air & Pro (M1-M4)',
  },
  {
    id: 'windows-laptop',
    name: 'Dell / HP Laptop',
    brand: 'Dell',
    thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=120&auto=format&fit=crop&q=80',
    modelBadge: 'XPS / ThinkPad',
  },
  {
    id: 'headphones',
    name: 'Sony ANC Audio',
    brand: 'Sony',
    thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=120&auto=format&fit=crop&q=80',
    modelBadge: 'WH-1000XM4/XM5',
  },
  {
    id: 'smartwatch',
    name: 'Apple Watch',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=80',
    modelBadge: 'Series 8 / 9 / Ultra',
  },
];

const ISSUE_OPTIONS: Record<string, { label: string; basePrice: number; turnaround: string }> = {
  screen: { label: 'Cracked Display / Touch Malfunction', basePrice: 2499, turnaround: 'Same Day' },
  battery: { label: 'Battery Drain / Won’t Hold Charge', basePrice: 1499, turnaround: '2 Hours' },
  port: { label: 'Charging Port & USB-C Failure', basePrice: 999, turnaround: 'Same Day' },
  liquid: { label: 'Liquid Damage & Motherboard Diagnosis', basePrice: 2999, turnaround: '24-48 Hours' },
  camera: { label: 'Blurry Camera Lens / Sensor Defect', basePrice: 1799, turnaround: 'Same Day' },
};

export default function QuickRepairEstimator() {
  const router = useRouter();
  const [selectedDevice, setSelectedDevice] = useState(DEVICE_OPTIONS[0].id);
  const [selectedIssue, setSelectedIssue] = useState('screen');

  const currentDevice = DEVICE_OPTIONS.find(d => d.id === selectedDevice) || DEVICE_OPTIONS[0];
  const currentIssue = ISSUE_OPTIONS[selectedIssue] || ISSUE_OPTIONS.screen;

  const multiplier =
    selectedDevice === 'macbook' ? 2.4 : selectedDevice === 'iphone' ? 1.6 : selectedDevice === 'windows-laptop' ? 1.4 : 1.0;
  const estimatedCost = Math.round(currentIssue.basePrice * multiplier);

  const handleBook = () => {
    router.push(
      `/repairs/new?device=${encodeURIComponent(currentDevice.name)}&brand=${encodeURIComponent(
        currentDevice.brand
      )}&issue=${encodeURIComponent(currentIssue.label)}`
    );
  };

  return (
    <div className="h-full flex flex-col justify-between bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)] transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0 border border-amber-200 shadow-2xs">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-[#1E293B]">Instant Repair Price Estimator</h3>
            <p className="text-xs sm:text-sm text-[#64748B]">Calculate transparent pricing with OEM parts & 6-month warranty.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Device selector as rich, spacious chips with real product thumbnails */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">
              1. Select Your Device
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DEVICE_OPTIONS.map(d => {
                const isSelected = selectedDevice === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDevice(d.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all duration-150 cursor-pointer min-h-[64px] ${
                      isSelected
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md ring-2 ring-[#2563EB]/25 scale-[1.02]'
                        : 'bg-[#F8FAFC] text-[#1E293B] border-[#E5E7EB] hover:border-blue-300 hover:bg-white'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-lg p-1 shrink-0 overflow-hidden flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : 'bg-white border border-[#E5E7EB]'
                    }`}>
                      <img
                        src={d.thumbnail}
                        alt={d.name}
                        className={`w-full h-full object-cover rounded-md ${isSelected ? '' : 'mix-blend-multiply'}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>
                        {d.name}
                      </p>
                      <p className={`text-[11px] truncate ${isSelected ? 'text-blue-100' : 'text-[#64748B]'}`}>
                        {d.modelBadge}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        {/* Issue selector */}
        <div>
          <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
            2. Select Hardware Issue
          </label>
          <select
            value={selectedIssue}
            onChange={e => setSelectedIssue(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#1E293B] focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            {Object.entries(ISSUE_OPTIONS).map(([key, opt]) => (
              <option key={key} value={key}>
                {opt.label} — (Est. {opt.turnaround})
              </option>
            ))}
          </select>
        </div>

        {/* Price Output Box */}
        <div className="bg-[#F8FAFC] border border-blue-200/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Estimated Repair Cost</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#2563EB]">{formatPrice(estimatedCost)}</span>
              <span className="text-xs text-[#64748B] font-medium">(Includes All OEM Parts & Labor)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#0EA5A0] font-semibold mt-1.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 6M SmartShield Warranty
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Free Doorstep Pickup
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBook}
            className="w-full sm:w-auto btn-primary text-xs py-3 px-6 shrink-0"
          >
            Book Doorstep Pickup <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
