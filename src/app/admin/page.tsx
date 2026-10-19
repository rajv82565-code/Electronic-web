'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  Package,
  ShoppingBag,
  Users,
  Shield,
  Wrench,
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Link from 'next/link';
import { formatPrice } from '@/components/ProductCard';

const CHART_COLORS = ['#2563EB', '#0EA5A0', '#F59E0B', '#6366F1', '#10B981', '#EC4899'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(s => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => {
        setAnalytics(d);
        setLoading(false);
      });
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analytics) return null;
  const { summary, recentOrders = [], categoryRevenue = [], monthlyRevenue = [] } = analytics;

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(summary?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border border-blue-100',
      change: '+14.2% MoM',
    },
    {
      label: 'Gross Orders',
      value: summary?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border border-indigo-100',
      change: '+8 new today',
    },
    {
      label: 'Live Products',
      value: summary?.totalProducts || 0,
      icon: Package,
      color: 'text-slate-700',
      bg: 'bg-slate-50 border border-slate-200',
      change: 'Catalog Synced',
    },
    {
      label: 'Registered Customers',
      value: summary?.totalUsers || 0,
      icon: Users,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border border-teal-100',
      change: '+22 this week',
    },
    {
      label: 'Active Warranties',
      value: summary?.activeWarranties || 0,
      icon: Shield,
      color: 'text-teal-700',
      bg: 'bg-teal-50 border border-teal-200',
      change: 'SmartShield Protected',
    },
    {
      label: 'Open Repair Tickets',
      value: summary?.openRepairs || 0,
      icon: Wrench,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border border-amber-200',
      change: 'Kanban Managed',
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive KPI Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry on revenue, hardware inventory, active warranties, and repair pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg font-medium">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Database Live (WAL Mode)</span>
          </div>
          <Link
            href="/admin/repairs"
            className="btn-primary text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" /> Repair Kanban
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2 hover:shadow-sm transition-all"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg}`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 font-sans">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 pt-1 border-t border-slate-100">
                {s.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Trend (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Monthly Revenue Trend
              </h2>
              <p className="text-xs text-slate-400">Aggregated electronic sales and repair revenue</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              FY 2025–2026
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            {monthlyRevenue?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="blueRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#94A3B8"
                    tick={{ fontSize: 11 }}
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '0.75rem',
                      color: '#1E293B',
                    }}
                    formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fill="url(#blueRevGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Collecting live revenue trends...
              </div>
            )}
          </div>
        </div>

        {/* Category Revenue Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Revenue by Category</h2>
            <p className="text-xs text-slate-400">Product sales distribution</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {categoryRevenue?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="revenue"
                    nameKey="name"
                  >
                    {categoryRevenue.map((_: any, idx: number) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                    }}
                    formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No category breakdown data available</p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
            {categoryRevenue?.slice(0, 4).map((cat: any, i: number) => (
              <div key={cat.name} className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Latest transactions requiring fulfillment</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Items</th>
                <th className="py-3 px-5">Total Amount</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord: any) => (
                  <tr key={ord.order_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900 font-mono">
                      #{ord.order_id}
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-slate-800">{ord.user_name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{ord.user_email}</p>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">{ord.item_count || 1} item(s)</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900 font-sans">
                      {formatPrice(ord.final_amount)}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="capitalize font-medium text-slate-700">
                        {ord.payment_method?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-semibold px-2 py-0.5 rounded capitalize">
                        {ord.order_status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/orders/${ord.order_id}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Inspect →
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
