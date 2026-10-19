'use client';
import { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, Shield, ShoppingBag, Calendar } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    fetch(`/api/admin/users${search ? `?search=${search}` : ''}`).then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, [search]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="w-6 h-6 text-amber-400" /> Customers</h1>
          <p className="text-slate-400 text-sm">{users.length} registered customers</p>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 text-sm" placeholder="Search by name or email..." />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th className="text-left text-slate-400 text-xs uppercase px-5 py-3">Customer</th>
              <th className="text-left text-slate-400 text-xs uppercase px-5 py-3">Contact</th>
              <th className="text-center text-slate-400 text-xs uppercase px-5 py-3">Role</th>
              <th className="text-center text-slate-400 text-xs uppercase px-5 py-3">Orders</th>
              <th className="text-right text-slate-400 text-xs uppercase px-5 py-3">Total Spent</th>
              <th className="text-right text-slate-400 text-xs uppercase px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-slate-500">Loading...</td></tr>
            ) : users.map((u: any) => (
              <tr key={u.user_id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{u.name?.charAt(0)}</div>
                    <div>
                      <p className="text-white font-medium text-sm">{u.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs"><Mail className="w-3 h-3" /> {u.email}</div>
                    {u.phone && <div className="flex items-center gap-1.5 text-slate-400 text-xs"><Phone className="w-3 h-3" /> {u.phone}</div>}
                  </div>
                </td>
                <td className="px-5 py-3 text-center">
                  <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-info'} capitalize text-xs`}>{u.role}</span>
                </td>
                <td className="px-5 py-3 text-center">
                  <span className="flex items-center justify-center gap-1 text-slate-300 text-sm"><ShoppingBag className="w-3.5 h-3.5" /> {u.total_orders || 0}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-emerald-400 font-semibold text-sm">₹{(u.total_spent || 0).toLocaleString('en-IN')}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString('en-IN')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
