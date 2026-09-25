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
    <div className={`flex flex-col h-full bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">Live Agent Activity</h2>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
            <span>JSON Schema Engine</span>
            <span aria-hidden="true">·</span>
            <span>Business Action Dispatch</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-[11px] font-mono text-neutral-300">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{toolCalls.length} Tools Run</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Section 1: Intent & Information Collection */}
        <div className="p-3.5 bg-neutral-950/60 border border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Active Intent
            </span>
            {currentIntent ? (
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Classified
              </span>
            ) : (
              <span className="text-[11px] font-mono text-neutral-400">Awaiting speech</span>
            )}
          </div>

          <p className="text-sm font-medium text-neutral-200">
            {currentIntent || 'No intent recognized yet.'}
          </p>

          {/* Collected Slots/Entities */}
          {Object.keys(collectedEntities).length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-neutral-800/80">
              <span className="text-[11px] font-mono text-neutral-400 block mb-1.5">
                Collected Context:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(collectedEntities).map(([key, val]) => (
                  <div key={key} className="p-1.5 bg-neutral-900 rounded border border-neutral-800 flex flex-col">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono">{key}</span>
                    <span className="text-neutral-200 font-medium truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Real-time Tool Calls */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider">
              Tool Calls (JSON Schema)
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              {toolCalls.length} recorded
            </span>
          </div>

          {toolCalls.length === 0 ? (
            <div className="p-4 bg-neutral-950/40 border border-dashed border-neutral-800 rounded-lg text-center text-xs text-neutral-400">
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
                    className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-lg text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tc.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : tc.status === 'running' ? (
                          <Clock className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-mono font-semibold text-neutral-200 text-xs">
                            {tc.toolName}
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 tabular-nums">
                            {tc.timestamp} {tc.durationMs ? `· ${tc.durationMs}ms` : ''}
                          </span>
                        </div>
                      </div>

                      <Collapsible.Trigger asChild>
                        <button
                          aria-label={isOpen ? 'Hide raw JSON details' : 'View raw JSON details'}
                          className="flex items-center gap-1 px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded text-[11px] font-mono text-neutral-300 transition-colors"
                        >
                          <Code2 className="w-3 h-3 text-indigo-400" />
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
                    <Collapsible.Content className="mt-3 pt-2.5 border-t border-neutral-800/80 space-y-2 text-[11px] font-mono">
                      <div>
                        <span className="text-neutral-400 block mb-1">Input Schema Payload:</span>
                        <pre className="p-2 bg-neutral-900 rounded border border-neutral-800 text-neutral-300 overflow-x-auto">
                          {JSON.stringify(tc.input, null, 2)}
                        </pre>
                      </div>

                      {tc.output && (
                        <div>
                          <span className="text-neutral-400 block mb-1">Tool Output Result:</span>
                          <pre className="p-2 bg-neutral-900 rounded border border-neutral-800 text-emerald-300/90 overflow-x-auto">
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
            <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider">
              Verified Business Actions
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              {actions.length} confirmed
            </span>
          </div>

          {actions.length === 0 ? (
            <div className="p-4 bg-neutral-950/40 border border-dashed border-neutral-800 rounded-lg text-center text-xs text-neutral-400">
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
                        ? 'bg-emerald-950/20 border-emerald-800/50'
                        : isEscalation
                        ? 'bg-amber-950/20 border-amber-800/50'
                        : 'bg-neutral-950/60 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-medium text-neutral-200">
                        {isBooking ? (
                          <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isEscalation ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        <span>{act.title}</span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-400 tabular-nums">
                        {act.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 text-[11px] font-mono">
                      <span className="text-neutral-400">Ref: {act.referenceId}</span>
                      <span
                        className={`font-semibold ${
                          act.status === 'confirmed'
                            ? 'text-emerald-400'
                            : act.status === 'cancelled'
                            ? 'text-rose-400'
                            : 'text-amber-400'
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
      <div className="px-4 py-2 bg-neutral-950/60 border-t border-neutral-800/60 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
        <span>Zero hallucinations</span>
        <span>Schema-enforced state</span>
      </div>
    </div>
  );
};
