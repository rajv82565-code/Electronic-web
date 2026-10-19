'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import { MessageCircle, Send, Bot, User, Wrench, Shield, Package } from 'lucide-react';

export default function SupportPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore(s => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetch('/api/chat').then(r => r.json()).then(d => { setMessages(d.messages || []); setFetching(false); });
  }, [user, router]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setLoading(true);
    const newMsg = { message: msg, sender: 'user', created_at: new Date().toISOString(), chat_id: Date.now() };
    setMessages(prev => [...prev, newMsg]);
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg, sender: 'user' }) });
    if (res.ok) {
      const updated = await fetch('/api/chat').then(r => r.json());
      setMessages(updated.messages || []);
    }
    setLoading(false);
  };

  const quickReplies = ['How do I track my order?', 'My device screen is cracked', 'Battery draining fast', 'How to register warranty?'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-16 w-full flex flex-col flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-1">
            <MessageCircle className="w-8 h-8 text-cyan-400" /> Customer Support
          </h1>
          <p className="text-slate-400">AI-powered support with live agent escalation</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 flex-1">
          {/* Sidebar */}
          <div className="hidden lg:block space-y-4">
            <div className="card p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
              {[
                { icon: Package, label: 'Track Order', href: '/orders' },
                { icon: Shield, label: 'Warranty', href: '/warranty' },
                { icon: Wrench, label: 'Book Repair', href: '/repairs/new' },
              ].map(({ icon: Icon, label, href }) => (
                <Link key={href} href={href} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm py-2 transition-colors">
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative w-3 h-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-emerald-400 text-xs font-medium">AI Assistant Online</span>
              </div>
              <p className="text-slate-500 text-xs">Response time: {'<'} 30 seconds</p>
            </div>
          </div>

          {/* Chat window */}
          <div className="lg:col-span-3 card flex flex-col" style={{ minHeight: '500px' }}>
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-700">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">ElectroVolt AI Support</p>
                <p className="text-emerald-400 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block animate-pulse" /> Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '400px' }}>
              {fetching ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10">
                  <Bot className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Hi {user?.name?.split(' ')[0]}! 👋 How can I help you today?</p>
                  <p className="text-slate-600 text-sm mt-1">Ask me about orders, warranties, repairs, or product issues.</p>
                </div>
              ) : messages.map((msg: any) => (
                <div key={msg.chat_id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600' : msg.sender === 'ai' ? 'bg-gradient-to-br from-cyan-500 to-indigo-600' : 'bg-amber-600'}`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : msg.sender === 'ai' ? <Bot className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-white">A</span>}
                  </div>
                  <div className={`max-w-xs md:max-w-sm ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-700 text-slate-200 rounded-bl-sm'}`}>
                      {msg.message}
                    </div>
                    <span className="text-slate-600 text-xs">{new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} /><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} /><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} /></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
              {quickReplies.map(q => (
                <button key={q} onClick={() => sendMessage(q)} className="text-xs text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex-shrink-0">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-4 border-t border-slate-700">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                className="input flex-1 py-2.5 text-sm"
                placeholder="Type your message..."
                disabled={loading}
              />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl flex items-center justify-center transition-all flex-shrink-0">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
