import React from 'react';
import { AgentState } from '../../types/voice';

interface VoiceVisualizerProps {
  levels: number[];
  state: AgentState;
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ levels, state, className = '' }) => {
  const barsCount = 28;
  const bars = Array.from({ length: barsCount }, (_, i) => {
    // Mirror around center
    const centerDist = Math.abs(i - barsCount / 2) / (barsCount / 2);
    const sourceIdx = Math.floor((1 - centerDist) * (levels.length - 1));
    const level = levels[sourceIdx] || 0.05;
    
    // Scale height based on state
    let heightMultiplier = 1;
    if (state === 'speaking') {
      heightMultiplier = 1.35;
    } else if (state === 'listening') {
      heightMultiplier = 0.9;
    } else if (state === 'thinking') {
      heightMultiplier = 0.5 + Math.sin(Date.now() / 200 + i * 0.4) * 0.3;
    } else {
      heightMultiplier = 0.15;
    }

    const heightPct = Math.max(8, Math.min(100, level * 100 * heightMultiplier));
    return { id: i, heightPct };
  });

  return (
    <div className={`relative flex items-center justify-center h-20 px-4 select-none ${className}`}>
      {/* Background ambient glow */}
      <div 
        className={`absolute inset-0 mx-auto w-48 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none ${
          state === 'speaking' 
            ? 'bg-indigo-600/20 opacity-100' 
            : state === 'listening'
            ? 'bg-emerald-500/15 opacity-80'
            : state === 'thinking'
            ? 'bg-amber-500/15 opacity-80'
            : state === 'interrupted'
            ? 'bg-rose-500/20 opacity-100'
            : 'bg-neutral-800/20 opacity-20'
        }`} 
      />

      {/* Waveform bars */}
      <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-md z-10">
        {bars.map((bar) => {
          let barColor = 'bg-neutral-700';
          if (state === 'speaking') {
            barColor = 'bg-indigo-400';
          } else if (state === 'listening') {
            barColor = 'bg-emerald-400';
          } else if (state === 'thinking') {
            barColor = 'bg-amber-400';
          } else if (state === 'interrupted') {
            barColor = 'bg-rose-400';
          }

          return (
            <div
              key={bar.id}
              className={`w-1 rounded-full transition-all duration-75 ${barColor}`}
              style={{
                height: `${bar.heightPct}%`,
                opacity: Math.max(0.35, bar.heightPct / 100),
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
