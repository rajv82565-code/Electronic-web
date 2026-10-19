'use client';
import { useEffect, useState } from 'react';
import { Shield, Search, CheckCircle, Clock, AlertTriangle, ExternalLink, Wrench } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import Link from 'next/link';

export default function AdminWarrantiesPage() {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchWarranties = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filterStatus) params.set('status', filterStatus);
    fetch(`/api/admin/warranties?${params}`)
      .then(r => r.json())
      .then(d => {
        setWarranties(d.warranties || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWarranties();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filterStatus]);

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-600" /> SmartShield Warranty Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global registry of active hardware serial numbers, expiry dates, and authorized warranty coverage.
          </p>
        </div>
        <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold px-3 py-1 rounded-lg">
          {warranties.length} Registered Certificates
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by serial number, device model, or customer name..."
            className="input pl-9 text-xs py-2"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="input text-xs sm:w-44 cursor-pointer py-2"
        >
          <option value="">All Warranty Statuses</option>
          <option value="active">Active Only</option>
          <option value="expired">Expired Only</option>
        </select>
      </div>

      {/* Warranties Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Certificate & Serial No.</th>
                <th className="py-3 px-5">Hardware Device</th>
                <th className="py-3 px-5">Registered Customer</th>
                <th className="py-3 px-5">Purchase Date</th>
                <th className="py-3 px-5">Expiry Date</th>
                <th className="py-3 px-5">Coverage Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading warranty registry...
                  </td>
                </tr>
              ) : warranties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No warranty records found.
                  </td>
                </tr>
              ) : (
                warranties.map((w: any) => {
                  const daysLeft = Math.max(0, differenceInDays(new Date(w.expiry_date), new Date()));
                  const isExpiringSoon = daysLeft <= 30 && w.status === 'active';
                  const isExpired = w.status === 'expired' || daysLeft === 0;

                  return (
                    <tr key={w.warranty_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-slate-900 block text-xs">
                          {w.serial_number}
                        </span>
                        <span className="text-[11px] text-slate-400">Cert #{w.warranty_id}</span>
                      </td>

                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-slate-900">{w.product_name}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {w.brand}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <p className="font-medium text-slate-800">{w.customer_name || 'Customer'}</p>
                        <p className="text-[11px] text-slate-400">{w.customer_email}</p>
                      </td>

                      <td className="py-3.5 px-5 text-slate-600">
                        {new Date(w.purchase_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-5 text-slate-600">
                        {new Date(w.expiry_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Coverage Status Badge */}
                      <td className="py-3.5 px-5">
                        {isExpired ? (
                          <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[11px] font-bold">
                            Expired
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {daysLeft}d left
                          </span>
                        ) : (
                          <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-teal-600" />
                            Active ({daysLeft}d left)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/admin/repairs`}
                          className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 text-[11px]"
                        >
                          <Wrench className="w-3 h-3" /> Servicing
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
