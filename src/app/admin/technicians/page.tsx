'use client';
import { useEffect, useState } from 'react';
import { Users, Search, Star, Plus, Edit, X, Phone, Mail, Award, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const SPECIALIZATIONS = [
  'Smartphones & Display Panel',
  'Laptops & Motherboard Circuitry',
  'Apple Hardware Specialist',
  'Gaming Consoles & Peripherals',
  'Studio Audio & Acoustics',
  'Tablets & Touch Digitizers',
  'General Consumer Electronics',
];

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTech, setEditTech] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience_years: '1',
    availability: 'available',
  });

  const fetchTechs = () => {
    setLoading(true);
    fetch('/api/admin/technicians')
      .then(r => r.json())
      .then(d => {
        setTechnicians(d.technicians || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  const openModal = (tech?: any) => {
    if (tech) {
      setEditTech(tech);
      setForm({
        name: tech.name,
        email: tech.email || '',
        phone: tech.phone || '',
        specialization: tech.specialization || '',
        experience_years: tech.experience_years?.toString() || '1',
        availability: tech.availability || 'available',
      });
    } else {
      setEditTech(null);
      setForm({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experience_years: '1',
        availability: 'available',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      experience_years: parseInt(form.experience_years) || 1,
    };
    const url = editTech
      ? `/api/admin/technicians/${editTech.technician_id}`
      : '/api/admin/technicians';
    const method = editTech ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editTech ? 'Technician profile updated!' : 'Technician added to roster!');
      setShowModal(false);
      fetchTechs();
    } else {
      const d = await res.json();
      toast.error(d.error || 'Failed to save technician');
    }
  };

  const up = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Technician Availability Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certified hardware engineers roster, live availability status, and workload allocation.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-primary text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Technician
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl h-48 skeleton" />
          ))}
        </div>
      ) : technicians.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No technicians on roster</h3>
          <p className="text-xs text-slate-500 mb-4">Add your certified hardware engineers to assign them repairs.</p>
          <button onClick={() => openModal()} className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg">
            Add First Technician
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {technicians.map(t => {
            const isAvailable = t.availability === 'available';
            const isBusy = t.availability === 'busy';

            return (
              <div
                key={t.technician_id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:shadow-sm transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-2xs">
                      {t.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{t.name}</h4>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1 mt-1 capitalize ${
                          isAvailable
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : isBusy
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAvailable ? 'bg-teal-500' : isBusy ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                        />
                        {t.availability || 'available'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openModal(t)}
                    className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer border border-slate-200"
                    title="Edit Technician"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  {t.specialization && (
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Award className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{t.specialization}</span>
                    </div>
                  )}
                  {t.email && (
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{t.email}</span>
                    </div>
                  )}
                  {t.phone && (
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{t.phone}</span>
                    </div>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="block font-bold text-slate-900 text-xs">
                      {t.experience_years || 1}y
                    </span>
                    <span className="text-[10px] text-slate-400">Experience</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="block font-bold text-slate-900 text-xs">
                      {t.total_repairs || 12}
                    </span>
                    <span className="text-[10px] text-slate-400">Fixed</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-900 text-xs">4.9</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Rating</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Technician Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {editTech ? 'Edit Technician Profile' : 'Add Certified Technician'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="label">Full Name *</label>
                <input
                  value={form.name}
                  onChange={up('name')}
                  required
                  className="input"
                  placeholder="e.g. Vikram Patel"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Work Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={up('email')}
                    className="input"
                    placeholder="vikram@electrovolt.in"
                  />
                </div>
                <div>
                  <label className="label">Contact Mobile *</label>
                  <input
                    value={form.phone}
                    onChange={up('phone')}
                    className="input"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="label">Primary Hardware Specialization *</label>
                <select
                  value={form.specialization}
                  onChange={up('specialization')}
                  className="input cursor-pointer"
                >
                  <option value="">Select hardware domain</option>
                  {SPECIALIZATIONS.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Experience (Years)</label>
                  <input
                    type="number"
                    value={form.experience_years}
                    onChange={up('experience_years')}
                    className="input"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="label">Availability Status</label>
                  <select
                    value={form.availability}
                    onChange={up('availability')}
                    className="input cursor-pointer"
                  >
                    <option value="available">Available for Repairs</option>
                    <option value="busy">Busy / High Load</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary text-xs font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary text-xs font-semibold py-2 px-6 rounded-lg"
              >
                {editTech ? 'Save Changes' : 'Add to Roster'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
