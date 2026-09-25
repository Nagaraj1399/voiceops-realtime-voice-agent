import React, { useRef, useEffect } from 'react';
import { Radio, MicOff, User, Bot, Clock } from 'lucide-react';
import { ConversationMessage, AgentState } from '../../types/voice';

interface TranscriptPanelProps {
  messages: ConversationMessage[];
  state: AgentState;
  className?: string;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  messages,
  state,
  className = '',
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

  return (
    <div className={`flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/80">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Live Conversation</h2>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
            <span>AssemblyAI</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Audio Stream</span>
          </div>
        </div>

        {/* Real-time Connection Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-medium text-emerald-700">Connected</span>
        </div>
      </div>

      {/* Transcript Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
            <Radio className="w-8 h-8 mb-2 opacity-40 text-indigo-500" />
            <p className="text-sm font-medium text-slate-600">Awaiting audio session...</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Click Start or use one of the interactive scenario prompts to begin speaking with VoiceOps AI.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isUser
                    ? 'bg-slate-50 border-slate-200 ml-4 text-slate-800'
                    : 'bg-indigo-50/70 border-indigo-200 mr-4 text-indigo-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {isUser ? (
                      <span className="flex items-center gap-1 text-slate-700 font-mono text-[11px] font-semibold uppercase tracking-wider">
                        <User className="w-3 h-3 text-slate-500" />
                        USER
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-indigo-700 font-mono text-[11px] font-semibold uppercase tracking-wider">
                        <Bot className="w-3 h-3 text-indigo-600" />
                        VOICEOPS AGENT
                      </span>
                    )}

                    {/* Interruption marker */}
                    {msg.interrupted && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        <MicOff className="w-2.5 h-2.5" />
                        Barge-in
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums text-slate-400">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-800">
                  "{msg.text}"
                </p>
              </div>
            );
          })
        )}

        {/* Live typing / thinking indicator */}
        {state === 'thinking' && (
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 mr-4 text-xs text-amber-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="font-mono">Processing intent & routing business tools...</span>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Footer notes */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>Universal-3.5 Pro ASR</span>
        <span>Neural VAD Enabled</span>
      </div>
    </div>
  );
};
