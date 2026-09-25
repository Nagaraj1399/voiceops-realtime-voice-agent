import React from 'react';
import {
  PhoneCall,
  Play,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  Repeat,
  Radio,
  Workflow
} from 'lucide-react';
import { VoiceVisualizer } from '../voice/VoiceVisualizer';

interface OverviewPageProps {
  onStartVoiceSession: () => void;
  onLaunchDemo: () => void;
  audioLevels: number[];
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onStartVoiceSession,
  onLaunchDemo,
  audioLevels,
}) => {
  const metrics = [
    { label: 'Active Sessions', value: '24', detail: 'Real-time duplex streams' },
    { label: 'Actions Completed', value: '1,284', detail: 'Zero human intervention' },
    { label: 'Avg. Response', value: '420 ms', detail: 'Audio in to audio out' },
    { label: 'Success Rate', value: '98.7%', detail: 'Verified API transactions' },
  ];

  const fourStepFlow = [
    {
      step: '01',
      title: 'TALK',
      description: 'User speaks naturally in unconstrained voice, without rigid menu trees.',
    },
    {
      step: '02',
      title: 'UNDERSTAND',
      description: 'Universal-3.5 Pro ASR and LLM extract semantic intent and parameters.',
    },
    {
      step: '03',
      title: 'ACT',
      description: 'Structured JSON Schema tools execute verified actions in business systems.',
    },
    {
      step: '04',
      title: 'CONFIRM',
      description: 'Voice agent verbally confirms appointment codes and changes in real time.',
    },
  ];

  const industries = [
    'Customer Support',
    'Field Service & HVAC',
    'Appointment Booking',
    'Sales Qualification',
    'Banking Support',
    'Insurance Claims',
    'Hospitality & Dining',
    'Internal IT Ops',
  ];

  const assemblyCards = [
    {
      title: 'Real-time Speech',
      description: 'Fast, high-accuracy speech recognition powered by Universal-3.5 Pro streaming ASR.',
      icon: Radio,
    },
    {
      title: 'Natural Turn-Taking',
      description: 'Neural voice activity detection knows precisely when the speaker finishes a thought.',
      icon: Repeat,
    },
    {
      title: 'Interruption Handling',
      description: 'Full barge-in capability stops agent speech instantly when the human speaks.',
      icon: ShieldAlert,
    },
    {
      title: 'Voice Responses',
      description: 'Natural speech synthesis with emotional modulation and sub-500ms first audio packet.',
      icon: Sparkles,
    },
    {
      title: 'Tool Calling',
      description: 'Transforms free-flowing speech into validated JSON payloads for enterprise APIs.',
      icon: Cpu,
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>VoiceOps AI · Real-time Voice Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-[1.15]">
              Talk naturally. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700">
                Get work done.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              VoiceOps AI combines AssemblyAI's real-time voice intelligence with structured business tools to turn natural spoken conversations into verified business actions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={onStartVoiceSession}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Start Voice Session</span>
              </button>

              <button
                onClick={onLaunchDemo}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-95"
              >
                <Play className="w-4 h-4 text-indigo-600 fill-current" />
                <span>Watch Interactive Demo</span>
              </button>
            </div>
          </div>

          {/* Right Hero Visualizer Container */}
          <div className="lg:col-span-5">
            <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Audio Stream Visualizer
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700">
                  AssemblyAI Ready
                </span>
              </div>

              {/* Waveform */}
              <VoiceVisualizer levels={audioLevels} state="speaking" className="my-4" />

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">VAD Engine</span>
                  <span className="font-semibold text-slate-800">Neural Turn Detection</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Interruption</span>
                  <span className="font-semibold text-indigo-600">Barge-in Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs"
          >
            <div className="text-xs font-medium text-slate-500 mb-1">{m.label}</div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
              {m.value}
            </div>
            <div className="text-xs text-slate-500 mt-1">{m.detail}</div>
          </div>
        ))}
      </section>

      {/* Core Flow: TALK -> UNDERSTAND -> ACT -> CONFIRM */}
      <section className="space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600">
            Mechanism to Outcome
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            How VoiceOps AI Works
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            A continuous real-time pipeline that eliminates manual data entry and bridges spoken requests directly to verified database changes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {fourStepFlow.map((item, idx) => (
            <div
              key={item.step}
              className="p-5 bg-white border border-slate-200 rounded-xl relative group hover:border-indigo-300 transition-all shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-extrabold font-mono text-indigo-600">
                  {item.step}
                </span>
                {idx < 3 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 hidden lg:block" />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Beyond Voice Chatbots: Originality comparison */}
      <section className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600">
            Key Architectural Differentiator
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Beyond Voice Chatbots
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Traditional voice assistants stop at information retrieval. VoiceOps AI is an operations agent engineered to execute verified business workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider">
                Traditional Voice Bot
              </span>
              <span className="text-[11px] font-mono text-slate-500">Read-Only</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm font-mono text-slate-600 py-3 border-y border-slate-200">
              <span>Talk</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="text-slate-800 font-semibold">Answer</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Provides text answers or static documentation. The customer still has to navigate to a portal, fill out forms, or wait on hold for a human agent to finalize changes.
            </p>
          </div>

          {/* VoiceOps AI */}
          <div className="p-6 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-indigo-900 uppercase tracking-wider">
                VoiceOps AI
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300 text-[11px] font-mono font-medium">
                Full Transactional Loop
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-indigo-900 py-3 border-y border-indigo-200">
              <span>Talk</span>
              <ArrowRight className="w-3 h-3 text-indigo-500" />
              <span>Understand</span>
              <ArrowRight className="w-3 h-3 text-indigo-500" />
              <span>Decide</span>
              <ArrowRight className="w-3 h-3 text-indigo-500" />
              <span>Call Tools</span>
              <ArrowRight className="w-3 h-3 text-indigo-500" />
              <span className="text-indigo-950 font-bold bg-indigo-100 px-1.5 py-0.5 rounded">Act & Confirm</span>
            </div>

            <p className="text-xs text-indigo-950/80 leading-relaxed">
              Gathers missing parameters, validates schedule constraints via strict JSON Schema tools, commits confirmed bookings to dispatch databases, and verbally delivers confirmed booking codes.
            </p>
          </div>
        </div>
      </section>

      {/* Business Value & Reusable Across Industries */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600">
            Enterprise Value Proposition
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Why VoiceOps AI?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reduce Repetitive Work</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Automates up to 85% of standard scheduling, warranty verification, and routine inquiries, freeing field supervisors for complex diagnostics.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Increase Availability</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Provide instantaneous, zero-wait voice triage 24/7/365 without staffing night shifts or paying per-minute legacy call center fees.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Turn Conversations into Actions</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Connect natural speech directly into existing SQL databases, CRM backends, and dispatch dispatchers via strict JSON Schema contracts.
            </p>
          </div>
        </div>

        {/* Reusable Industries Grid */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Designed for Real Business Workflows Across Industries
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {industries.map((ind) => (
              <div
                key={ind}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AssemblyAI Technology Section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-600">
              Core Technology
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Powered by AssemblyAI Real-Time Voice Agent
            </h2>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 font-medium">
            Official Voice Agent Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {assemblyCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2"
              >
                <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">{card.title}</h3>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
