'use client';
import { useEffect, useState } from 'react';
import {
  Wrench,
  Search,
  User,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  LayoutGrid,
  List,
  AlertTriangle,
  Phone,
  DollarSign,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/components/ProductCard';

const KANBAN_COLUMNS = [
  { key: 'submitted', label: '1. Submitted', color: 'border-slate-300 text-slate-700 bg-slate-100' },
  { key: 'pickup_scheduled', label: '2. Pickup Scheduled', color: 'border-blue-300 text-blue-800 bg-blue-50' },
  { key: 'diagnosis', label: '3. In Diagnosis', color: 'border-amber-300 text-amber-800 bg-amber-50' },
  { key: 'repair_in_progress', label: '4. Repair In Progress', color: 'border-purple-300 text-purple-800 bg-purple-50' },
  { key: 'quality_check', label: '5. Quality Check', color: 'border-teal-300 text-teal-800 bg-teal-50' },
  { key: 'completed', label: '6. Completed / Delivered', color: 'border-emerald-300 text-emerald-800 bg-emerald-50' },
];

export default function AdminRepairKanbanPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const fetchRepairs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    fetch(`/api/admin/repairs?${params}`)
      .then(r => r.json())
      .then(d => {
        setRepairs(d.repairs || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch('/api/admin/technicians')
      .then(r => r.json())
      .then(d => setTechnicians(d.technicians || []));
    fetchRepairs();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRepairs();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const updateRepair = async (repairId: number, data: any) => {
    const res = await fetch(`/api/admin/repairs/${repairId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success('Repair status updated!');
      fetchRepairs();
    } else {
      toast.error('Failed to update repair');
    }
  };

  const advanceStage = (repair: any, direction: 'forward' | 'backward') => {
    const colKeys = KANBAN_COLUMNS.map(c => c.key);
    let currentIdx = colKeys.indexOf(repair.repair_status);
    if (currentIdx === -1) currentIdx = 0;

    let targetIdx = direction === 'forward' ? currentIdx + 1 : currentIdx - 1;
    if (targetIdx < 0 || targetIdx >= colKeys.length) return;

    updateRepair(repair.repair_id, { repair_status: colKeys[targetIdx] });
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">Repair Kanban Board</h1>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2 py-0.5 rounded">
              {repairs.length} Total Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Drag-and-transition hardware servicing stages from intake to final customer doorstep delivery.
          </p>
        </div>

        {/* View Mode Toggle & Search */}
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search serial, model, customer..."
              className="input pl-9 text-xs py-1.5"
            />
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Data Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl h-96 skeleton" />
          ))}
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map(col => {
            const colRepairs = repairs.filter(r => {
              if (col.key === 'diagnosis') {
                return r.repair_status === 'diagnosis' || r.repair_status === 'technician_assigned' || r.repair_status === 'received';
              }
              if (col.key === 'completed') {
                return r.repair_status === 'completed' || r.repair_status === 'ready_for_delivery';
              }
              return r.repair_status === col.key;
            });

            return (
              <div
                key={col.key}
                className="bg-slate-100/70 border border-slate-200/90 rounded-xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 truncate">{col.label}</span>
                  <span className="text-[11px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {colRepairs.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1">
                  {colRepairs.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-slate-400 italic">
                      No repairs in this stage
                    </div>
                  ) : (
                    colRepairs.map(r => (
                      <div
                        key={r.repair_id}
                        className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2.5 hover:shadow-sm transition-all"
                      >
                        {/* Ticket & Badge */}
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-mono font-bold text-blue-600 text-[11px]">
                            #{r.repair_id}
                          </span>
                          {r.warranty_id && (
                            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-1 rounded">
                              Warranty
                            </span>
                          )}
                        </div>

                        {/* Hardware Model & Issue */}
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-1">
                            {r.product_name}
                          </h4>
                          <p className="text-[11px] text-amber-700 font-medium">
                            {r.issue_category}
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                            {r.description}
                          </p>
                        </div>

                        {/* Customer Info */}
                        <div className="text-[11px] text-slate-600 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="truncate">{r.customer_name || 'Customer'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {r.contact_phone || ''}
                          </span>
                        </div>

                        {/* Technician Assignment */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-slate-400 block">
                            Assigned Technician:
                          </label>
                          <select
                            value={r.technician_id || ''}
                            onChange={e =>
                              updateRepair(r.repair_id, {
                                technician_id: e.target.value ? parseInt(e.target.value) : null,
                              })
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded text-[11px] py-1 px-1.5 text-slate-700 focus:outline-none focus:border-blue-600"
                          >
                            <option value="">Unassigned</option>
                            {technicians.map(t => (
                              <option key={t.technician_id} value={t.technician_id}>
                                {t.name} ({t.availability})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Cost Input */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                          <span className="text-[11px] text-slate-400">Repair Cost:</span>
                          <input
                            type="number"
                            defaultValue={r.repair_cost || 0}
                            onBlur={e =>
                              updateRepair(r.repair_id, {
                                repair_cost: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-20 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-right font-bold text-amber-700 text-xs focus:bg-white"
                          />
                        </div>

                        {/* Stage Transition Buttons */}
                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <button
                            onClick={() => advanceStage(r, 'backward')}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="Move to previous stage"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => advanceStage(r, 'forward')}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Move to next stage"
                          >
                            Advance <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Ticket ID</th>
                <th className="py-3 px-5">Device</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Issue Category</th>
                <th className="py-3 px-5">Technician</th>
                <th className="py-3 px-5 text-right">Cost</th>
                <th className="py-3 px-5 text-center">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {repairs.map(r => (
                <tr key={r.repair_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-blue-600 font-mono">
                    #{r.repair_id}
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-slate-900">{r.product_name}</p>
                    <p className="text-[11px] text-slate-400">{r.brand} • SN: {r.serial_number || 'N/A'}</p>
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-medium text-slate-800">{r.customer_name || 'Customer'}</p>
                    <p className="text-[11px] text-slate-400">{r.contact_phone}</p>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-medium text-amber-700">{r.issue_category}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <select
                      value={r.technician_id || ''}
                      onChange={e =>
                        updateRepair(r.repair_id, {
                          technician_id: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="">Unassigned</option>
                      {technicians.map(t => (
                        <option key={t.technician_id} value={t.technician_id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-5 text-right font-bold text-amber-700 font-sans">
                    {formatPrice(r.repair_cost || 0)}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded capitalize">
                      {r.repair_status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
