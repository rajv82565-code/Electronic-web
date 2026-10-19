'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import { formatPrice } from '@/components/ProductCard';
import {
  Package,
  Shield,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
  ChevronRight,
  User,
  Truck,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';

const ORDER_TIMELINE = ['placed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
const ORDER_LABELS: Record<string, string> = {
  placed: 'Order Placed',
  packed: 'Packed & Dispatched',
  shipped: 'Shipped (In Transit)',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered Successfully',
};

const REPAIR_STAGES = [
  'submitted',
  'pickup_scheduled',
  'received',
  'technician_assigned',
  'diagnosis',
  'repair_in_progress',
  'quality_check',
  'ready_for_delivery',
  'completed',
];
const REPAIR_LABELS: Record<string, string> = {
  submitted: 'Request Submitted',
  pickup_scheduled: 'Pickup Scheduled',
  received: 'Received at Service Hub',
  technician_assigned: 'Technician Assigned',
  diagnosis: 'Hardware Diagnosis',
  repair_in_progress: 'Repair in Progress',
  quality_check: 'Quality & OEM Inspection',
  ready_for_delivery: 'Ready for Doorstep Delivery',
  completed: 'Completed & Delivered',
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'warranties' | 'repairs'>('orders');

  const [orders, setOrders] = useState<any[]>([]);
  const [warranties, setWarranties] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore(s => s.user);
  const router = useRouter();

  useEffect(() => {
    if (initialTab === 'warranties' || initialTab === 'repairs' || initialTab === 'orders') {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/warranties').then(r => r.json()),
      fetch('/api/repairs').then(r => r.json()),
    ])
      .then(([ordersRes, warrantiesRes, repairsRes]) => {
        setOrders(ordersRes.orders || []);
        setWarranties(warrantiesRes.warranties || []);
        setRepairs(repairsRes.repairs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, router]);

  const activeWarranties = warranties.filter(w => w.status === 'active');
  const activeRepairs = repairs.filter(r => r.repair_status !== 'completed' && r.repair_status !== 'cancelled');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="w-[min(94%,1440px)] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name}</h1>
                <p className="text-xs text-slate-500">{user?.email} • Customer Portal</p>
              </div>
            </div>

            {/* Quick KPI Stat Chips */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('orders')}
                className={`p-3 rounded-lg border text-center min-w-[90px] cursor-pointer transition-all ${
                  activeTab === 'orders' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="text-lg font-bold text-slate-900">{orders.length}</div>
                <div className="text-[11px] font-medium text-slate-500">Orders</div>
              </button>

              <button
                onClick={() => setActiveTab('warranties')}
                className={`p-3 rounded-lg border text-center min-w-[90px] cursor-pointer transition-all ${
                  activeTab === 'warranties' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="text-lg font-bold text-teal-700">{activeWarranties.length}</div>
                <div className="text-[11px] font-medium text-slate-500">Warranties</div>
              </button>

              <button
                onClick={() => setActiveTab('repairs')}
                className={`p-3 rounded-lg border text-center min-w-[90px] cursor-pointer transition-all ${
                  activeTab === 'repairs' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="text-lg font-bold text-amber-700">{activeRepairs.length}</div>
                <div className="text-[11px] font-medium text-slate-500">Active Repairs</div>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Controls (Nykaa Retail Style with Active Electric Blue Underline) */}
        <div className="border-b border-slate-200 flex items-center space-x-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3.5 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" /> My Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('warranties')}
            className={`pb-3.5 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'warranties'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 text-teal-600" /> Warranties Vault ({warranties.length})
          </button>

          <button
            onClick={() => setActiveTab('repairs')}
            className={`pb-3.5 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'repairs'
                ? 'text-amber-700 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-500" /> Repairs & Servicing ({repairs.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl h-36 skeleton" />
            ))}
          </div>
        )}

        {/* TAB 1: MY ORDERS */}
        {!loading && activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base mb-1">No orders found</h3>
                <p className="text-xs text-slate-500 mb-4">You have not placed any orders yet.</p>
                <Link href="/products" className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg">
                  Shop Electronics
                </Link>
              </div>
            ) : (
              orders.map(order => {
                const currentStageIdx = ORDER_TIMELINE.indexOf(order.order_status || 'placed');

                return (
                  <div
                    key={order.order_id}
                    className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 text-sm">
                            Order #{order.order_id}
                          </span>
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded capitalize">
                            {order.order_status?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Placed on{' '}
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs text-slate-400">Total Paid</span>
                          <p className="font-extrabold text-slate-900 text-base font-sans">
                            {formatPrice(order.final_amount)}
                          </p>
                        </div>
                        <Link
                          href={`/orders/${order.order_id}`}
                          className="btn-secondary text-xs font-semibold py-1.5 px-3 rounded-lg"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-600">Shipment Timeline</span>
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {ORDER_TIMELINE.map((stage, idx) => {
                          const isDone = idx <= currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div key={stage} className="space-y-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all ${
                                  isDone ? 'bg-teal-600' : 'bg-slate-200'
                                }`}
                              />
                              <span
                                className={`text-[11px] block font-medium ${
                                  isCurrent
                                    ? 'text-teal-700 font-bold'
                                    : isDone
                                    ? 'text-slate-700'
                                    : 'text-slate-400'
                                }`}
                              >
                                {ORDER_LABELS[stage]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Warranty Assurance */}
                    <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-teal-600" />
                        <span>All hardware in this order includes automatic manufacturer warranty.</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('warranties')}
                        className="text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        View Warranty Certificate →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: WARRANTIES VAULT */}
        {!loading && activeTab === 'warranties' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Registered Hardware Warranties</h3>
                <p className="text-xs text-slate-500">
                  Track coverage durations, serial numbers, and file 1-click repair requests.
                </p>
              </div>
              <Link
                href="/warranty/register"
                className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Register Manual Device
              </Link>
            </div>

            {warranties.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
                <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base mb-1">No warranties registered</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Warranties for purchased products appear here automatically. You can also register other devices.
                </p>
                <Link href="/warranty/register" className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg">
                  Register First Warranty
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {warranties.map(w => {
                  const daysLeft = Math.max(0, differenceInDays(new Date(w.expiry_date), new Date()));
                  const totalDays = Math.max(
                    1,
                    differenceInDays(new Date(w.expiry_date), new Date(w.purchase_date))
                  );
                  const progressPct =
                    w.status === 'expired'
                      ? 100
                      : Math.min(100, Math.max(0, Math.round(((totalDays - daysLeft) / totalDays) * 100)));

                  return (
                    <div
                      key={w.warranty_id}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                              {w.brand}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm">{w.product_name}</h4>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">SN: {w.serial_number}</p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                              w.status === 'active'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {w.status === 'active' ? 'Active Coverage' : 'Expired'}
                          </span>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 my-3">
                          <div>
                            <span className="text-slate-400 text-[11px]">Purchase Date</span>
                            <p className="font-medium text-slate-800">
                              {new Date(w.purchase_date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[11px]">Valid Until</span>
                            <p className="font-medium text-slate-800">
                              {new Date(w.expiry_date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Countdown Timeline Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">Coverage Timeline</span>
                            <span className="font-bold text-teal-700">
                              {w.status === 'active' ? `${daysLeft} Days Remaining` : 'Coverage Ended'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                w.status === 'active' ? 'bg-teal-600' : 'bg-red-400'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[11px] text-slate-400">Invoice: {w.invoice_number || 'INV-DIGITAL'}</span>
                        <Link
                          href={`/repairs/new?warranty_id=${w.warranty_id}`}
                          className="btn-outline text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1"
                        >
                          <Wrench className="w-3.5 h-3.5 text-blue-600" /> File Repair Claim
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REPAIRS & SERVICING */}
        {!loading && activeTab === 'repairs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Doorstep Repairs & Diagnostics</h3>
                <p className="text-xs text-slate-500">
                  Track live hardware inspection, technician notes, and doorstep delivery milestones.
                </p>
              </div>
              <Link
                href="/repairs/new"
                className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Book Doorstep Repair
              </Link>
            </div>

            {repairs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
                <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base mb-1">No active repairs</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Need a broken screen fixed, battery diagnostic, or speaker replacement? Our certified engineers are ready.
                </p>
                <Link href="/repairs/new" className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg">
                  Submit First Repair Request
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {repairs.map(r => {
                  const currentStageIdx = REPAIR_STAGES.indexOf(r.repair_status || 'submitted');

                  return (
                    <div
                      key={r.repair_id}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6"
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                              {r.product_name}
                            </h4>
                            <span className="text-xs text-slate-400 font-mono">
                              (Repair Ticket #{r.repair_id})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Issue Category: <strong className="text-slate-800">{r.issue_category}</strong> • Serial No: {r.serial_number || 'N/A'}
                          </p>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <div>
                            <span className="text-[11px] text-slate-400">Estimated Cost</span>
                            <p className="font-bold text-amber-700 text-base">
                              {r.repair_cost > 0 ? formatPrice(r.repair_cost) : 'Under Warranty Inspection (₹0)'}
                            </p>
                          </div>
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded capitalize">
                            {r.repair_status?.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Issue Description & Technician Notes */}
                      <div className="grid md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-700">Customer Issue Description:</span>
                          <p className="text-slate-600 mt-1">{r.description || 'No description provided'}</p>
                          {r.pickup_date && (
                            <p className="text-slate-400 text-[11px] mt-2">
                              Pickup Scheduled: <strong>{r.pickup_date}</strong> at {r.pickup_address}
                            </p>
                          )}
                        </div>

                        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                          <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-blue-600" />
                            Technician Diagnosis:
                          </span>
                          <p className="text-slate-700 mt-1">
                            {r.technician_notes || 'Device currently in diagnostic inspection queue.'}
                          </p>
                          {r.technician_name && (
                            <p className="text-blue-700 font-medium text-[11px] mt-2">
                              Assigned Engineer: {r.technician_name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stage Progression Timeline */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700">Live Stage Timeline</span>
                          <span className="text-teal-700 font-bold">
                            {REPAIR_LABELS[r.repair_status] || r.repair_status}
                          </span>
                        </div>

                        {/* Progress Stepper Line */}
                        <div className="grid grid-cols-9 gap-1 text-center">
                          {REPAIR_STAGES.map((st, idx) => {
                            const isDone = idx <= currentStageIdx;
                            const isCurrent = idx === currentStageIdx;
                            return (
                              <div key={st} className="space-y-1">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    isCurrent
                                      ? 'bg-amber-500'
                                      : isDone
                                      ? 'bg-teal-600'
                                      : 'bg-slate-200'
                                  }`}
                                  title={REPAIR_LABELS[st]}
                                />
                                <span
                                  className={`text-[9px] block leading-tight truncate ${
                                    isCurrent
                                      ? 'text-amber-800 font-bold'
                                      : isDone
                                      ? 'text-slate-700 font-medium'
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {st.replace(/_/g, ' ')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
