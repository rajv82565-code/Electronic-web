'use client';
import { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Bot,
  Shield,
  Wrench,
  Package,
  ChevronRight,
  Paperclip,
  Smile,
  Headphones,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'bot' | 'user' | 'agent';
  text: string;
  time: string;
  actionLink?: { href: string; label: string };
}

type NavTab = 'repair' | 'warranty' | 'orders';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<NavTab>('repair');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! 👋 Welcome to TechVolt Support Hub. How can we help you today with your device, warranty, or repair?',
      time: 'Just now',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  /* ── Existing quick-prompt logic (unchanged) ── */
  const handleQuickPrompt = (prompt: string, type: 'repair' | 'warranty' | 'order' | 'tech') => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let replyMsg: Message;
    if (type === 'repair') {
      replyMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'You can check your repair progress on your live Kanban timeline, or submit a new pickup request for screen, battery, or motherboard diagnosis.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: { href: '/repairs', label: 'View Repair Timelines' },
      };
    } else if (type === 'warranty') {
      replyMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'All devices purchased at TechVolt come with 12 to 24 months certified OEM warranty coverage automatically registered to your account.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: { href: '/warranty', label: 'Check Registered Warranties' },
      };
    } else if (type === 'order') {
      replyMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'You can track dispatch, shipping milestones, and delivery estimates for all your orders directly in your customer dashboard.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: { href: '/orders', label: 'Track Recent Orders' },
      };
    } else {
      replyMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Our certified hardware technicians are available Mon–Sat (9 AM – 8 PM) for doorstep diagnostics and emergency repairs.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: { href: '/repairs/new', label: 'Book Technician Visit' },
      };
    }

    setMessages(prev => [...prev, userMsg, replyMsg]);
  };

  /* ── Existing send logic (unchanged) ── */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: data.reply || 'Thank you for reaching out! A technical specialist will follow up shortly.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `Thank you for your message regarding "${userText}". Our hardware & warranty desk has logged this. You can track your repairs and warranties anytime in your dashboard!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionLink: { href: '/dashboard', label: 'Go to Dashboard' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Quick action cards data ── */
  const QUICK_ACTIONS = [
    {
      label: 'Track Repair',
      icon: Wrench,
      bg: '#EAF3FF',
      color: '#2563EB',
      border: '#BFDBFE',
      prompt: 'Track my active repair status',
      type: 'repair' as const,
    },
    {
      label: 'Check Warranty',
      icon: Shield,
      bg: '#EAFBF7',
      color: '#0D9488',
      border: '#99F6E4',
      prompt: 'Check my warranty coverage',
      type: 'warranty' as const,
    },
    {
      label: 'My Orders',
      icon: Package,
      bg: '#EEF4FF',
      color: '#4F46E5',
      border: '#C7D2FE',
      prompt: 'Check my order status',
      type: 'order' as const,
    },
    {
      label: 'Talk to Agent',
      icon: Headphones,
      bg: '#F4EAFE',
      color: '#7C3AED',
      border: '#DDD6FE',
      prompt: 'Connect me with a live support agent',
      type: 'tech' as const,
    },
  ];

  /* ── Nav tabs data ── */
  const NAV_TABS: { id: NavTab; label: string; icon: React.ElementType; prompt: string; type: 'repair' | 'warranty' | 'order' }[] = [
    { id: 'repair', label: 'Track Repair', icon: Wrench, prompt: 'Track my active repair status', type: 'repair' },
    { id: 'warranty', label: 'Warranty', icon: Shield, prompt: 'Check my warranty coverage', type: 'warranty' },
    { id: 'orders', label: 'Orders', icon: Package, prompt: 'Check my order status', type: 'order' },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════
          FLOATING LAUNCHER BUTTON
          ══════════════════════════════════════════ */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Support & Repairs"
          className="fixed z-[9999] flex items-center gap-3 text-white font-bold cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            right: '24px',
            bottom: '24px',
            height: '52px',
            padding: '10px 20px 10px 16px',
            borderRadius: '999px',
            fontSize: '16px',
            background: 'linear-gradient(135deg, #2563EB 0%, #0B63F6 100%)',
            boxShadow: '0 8px 28px rgba(37,99,235,0.40), 0 2px 8px rgba(37,99,235,0.20)',
          }}
        >
          {/* Chat icon with green online dot */}
          <div className="relative flex-shrink-0">
            <div
              className="flex items-center justify-center"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.18)',
              }}
            >
              <MessageCircle className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            {/* Green online dot */}
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0B63F6]"
              style={{ backgroundColor: '#14E0B5' }}
            />
          </div>

          {/* Vertical divider */}
          <span
            className="hidden sm:block flex-shrink-0"
            style={{
              width: '1px',
              height: '22px',
              background: 'rgba(255,255,255,0.3)',
            }}
          />

          {/* Label + arrow */}
          <span className="hidden sm:inline whitespace-nowrap">Support &amp; Repairs</span>
          <ArrowRight className="hidden sm:inline w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
        </button>
      )}

      {/* ══════════════════════════════════════════
          EXPANDED SUPPORT PANEL
          ══════════════════════════════════════════ */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="TechVolt Support Panel"
          aria-modal="true"
          className="fixed z-[9999] flex flex-col"
          style={{
            /* Desktop */
            right: '24px',
            bottom: '24px',
            width: '450px',
            maxWidth: 'calc(100vw - 32px)',
            height: 'min(720px, calc(100vh - 40px))',
            background: '#FFFFFF',
            border: '1px solid #BFDBFE',
            borderRadius: '26px',
            overflow: 'hidden',
            boxShadow: '0 25px 70px rgba(15,23,42,0.20), 0 0 0 1px rgba(37,99,235,0.06)',
            animation: 'chatPanelIn 220ms cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          {/* ── HEADER ── */}
          <div
            className="relative flex-shrink-0 flex items-start justify-between overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #123B91 0%, #0B2A6F 55%, #061B4D 100%)',
              minHeight: '152px',
              padding: '20px 20px 20px 20px',
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute pointer-events-none select-none"
              style={{
                top: '-40px',
                right: '-40px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
              }}
            />
            <div
              className="absolute pointer-events-none select-none"
              style={{
                bottom: '-30px',
                left: '30%',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
              }}
            />

            {/* Left: Avatar + title */}
            <div className="flex items-start gap-4 relative z-10">
              {/* Robot avatar */}
              <div
                className="flex-shrink-0 flex items-center justify-center relative"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  background: '#2563EB',
                  boxShadow: '0 8px 24px rgba(37,99,235,0.40)',
                }}
              >
                <Bot className="w-8 h-8 text-white" strokeWidth={1.8} />
                {/* Green online dot */}
                <span
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0B2A6F]"
                  style={{ backgroundColor: '#14E0B5' }}
                />
              </div>

              {/* Title block */}
              <div className="mt-1">
                <h2
                  className="text-white font-extrabold tracking-tight"
                  style={{ fontSize: '22px', lineHeight: 1.2 }}
                >
                  TechVolt Support
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#14E0B5' }}
                  />
                  <span
                    className="font-semibold text-[13px]"
                    style={{ color: '#E2E8F0' }}
                  >
                    Technical Desk • Online
                  </span>
                </div>
              </div>
            </div>

            {/* Right: helper text + close */}
            <div className="flex flex-col items-end gap-3 relative z-10 flex-shrink-0 ml-2">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close support"
                className="flex items-center justify-center cursor-pointer transition-all hover:bg-white/10 active:scale-95"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.20)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#FFFFFF',
                }}
              >
                <X className="w-5 h-5" strokeWidth={2.2} />
              </button>

              {/* Handwritten-style helper */}
              <div
                className="text-right leading-tight select-none"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontStyle: 'italic',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.4,
                }}
              >
                Here to keep<br />you powered
              </div>
            </div>
          </div>

          {/* ── NAV TABS ── */}
          <div
            className="flex-shrink-0 flex items-center"
            style={{
              background: '#FFFFFF',
              borderBottom: '1px solid #E8EFF8',
              padding: '14px 16px',
              gap: '2px',
              minHeight: '72px',
            }}
          >
            {NAV_TABS.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <div key={tab.id} className="flex items-center flex-1 min-w-0">
                  <button
                    aria-label={
                      tab.id === 'repair'
                        ? 'Track repair'
                        : tab.id === 'warranty'
                        ? 'Check warranty'
                        : 'View orders'
                    }
                    onClick={() => {
                      setActiveTab(tab.id);
                      handleQuickPrompt(tab.prompt, tab.type);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 font-bold text-[13px] rounded-full"
                    style={{
                      padding: '8px 10px',
                      background: isActive ? '#EFF6FF' : 'transparent',
                      color: isActive ? '#2563EB' : '#334155',
                      border: isActive ? '1.5px solid #BFDBFE' : '1.5px solid transparent',
                    }}
                  >
                    <Icon
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: isActive ? '#2563EB' : '#64748B' }}
                      strokeWidth={2.2}
                    />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                  {/* Vertical separator */}
                  {idx < NAV_TABS.length - 1 && (
                    <span
                      className="flex-shrink-0"
                      style={{
                        width: '1px',
                        height: '20px',
                        background: '#E2E8F0',
                        margin: '0 2px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── CHAT AREA (flex-1, scrollable) ── */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              background: '#F8FAFC',
              padding: '20px 16px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Bot avatar */}
                {msg.sender !== 'user' && (
                  <div
                    className="flex-shrink-0 flex items-center justify-center self-end"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      background: '#EFF6FF',
                      color: '#2563EB',
                    }}
                  >
                    <Bot className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className="flex flex-col"
                  style={{ maxWidth: '78%' }}
                >
                  <div
                    style={
                      msg.sender === 'user'
                        ? {
                            background: '#2563EB',
                            color: '#FFFFFF',
                            borderRadius: '20px 20px 4px 20px',
                            padding: '14px 16px',
                            fontSize: '14px',
                            lineHeight: 1.55,
                          }
                        : {
                            background: '#FFFFFF',
                            border: '1px solid #DCE5F2',
                            borderRadius: '20px 20px 20px 4px',
                            padding: '16px 18px',
                            fontSize: '14px',
                            lineHeight: 1.55,
                            color: '#172033',
                            boxShadow: '0 4px 14px rgba(15,23,42,0.05)',
                          }
                    }
                  >
                    <p style={{ margin: 0 }}>{msg.text}</p>
                    {msg.actionLink && (
                      <Link
                        href={msg.actionLink.href}
                        onClick={() => setIsOpen(false)}
                        className="mt-2.5 inline-flex items-center gap-1.5 font-bold text-[12px] transition-colors hover:opacity-80"
                        style={{
                          color: msg.sender === 'user' ? '#BFDBFE' : '#2563EB',
                          background: msg.sender === 'user' ? 'rgba(255,255,255,0.15)' : '#EFF6FF',
                          padding: '5px 10px',
                          borderRadius: '999px',
                        }}
                      >
                        {msg.actionLink.label}
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  <p
                    className="mt-1"
                    style={{
                      fontSize: '11px',
                      color: '#94A3B8',
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                    }}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 items-center">
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    background: '#EFF6FF',
                    color: '#2563EB',
                  }}
                >
                  <Bot className="w-5 h-5 animate-pulse" strokeWidth={1.8} />
                </div>
                <div
                  className="flex items-center gap-1.5"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #DCE5F2',
                    borderRadius: '20px',
                    padding: '12px 16px',
                  }}
                >
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── QUICK ACTION CARDS ── */}
          <div
            className="flex-shrink-0 grid grid-cols-2"
            style={{
              padding: '14px 14px 10px',
              gap: '10px',
              background: '#F8FAFC',
              borderTop: '1px solid #E8EFF8',
            }}
          >
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleQuickPrompt(action.prompt, action.type)}
                  aria-label={
                    action.type === 'repair'
                      ? 'Track repair'
                      : action.type === 'warranty'
                      ? 'Check warranty'
                      : action.type === 'order'
                      ? 'View orders'
                      : 'Talk to support agent'
                  }
                  className="flex items-center gap-2.5 cursor-pointer font-bold text-[13px] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                  style={{
                    background: action.bg,
                    border: `1px solid ${action.border}`,
                    borderRadius: '14px',
                    padding: '12px 14px',
                    color: action.color,
                    textAlign: 'left',
                  }}
                >
                  <Icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: action.color }}
                    strokeWidth={2.2}
                  />
                  <span className="leading-tight">{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── MESSAGE COMPOSER ── */}
          <form
            onSubmit={handleSendMessage}
            className="flex-shrink-0 flex items-center gap-2"
            style={{
              padding: '10px 14px',
              background: '#FFFFFF',
              borderTop: '1px solid #E8EFF8',
            }}
          >
            <div
              className="flex-1 flex items-center gap-2"
              style={{
                background: '#FFFFFF',
                border: '2px solid #DCE5F2',
                borderRadius: '22px',
                height: '52px',
                padding: '6px 14px',
                transition: 'border-color 0.15s',
              }}
              onFocusCapture={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#2563EB';
              }}
              onBlurCapture={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#DCE5F2';
              }}
            >
              <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0 cursor-pointer hover:text-slate-600" />
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about repairs, warranties, or specs..."
                className="flex-1 bg-transparent text-[14px] text-[#172033] focus:outline-none placeholder:text-[#94A3B8]"
                style={{ border: 'none', outline: 'none' }}
              />
              <Smile className="w-4 h-4 text-slate-400 flex-shrink-0 cursor-pointer hover:text-slate-600" />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex-shrink-0 flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              <Send className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} strokeWidth={2.2} />
            </button>
          </form>

          {/* ── FOOTER ── */}
          <div
            className="flex-shrink-0 flex items-center justify-between"
            style={{
              padding: '8px 16px 12px',
              background: '#FFFFFF',
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <div className="flex items-center gap-1.5">
              <Shield
                className="w-3.5 h-3.5"
                style={{ color: '#0D9488' }}
                strokeWidth={2}
              />
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                Safe • Secure • Official Support
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Powered by{' '}
              <strong style={{ color: '#2563EB', fontWeight: 700 }}>TechVolt</strong>
            </span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          PANEL ANIMATION KEYFRAMES
          ══════════════════════════════════════════ */}
      <style>{`
        @keyframes chatPanelIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Mobile: near-full-screen panel */
        @media (max-width: 599px) {
          [aria-label="TechVolt Support Panel"] {
            left: 10px !important;
            right: 10px !important;
            bottom: 10px !important;
            width: auto !important;
            max-width: none !important;
            height: calc(100vh - 20px) !important;
            border-radius: 22px !important;
          }
        }

        /* Hide the floating launcher on mobile when panel is closed */
        @media (max-width: 599px) {
          button[aria-label="Support & Repairs"] {
            right: 14px !important;
            bottom: 14px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </>
  );
}
