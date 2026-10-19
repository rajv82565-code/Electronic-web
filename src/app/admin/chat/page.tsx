'use client';
import { useEffect, useState } from 'react';
import { MessageSquare, Send, Bot, User, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/chat').then(r => r.json()).then(d => { setConversations(d.conversations || []); setLoading(false); });
  }, []);

  const loadMessages = (userId: number, userName: string) => {
    setSelectedUser({ user_id: userId, name: userName });
    fetch(`/api/admin/chat?userId=${userId}`).then(r => r.json()).then(d => setMessages(d.messages || []));
  };

  const sendReply = async () => {
    if (!reply.trim() || !selectedUser) return;
    const res = await fetch('/api/admin/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.user_id, message: reply, sender: 'admin' }),
    });
    if (res.ok) {
      toast.success('Reply sent!');
      setReply('');
      loadMessages(selectedUser.user_id, selectedUser.name);
    }
  };

  return (
    <div className="p-8 h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-8"><MessageSquare className="w-6 h-6 text-cyan-400" /> Support Chat</h1>

      <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Conversations list */}
        <div className="card overflow-y-auto">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold mb-3">Conversations</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input className="input pl-9 text-sm py-2" placeholder="Search..." />
            </div>
          </div>
          {loading ? (
            <div className="p-4 space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No conversations yet</div>
          ) : conversations.map((c: any) => (
            <button key={c.user_id} onClick={() => loadMessages(c.user_id, c.name)} className={`w-full flex items-center gap-3 p-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 text-left ${selectedUser?.user_id === c.user_id ? 'bg-indigo-600/20' : ''}`}>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{c.name?.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{c.name}</p>
                <p className="text-slate-500 text-xs truncate">{c.last_message}</p>
              </div>
              {c.unread_count > 0 && (
                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">{c.unread_count}</div>
              )}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="col-span-2 card flex flex-col">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-slate-700">
                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{selectedUser.name?.charAt(0)}</div>
                <div>
                  <p className="text-white font-semibold">{selectedUser.name}</p>
                  <p className="text-slate-400 text-xs">Customer</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg: any) => (
                  <div key={msg.chat_id} className={`flex items-end gap-2 ${msg.sender !== 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600' : msg.sender === 'ai' ? 'bg-gradient-to-br from-cyan-500 to-indigo-600' : 'bg-amber-600'}`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : msg.sender === 'ai' ? <Bot className="w-4 h-4 text-white" /> : <span className="text-white font-bold text-xs">A</span>}
                    </div>
                    <div className={`max-w-sm flex flex-col gap-1 ${msg.sender !== 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user' ? 'bg-slate-700 text-slate-200 rounded-bl-sm' : msg.sender === 'ai' ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-100 rounded-br-sm' : 'bg-amber-600/20 border border-amber-600/30 text-amber-100 rounded-br-sm'}`}>
                        {msg.message}
                      </div>
                      <span className="text-slate-600 text-xs">{msg.sender === 'ai' ? 'AI' : msg.sender === 'admin' ? 'You' : selectedUser.name} • {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-4 border-t border-slate-700">
                <input
                  type="text"
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply()}
                  className="input flex-1 text-sm py-2.5"
                  placeholder="Type your reply as admin..."
                />
                <button onClick={sendReply} disabled={!reply.trim()} className="w-10 h-10 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-xl flex items-center justify-center transition-all">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm mt-1">Choose a customer from the left panel</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
