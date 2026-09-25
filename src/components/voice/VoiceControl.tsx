import React from 'react';
import { Mic, MicOff, Square, Radio, Sparkles, AlertCircle } from 'lucide-react';
import { AgentState } from '../../types/voice';

interface VoiceControlProps {
  state: AgentState;
  onToggleSession: () => void;
  onInterrupt: () => void;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({
  state,
  onToggleSession,
  onInterrupt,
}) => {
  const isLive = state !== 'idle' && state !== 'error';

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white border border-slate-200 rounded-xl relative overflow-hidden shadow-xs">
      {/* Top Interruption & Status Badge */}
      <div className="flex items-center justify-between w-full mb-4 px-2 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              state === 'speaking'
                ? 'bg-indigo-600 animate-ping'
                : state === 'listening'
                ? 'bg-emerald-500 animate-pulse'
                : state === 'thinking'
                ? 'bg-amber-500 animate-pulse'
                : state === 'interrupted'
                ? 'bg-rose-500'
                : 'bg-slate-400'
            }`}
          />
          <span className="font-mono uppercase tracking-wider text-slate-600 font-semibold">
            {state === 'idle' && 'IDLE'}
            {state === 'listening' && 'LISTENING'}
            {state === 'thinking' && 'THINKING'}
            {state === 'speaking' && 'SPEAKING'}
            {state === 'interrupted' && 'INTERRUPTED'}
            {state === 'error' && 'ERROR'}
          </span>
        </div>

        {/* Real-time interruption status indicator */}
        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
          <Radio className="w-3.5 h-3.5 text-indigo-600" />
          <span>Real-time interruption enabled</span>
        </div>
      </div>

      {/* Interruption alert callout banner */}
      {state === 'interrupted' && (
        <div className="w-full mb-3 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-medium">User interruption detected</span>
          </div>
          <span className="text-[11px] text-rose-600">Agent speech stopped</span>
        </div>
      )}

      {/* Circular Central Microphone Control */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Activity pulse rings when live */}
        {isLive && (
          <>
            <div
              className={`absolute -inset-4 rounded-full border opacity-50 transition-all duration-700 ${
                state === 'speaking'
                  ? 'border-indigo-400 animate-ping scale-110'
                  : state === 'listening'
                  ? 'border-emerald-400 animate-pulse'
                  : state === 'thinking'
                  ? 'border-amber-400 animate-pulse'
                  : 'border-slate-300'
              }`}
            />
            <div
              className={`absolute -inset-8 rounded-full border opacity-30 transition-all duration-1000 ${
                state === 'speaking'
                  ? 'border-indigo-300 animate-pulse'
                  : state === 'listening'
                  ? 'border-emerald-300'
                  : 'border-slate-200'
              }`}
            />
          </>
        )}

        {/* Main Central Button */}
        <button
          onClick={onToggleSession}
          aria-label={isLive ? 'End voice session' : 'Start voice conversation'}
          className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            state === 'idle'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 hover:scale-105'
              : state === 'listening'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30'
              : state === 'thinking'
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/30'
              : state === 'speaking'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 animate-pulse'
              : state === 'interrupted'
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/30'
              : 'bg-slate-700 text-slate-200'
          }`}
        >
          {state === 'idle' ? (
            <>
              <Mic className="w-8 h-8 mb-1 text-white" />
              <span className="text-[11px] font-bold tracking-tight">START</span>
            </>
          ) : state === 'listening' ? (
            <>
              <Mic className="w-8 h-8 mb-1 animate-pulse text-white" />
              <span className="text-[10px] font-mono tracking-wider font-semibold">LISTENING</span>
            </>
          ) : state === 'thinking' ? (
            <>
              <Sparkles className="w-8 h-8 mb-1 animate-spin text-white" />
              <span className="text-[10px] font-mono tracking-wider font-semibold">THINKING</span>
            </>
          ) : state === 'speaking' ? (
            <>
              <Radio className="w-8 h-8 mb-1 animate-pulse text-white" />
              <span className="text-[10px] font-mono tracking-wider font-semibold">SPEAKING</span>
            </>
          ) : state === 'interrupted' ? (
            <>
              <MicOff className="w-8 h-8 mb-1 text-white" />
              <span className="text-[10px] font-mono tracking-wider font-semibold">HALTED</span>
            </>
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* Action Subtext & Barge-In Button */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2">
        {isLive ? (
          <>
            <button
              onClick={onInterrupt}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95 shadow-xs"
              title="Test barge-in interruption while agent speaks"
            >
              <MicOff className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Barge-in (Interrupt)</span>
            </button>
            <button
              onClick={onToggleSession}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>End Call</span>
            </button>
          </>
        ) : (
          <p className="text-xs text-slate-500 text-center">
            Click to activate live voice session or try an example prompt below.
          </p>
        )}
      </div>
    </div>
  );
};
