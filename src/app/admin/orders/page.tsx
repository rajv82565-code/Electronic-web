'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag, Search, Eye, Filter, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/components/ProductCard';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filterStatus) params.set('status', filterStatus);
    fetch(`/api/admin/orders?${params}`)
      .then(r => r.json())
      .then(d => {
        setOrders(d.orders || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filterStatus]);

  const updateStatus = async (orderId: number, status: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: status }),
    });
    if (res.ok) {
      toast.success(`Order #${orderId} set to ${status.replace(/_/g, ' ')}`);
      fetchOrders();
    } else {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" /> Orders Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track customer hardware orders, update delivery milestones, and inspect invoices.
          </p>
        </div>
        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-lg">
          {orders.length} Total Orders
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or order ID..."
            className="input pl-9 text-xs py-2"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="input text-xs sm:w-48 cursor-pointer py-2"
        >
          <option value="">All Fulfillment Statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s} className="capitalize">
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Order Reference</th>
                <th className="py-3 px-5">Customer Profile</th>
                <th className="py-3 px-5 text-right">Invoice Total</th>
                <th className="py-3 px-5 text-center">Items</th>
                <th className="py-3 px-5 text-center">Payment Info</th>
                <th className="py-3 px-5 text-center">Fulfillment Status</th>
                <th className="py-3 px-5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading customer orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o: any) => (
                  <tr key={o.order_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-slate-900 font-mono text-sm">#{o.order_id}</p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(o.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>

                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-slate-900">{o.customer_name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{o.customer_email}</p>
                    </td>

                    <td className="py-3.5 px-5 text-right font-bold text-slate-900 font-sans text-sm">
                      {formatPrice(o.final_amount)}
                    </td>

                    <td className="py-3.5 px-5 text-center font-medium text-slate-700">
                      {o.item_count || 1}
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <span className="capitalize text-slate-700 font-medium block">
                        {o.payment_method?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-teal-700 bg-teal-50 border border-teal-200 px-1 rounded font-bold">
                        {o.payment_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <select
                        value={o.order_status}
                        onChange={e => updateStatus(o.order_id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 capitalize cursor-pointer focus:outline-none focus:border-blue-600"
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s} className="capitalize">
                            {s.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/orders/${o.order_id}`}
                        className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg inline-flex items-center transition-colors"
                        title="View Full Order Breakdown"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
