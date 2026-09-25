import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  Repeat,
  ShieldCheck,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const metricCards = [
    { label: 'Total Conversations', value: '1,248', sub: '+18.4% vs last week', icon: Activity },
    { label: 'Successful Actions', value: '1,197', sub: '98.7% verified execution', icon: CheckCircle2 },
    { label: 'Tool Calls Executed', value: '3,842', sub: '3.08 avg per session', icon: Zap },
    { label: 'Average Latency', value: '420 ms', sub: 'Sub-500ms voice pipeline', icon: Clock },
  ];

  // Daily conversation volume data
  const volumeData = [
    { day: 'Mon', count: 142, actions: 135 },
    { day: 'Tue', count: 184, actions: 178 },
    { day: 'Wed', count: 198, actions: 192 },
    { day: 'Thu', count: 215, actions: 209 },
    { day: 'Fri', count: 240, actions: 232 },
    { day: 'Sat', count: 154, actions: 146 },
    { day: 'Sun', count: 115, actions: 105 },
  ];

  const maxVolume = 260;

  // Tool usage distribution
  const toolDistribution = [
    { name: 'check_availability', count: 1420, pct: 37 },
    { name: 'create_booking', count: 980, pct: 25 },
    { name: 'search_information', count: 742, pct: 19 },
    { name: 'get_customer', count: 480, pct: 13 },
    { name: 'cancel_booking', count: 140, pct: 4 },
    { name: 'escalate_to_human', count: 80, pct: 2 },
  ];

  // Pipeline Latency Breakdown
  const latencySteps = [
    { stage: 'Speech-to-Text (AssemblyAI)', latency: '120 ms', pct: 28 },
    { stage: 'Intent & Reasoning (LLM)', latency: '160 ms', pct: 38 },
    { stage: 'JSON Schema Tool Execution', latency: '65 ms', pct: 15 },
    { stage: 'Voice Output Synthesis (TTS)', latency: '75 ms', pct: 19 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Voice Intelligence Analytics
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Real-time performance metrics, schema tool utilization, and conversational latency benchmarks.
        </p>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">{m.label}</span>
                <Icon className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {m.value}
              </div>
              <div className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 font-semibold">
                <span>{m.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Conversation & Action Volume (Col 1-7) */}
        <div className="lg:col-span-7 p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Conversation & Action Volume (Last 7 Days)
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Duplex Voice Sessions vs Executed System Actions
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
                <span>Sessions</span>
              </span>
              <span className="flex items-center gap-1 text-indigo-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
                <span>Actions</span>
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-4">
            <div className="flex items-end justify-between h-48 gap-3 px-2 border-b border-slate-200">
              {volumeData.map((d) => {
                const sessionHeightPct = (d.count / maxVolume) * 100;
                const actionHeightPct = (d.actions / maxVolume) * 100;

                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Session bar */}
                      <div
                        className="w-1/2 bg-slate-200 hover:bg-slate-300 rounded-t transition-all"
                        style={{ height: `${sessionHeightPct}%` }}
                        title={`${d.count} sessions`}
                      />
                      {/* Action bar */}
                      <div
                        className="w-1/2 bg-indigo-600 hover:bg-indigo-700 rounded-t transition-all"
                        style={{ height: `${actionHeightPct}%` }}
                        title={`${d.actions} actions`}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 mt-2 font-medium">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 2: Tool Usage Distribution (Col 8-12) */}
        <div className="lg:col-span-5 p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-xs">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              JSON Tool Usage Distribution
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              Total 3,842 tool dispatches
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {toolDistribution.map((t) => (
              <div key={t.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700 font-medium">{t.name}</span>
                  <span className="text-slate-500 tabular-nums">
                    {t.count} ({t.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latency Breakdown Benchmark */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              End-to-End Latency Waterfall (420 ms Total)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Breakdown from user speech cessation to first audio output token returned to caller.
            </p>
          </div>

          <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-medium">
            Sub-second Human Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {latencySteps.map((s) => (
            <div
              key={s.stage}
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1"
            >
              <span className="text-[11px] font-mono text-slate-600 block truncate font-medium">
                {s.stage}
              </span>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {s.latency}
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${s.pct * 2.2}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
