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
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl relative overflow-hidden">
      {/* Top Interruption & Status Badge */}
      <div className="flex items-center justify-between w-full mb-4 px-2 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              state === 'speaking'
                ? 'bg-indigo-400 animate-ping'
                : state === 'listening'
                ? 'bg-emerald-400 animate-pulse'
                : state === 'thinking'
                ? 'bg-amber-400 animate-pulse'
                : state === 'interrupted'
                ? 'bg-rose-400'
                : 'bg-neutral-500'
            }`}
          />
          <span className="font-mono uppercase tracking-wider text-neutral-400">
            {state === 'idle' && 'IDLE'}
            {state === 'listening' && 'LISTENING'}
            {state === 'thinking' && 'THINKING'}
            {state === 'speaking' && 'SPEAKING'}
            {state === 'interrupted' && 'INTERRUPTED'}
            {state === 'error' && 'ERROR'}
          </span>
        </div>

        {/* Real-time interruption status indicator */}
        <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[11px]">
          <Radio className="w-3.5 h-3.5 text-indigo-400" />
          <span>Real-time interruption enabled</span>
        </div>
      </div>

      {/* Interruption alert callout banner */}
      {state === 'interrupted' && (
        <div className="w-full mb-3 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-medium">User interruption detected</span>
          </div>
          <span className="text-[11px] text-rose-400/80">Agent speech stopped</span>
        </div>
      )}

      {/* Circular Central Microphone Control */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Activity pulse rings when live */}
        {isLive && (
          <>
            <div
              className={`absolute -inset-4 rounded-full border opacity-40 transition-all duration-700 ${
                state === 'speaking'
                  ? 'border-indigo-500/40 animate-ping scale-110'
                  : state === 'listening'
                  ? 'border-emerald-500/40 animate-pulse'
                  : state === 'thinking'
                  ? 'border-amber-500/40 animate-pulse'
                  : 'border-neutral-700'
              }`}
            />
            <div
              className={`absolute -inset-8 rounded-full border opacity-20 transition-all duration-1000 ${
                state === 'speaking'
                  ? 'border-indigo-400/30 animate-pulse'
                  : state === 'listening'
                  ? 'border-emerald-400/30'
                  : 'border-neutral-800'
              }`}
            />
          </>
        )}

        {/* Main Central Button */}
        <button
          onClick={onToggleSession}
          aria-label={isLive ? 'End voice session' : 'Start voice conversation'}
          className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            state === 'idle'
              ? 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 hover:scale-105'
              : state === 'listening'
              ? 'bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400/50 text-white shadow-emerald-900/40'
              : state === 'thinking'
              ? 'bg-amber-600/90 hover:bg-amber-500 border border-amber-400/50 text-white shadow-amber-900/40'
              : state === 'speaking'
              ? 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/50 text-white shadow-indigo-900/50'
              : state === 'interrupted'
              ? 'bg-rose-600 border border-rose-400/50 text-white shadow-rose-900/50'
              : 'bg-neutral-800 text-neutral-400'
          }`}
        >
          {state === 'idle' ? (
            <>
              <Mic className="w-8 h-8 mb-1 text-neutral-300" />
              <span className="text-[11px] font-medium tracking-tight">START</span>
            </>
          ) : state === 'listening' ? (
            <>
              <Mic className="w-8 h-8 mb-1 animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider">LISTENING</span>
            </>
          ) : state === 'thinking' ? (
            <>
              <Sparkles className="w-8 h-8 mb-1 animate-spin" />
              <span className="text-[10px] font-mono tracking-wider">THINKING</span>
            </>
          ) : state === 'speaking' ? (
            <>
              <Radio className="w-8 h-8 mb-1 animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider">SPEAKING</span>
            </>
          ) : state === 'interrupted' ? (
            <>
              <MicOff className="w-8 h-8 mb-1" />
              <span className="text-[10px] font-mono tracking-wider">HALTED</span>
            </>
          ) : (
            <Mic className="w-8 h-8 text-neutral-400" />
          )}
        </button>
      </div>

      {/* Action Subtext & Barge-In Button */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2">
        {isLive ? (
          <>
            <button
              onClick={onInterrupt}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95"
              title="Test barge-in interruption while agent speaks"
            >
              <MicOff className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Barge-in (Interrupt)</span>
            </button>
            <button
              onClick={onToggleSession}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>End Call</span>
            </button>
          </>
        ) : (
          <p className="text-xs text-neutral-400 text-center">
            Click to activate live voice session or try an example prompt below.
          </p>
        )}
      </div>
    </div>
  );
};
