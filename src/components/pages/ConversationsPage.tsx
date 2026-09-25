import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Clock,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Calendar,
  Layers,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { ConversationSession } from '../../types/voice';

interface ConversationsPageProps {
  sessions: ConversationSession[];
}

export const ConversationsPage: React.FC<ConversationsPageProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<ConversationSession | null>(null);
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter((s) => {
    const matchesIntent = filterIntent === 'all' || s.intent.toLowerCase().includes(filterIntent.toLowerCase());
    const matchesSearch =
      searchQuery === '' ||
      s.intent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIntent && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
            Conversation History
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Audit transcripts, verified business actions, neural turn counts, and barge-in interruptions.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="min-h-[40px] sm:min-h-0 px-3 py-2 sm:py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg flex items-center justify-between sm:justify-start gap-2 transition-colors">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Filter: {filterIntent === 'all' ? 'All Intents' : filterIntent}</span>
                </div>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-50 min-w-[160px] bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs shadow-xl">
                <DropdownMenu.Item
                  onClick={() => setFilterIntent('all')}
                  className="px-3 py-2 text-neutral-300 hover:bg-neutral-800 rounded cursor-pointer outline-none"
                >
                  All Intents
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => setFilterIntent('Booking')}
                  className="px-3 py-2 text-neutral-300 hover:bg-neutral-800 rounded cursor-pointer outline-none"
                >
                  Service Booking
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => setFilterIntent('Support')}
                  className="px-3 py-2 text-neutral-300 hover:bg-neutral-800 rounded cursor-pointer outline-none"
                >
                  Customer Support
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => setFilterIntent('Human')}
                  className="px-3 py-2 text-neutral-300 hover:bg-neutral-800 rounded cursor-pointer outline-none"
                >
                  Human Escalations
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* MOBILE VIEW: Touch-friendly Session Cards (md:hidden) */}
      <div className="md:hidden space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 text-xs bg-neutral-900/40 border border-neutral-800 rounded-xl">
            No conversation sessions match your filter criteria.
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-neutral-200">
                  {session.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                    session.status === 'Completed'
                      ? 'text-emerald-400'
                      : session.status === 'Escalated'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {session.status === 'Completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                  <span>{session.status}</span>
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-neutral-100 block">
                  {session.intent}
                </span>
                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">
                  {session.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <div className="flex items-center gap-2">
                  <span>{session.duration}</span>
                  <span>·</span>
                  <span className="text-indigo-300">{session.actions.length} action{session.actions.length === 1 ? '' : 's'}</span>
                  <span>·</span>
                  <span>{session.interruptionsCount} barge-in</span>
                </div>

                <button
                  onClick={() => setSelectedSession(session)}
                  className="min-h-[36px] px-3 py-1 text-xs font-mono font-medium text-indigo-300 hover:text-white bg-indigo-950/40 border border-indigo-800/40 rounded-lg flex items-center gap-1.5 active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP VIEW: Conversations Table (hidden md:block) */}
      <div className="hidden md:block bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Session ID</th>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Duration</th>
                <th className="py-3 px-4 font-semibold">Primary Intent</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
                <th className="py-3 px-4 font-semibold text-center">Barge-ins</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400 text-xs">
                    No conversation sessions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-neutral-900/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-neutral-300">
                      {session.id}
                    </td>
                    <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                      {session.startTime}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-300 tabular-nums">
                      {session.duration}
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-200">
                      {session.intent}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-indigo-300">
                      {session.actions.length} action{session.actions.length === 1 ? '' : 's'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-neutral-400">
                      {session.interruptionsCount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                          session.status === 'Completed'
                            ? 'text-emerald-400'
                            : session.status === 'Escalated'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {session.status === 'Completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        <span>{session.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="px-2.5 py-1 text-[11px] font-mono font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radix Dialog: Conversation Detail Modal */}
      <Dialog.Root
        open={Boolean(selectedSession)}
        onOpenChange={(open) => !open && setSelectedSession(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-full max-w-2xl max-h-[88dvh] bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-6 z-50 overflow-y-auto shadow-2xl focus:outline-none">
            {selectedSession && (
              <div className="space-y-5">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <Dialog.Title className="text-lg font-bold text-neutral-100">
                        Conversation Summary
                      </Dialog.Title>
                      <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 font-mono text-xs border border-neutral-800">
                        {selectedSession.id}
                      </span>
                    </div>
                    <Dialog.Description className="text-xs text-neutral-400 mt-1">
                      {selectedSession.startTime} · Duration: {selectedSession.duration}
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      aria-label="Close dialog"
                      className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Intent</span>
                    <span className="text-xs font-semibold text-neutral-200 truncate block">
                      {selectedSession.intent}
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Actions</span>
                    <span className="text-xs font-semibold text-emerald-400 tabular-nums">
                      {selectedSession.actions.length} committed
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Barge-Ins</span>
                    <span className="text-xs font-semibold text-neutral-300 tabular-nums">
                      {selectedSession.interruptionsCount} detected
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Avg Latency</span>
                    <span className="text-xs font-semibold text-indigo-300 font-mono tabular-nums">
                      {selectedSession.avgLatencyMs} ms
                    </span>
                  </div>
                </div>

                {/* Outcome & Summary */}
                <div className="p-3.5 bg-neutral-900/40 border border-neutral-800 rounded-lg space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Verified Outcome
                  </span>
                  <p className="text-emerald-300/90 font-medium">
                    {selectedSession.outcome}
                  </p>
                  <p className="text-neutral-400 leading-relaxed pt-1 border-t border-neutral-800/60">
                    {selectedSession.summary}
                  </p>
                </div>

                {/* Tools Used */}
                <div>
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                    Tools Invoked ({selectedSession.toolCalls.length})
                  </span>
                  <div className="space-y-2">
                    {selectedSession.toolCalls.map((tc) => (
                      <div
                        key={tc.id}
                        className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-lg text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-mono font-medium text-neutral-200">
                            {tc.toolName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 tabular-nums">
                          {tc.durationMs}ms runtime
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Transcript */}
                <div>
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                    Session Transcript ({selectedSession.messages.length} utterances)
                  </span>
                  <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg max-h-48 overflow-y-auto space-y-2 text-xs">
                    {selectedSession.messages.map((m) => (
                      <div key={m.id} className="flex items-start gap-2">
                        <span
                          className={`font-mono text-[10px] uppercase font-bold shrink-0 mt-0.5 ${
                            m.sender === 'user' ? 'text-neutral-400' : 'text-indigo-400'
                          }`}
                        >
                          {m.sender === 'user' ? 'USER:' : 'AGENT:'}
                        </span>
                        <p className="text-neutral-300 leading-relaxed">
                          "{m.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
