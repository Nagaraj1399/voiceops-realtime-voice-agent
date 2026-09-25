import React, { useState } from 'react';
import {
  CalendarCheck,
  UserCheck,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  CheckCircle2,
  Phone,
  MapPin,
  Tag,
} from 'lucide-react';
import { Booking, Customer, BusinessAction } from '../../types/voice';

interface ActionsPageProps {
  bookings: Booking[];
  customers: Customer[];
  actions: BusinessAction[];
}

export const ActionsPage: React.FC<ActionsPageProps> = ({
  bookings,
  customers,
  actions,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'actions' | 'customers'>('bookings');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Verified Business Actions & Database
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time mutations committed by VoiceOps AI directly to field service dispatches and CRM records.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium overflow-x-auto no-scrollbar max-w-full shadow-xs">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`min-h-[36px] px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'bookings'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confirmed Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveSubTab('actions')}
            className={`min-h-[36px] px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'actions'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action Event Log ({actions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('customers')}
            className={`min-h-[36px] px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'customers'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer CRM ({customers.length})
          </button>
        </div>
      </div>

      {/* Bookings View */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-3">
          {/* MOBILE VIEW: Bookings Cards (md:hidden) */}
          <div className="md:hidden space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-600">
                    {b.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {b.status === 'confirmed' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span>{b.status.toUpperCase()}</span>
                  </span>
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-900">{b.customerName}</div>
                  <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3" />
                    <span>{b.customerPhone}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-medium text-slate-800">{b.service}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Slot:</span>
                    <span className="font-mono text-indigo-700 font-semibold">{b.date} · {b.timeSlot}</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-slate-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <span>{b.address || '742 Evergreen Terrace, Springfield'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Bookings Table (hidden md:block) */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600">
                Live Field Service Appointments
              </span>
              <span className="text-xs text-slate-500">Auto-dispatched via VoiceOps</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Booking Ref</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Service Type</th>
                    <th className="py-3 px-4 font-semibold">Target Date & Slot</th>
                    <th className="py-3 px-4 font-semibold">Service Address</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        {b.id}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        <div>{b.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{b.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {b.service}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        <div>{b.date}</div>
                        <div className="text-indigo-600 font-semibold">{b.timeSlot}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {b.address || '742 Evergreen Terrace, Springfield'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {b.status === 'confirmed' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{b.status.toUpperCase()}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Action Event Log */}
      {activeSubTab === 'actions' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600">
              Audit Trail of Voice Operations
            </span>
            <span className="text-xs font-mono text-slate-500">Immutable execution stream</span>
          </div>

          <div className="p-4 space-y-3">
            {actions.map((act) => (
              <div
                key={act.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {act.type === 'booking_created' ? (
                      <CalendarCheck className="w-4 h-4 text-emerald-600" />
                    ) : act.type === 'human_escalated' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{act.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-slate-500">
                      <span>Ref: {act.referenceId}</span>
                      <span aria-hidden="true">·</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span
                    className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                      act.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : act.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    ✓ {act.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer CRM view */}
      {activeSubTab === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map((c) => (
            <div
              key={c.id}
              className="p-5 bg-white border border-slate-200 rounded-xl space-y-3 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                  <span className="font-mono text-[11px] text-slate-500">{c.id}</span>
                </div>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-mono text-[11px]">
                  {c.membership}
                </span>
              </div>

              <div className="space-y-1 text-slate-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.address}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                  Service Records:
                </span>
                <div className="space-y-1">
                  {c.pastServices.map((s, idx) => (
                    <div key={idx} className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
