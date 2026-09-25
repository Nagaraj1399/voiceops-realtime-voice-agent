import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import {
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Code2,
  CalendarCheck,
  UserCheck,
  XCircle,
  AlertTriangle,
  Zap,
  Tag
} from 'lucide-react';
import { ToolCall, BusinessAction } from '../../types/voice';

interface AgentActivityPanelProps {
  currentIntent?: string;
  collectedEntities?: Record<string, string>;
  toolCalls: ToolCall[];
  actions: BusinessAction[];
  className?: string;
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({
  currentIntent,
  collectedEntities = {},
  toolCalls,
  actions,
  className = '',
}) => {
  const [openToolIds, setOpenToolIds] = useState<Record<string, boolean>>({});

  const toggleToolDetails = (id: string) => {
    setOpenToolIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Live Agent Activity</h2>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
            <span>JSON Schema Engine</span>
            <span aria-hidden="true">·</span>
            <span>Business Action Dispatch</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded border border-slate-200 text-[11px] font-mono text-slate-700 shadow-xs">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>{toolCalls.length} Tools Run</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
        {/* Section 1: Intent & Information Collection */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              Active Intent
            </span>
            {currentIntent ? (
              <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Classified
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400">Awaiting speech</span>
            )}
          </div>

          <p className="text-sm font-medium text-slate-800">
            {currentIntent || 'No intent recognized yet.'}
          </p>

          {/* Collected Slots/Entities */}
          {Object.keys(collectedEntities).length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 block mb-1.5">
                Collected Context:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(collectedEntities).map(([key, val]) => (
                  <div key={key} className="p-1.5 bg-white rounded border border-slate-200 flex flex-col shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{key}</span>
                    <span className="text-slate-800 font-medium truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Real-time Tool Calls */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-slate-600 uppercase tracking-wider">
              Tool Calls (JSON Schema)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {toolCalls.length} recorded
            </span>
          </div>

          {toolCalls.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-500">
              Tool calls will appear in real time as user requests require backend lookups.
            </div>
          ) : (
            <div className="space-y-2.5">
              {toolCalls.map((tc) => {
                const isOpen = Boolean(openToolIds[tc.id]);

                return (
                  <Collapsible.Root
                    key={tc.id}
                    open={isOpen}
                    onOpenChange={() => toggleToolDetails(tc.id)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tc.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : tc.status === 'running' ? (
                          <Clock className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <div className="font-mono font-semibold text-slate-800 text-xs">
                            {tc.toolName}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                            {tc.timestamp} {tc.durationMs ? `· ${tc.durationMs}ms` : ''}
                          </span>
                        </div>
                      </div>

                      <Collapsible.Trigger asChild>
                        <button
                          aria-label={isOpen ? 'Hide raw JSON details' : 'View raw JSON details'}
                          className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-700 transition-colors shadow-xs"
                        >
                          <Code2 className="w-3 h-3 text-indigo-600" />
                          <span>{isOpen ? 'Hide' : 'Details'}</span>
                          {isOpen ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>
                      </Collapsible.Trigger>
                    </div>

                    {/* Collapsible structured JSON viewer */}
                    <Collapsible.Content className="mt-3 pt-2.5 border-t border-slate-200 space-y-2 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block mb-1">Input Schema Payload:</span>
                        <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-200 overflow-x-auto">
                          {JSON.stringify(tc.input, null, 2)}
                        </pre>
                      </div>

                      {tc.output && (
                        <div>
                          <span className="text-slate-500 block mb-1">Tool Output Result:</span>
                          <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-400 overflow-x-auto">
                            {JSON.stringify(tc.output, null, 2)}
                          </pre>
                        </div>
                      )}
                    </Collapsible.Content>
                  </Collapsible.Root>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Verified Business Actions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-slate-600 uppercase tracking-wider">
              Verified Business Actions
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {actions.length} confirmed
            </span>
          </div>

          {actions.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-500">
              No actions committed yet. Schedule an appointment to see live confirmation.
            </div>
          ) : (
            <div className="space-y-2">
              {actions.map((act) => {
                const isBooking = act.type === 'booking_created';
                const isEscalation = act.type === 'human_escalated';

                return (
                  <div
                    key={act.id}
                    className={`p-3 rounded-lg border text-xs transition-all ${
                      isBooking
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : isEscalation
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        {isBooking ? (
                          <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : isEscalation ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                        <span className="font-semibold">{act.title}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                        {act.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[11px] font-mono">
                      <span className="text-slate-500">Ref: {act.referenceId}</span>
                      <span
                        className={`font-semibold ${
                          act.status === 'confirmed'
                            ? 'text-emerald-700'
                            : act.status === 'cancelled'
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }`}
                      >
                        ✓ {act.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>Zero hallucinations</span>
        <span>Schema-enforced state</span>
      </div>
    </div>
  );
};
