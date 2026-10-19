'use client';
import { useState, useEffect } from 'react';
import { CheckCircle2, Wrench, X, Sparkles } from 'lucide-react';

const RECENT_ACTIVITIES = [
  {
    type: 'purchase',
    name: 'Rahul K.',
    city: 'Mumbai',
    item: 'Apple iPhone 15 Pro Max 256GB',
    time: '2 mins ago',
    icon: Sparkles,
    color: 'text-[#2563EB]',
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    type: 'repair',
    name: 'Pooja S.',
    city: 'Bengaluru',
    item: 'Doorstep Screen Replacement (MacBook Pro)',
    time: '4 mins ago',
    icon: Wrench,
    color: 'text-[#0EA5A0]',
    bg: 'bg-teal-50 border-teal-100',
  },
  {
    type: 'purchase',
    name: 'Amit V.',
    city: 'New Delhi',
    item: 'Sony WH-1000XM5 Wireless Headphones',
    time: '7 mins ago',
    icon: Sparkles,
    color: 'text-[#2563EB]',
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    type: 'repair',
    name: 'Vikas R.',
    city: 'Pune',
    item: 'Battery Diagnostics & OEM Replacement',
    time: '9 mins ago',
    icon: Wrench,
    color: 'text-[#0EA5A0]',
    bg: 'bg-teal-50 border-teal-100',
  },
  {
    type: 'purchase',
    name: 'Sneha M.',
    city: 'Hyderabad',
    item: 'Dell XPS 15 OLED Touch Workstation',
    time: '12 mins ago',
    icon: Sparkles,
    color: 'text-[#2563EB]',
    bg: 'bg-blue-50 border-blue-100',
  },
];

export default function LiveSalesTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show after initial 4 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Cycle every 14 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % RECENT_ACTIVITIES.length);
        setVisible(true);
      }, 600);
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const current = RECENT_ACTIVITIES[index];
  const Icon = current.icon;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-30 max-w-xs sm:max-w-sm transition-all duration-500 ease-out transform translate-y-0 opacity-100">
      <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-md rounded-xl p-3 flex items-start gap-3 relative group">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${current.bg} ${current.color}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 pr-4 min-w-0">
          <p className="text-[11px] font-bold text-[#1E293B] leading-tight truncate">
            {current.name} from <span className="text-[#2563EB]">{current.city}</span>
          </p>
          <p className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5 truncate">
            {current.type === 'purchase' ? 'Purchased' : 'Booked'}: {current.item}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-[9px] text-teal-600 font-semibold">
              <CheckCircle2 className="w-2.5 h-2.5" /> Verified Activity
            </span>
            <span className="text-[9px] text-[#94A3B8]">• {current.time}</span>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-[#94A3B8] hover:text-[#475569] p-0.5 rounded transition-colors"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
