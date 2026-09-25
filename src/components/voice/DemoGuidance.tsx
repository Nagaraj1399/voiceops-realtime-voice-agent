import React from 'react';
import { Play, Sparkles, MessageSquareQuote, RotateCcw } from 'lucide-react';

interface DemoGuidanceProps {
  onRunDemoScript: () => void;
  onResetSession: () => void;
  onSelectPrompt: (prompt: string) => void;
  selectedPrompt?: string;
}

export const DemoGuidance: React.FC<DemoGuidanceProps> = ({
  onRunDemoScript,
  onResetSession,
  onSelectPrompt,
  selectedPrompt = '',
}) => {
  const prompts = [
    'Book AC maintenance tomorrow.',
    'Actually, evening is better.',
    'Book the 7 PM slot.',
    'Cancel my booking.',
    'Transfer me to a human.',
  ];

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-800">
            TRY SAYING
          </span>
        </div>

        {/* Hackathon Judging Auto-Demo Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetSession}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset active session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRunDemoScript}
            className="flex-1 sm:flex-initial min-h-[36px] px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs shadow-indigo-600/20 active:scale-95"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run Hackathon Demo Flow</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-600">
        Click any phrase below for vocal or test guidance. The agent parses intent, executes schema-backed tools, and confirms results.
      </p>

      {/* Guidance Chips */}
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => {
          const isSelected = selectedPrompt === p;
          return (
            <button
              key={p}
              onClick={() => onSelectPrompt(p)}
              className={`min-h-[36px] px-3 py-1.5 text-xs rounded-lg transition-colors border text-left flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
              <span>"{p}"</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
