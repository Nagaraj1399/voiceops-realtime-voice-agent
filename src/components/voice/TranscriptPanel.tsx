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
    <div className={`flex flex-col h-full bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/60">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">Live Conversation</h2>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
            <span>AssemblyAI</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Audio Stream</span>
          </div>
        </div>

        {/* Real-time Connection Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-medium text-emerald-400">Connected</span>
        </div>
      </div>

      {/* Transcript Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-neutral-400">
            <Radio className="w-8 h-8 mb-2 opacity-30 text-indigo-400" />
            <p className="text-sm font-medium text-neutral-400">Awaiting audio session...</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
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
                    ? 'bg-neutral-900/90 border-neutral-700/70 ml-4 text-neutral-100'
                    : 'bg-indigo-950/20 border-indigo-900/40 mr-4 text-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    {isUser ? (
                      <span className="flex items-center gap-1 text-neutral-300 font-mono text-[11px] font-semibold uppercase tracking-wider">
                        <User className="w-3 h-3 text-neutral-400" />
                        USER
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-indigo-300 font-mono text-[11px] font-semibold uppercase tracking-wider">
                        <Bot className="w-3 h-3 text-indigo-400" />
                        VOICEOPS AGENT
                      </span>
                    )}

                    {/* Interruption marker */}
                    {msg.interrupted && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40">
                        <MicOff className="w-2.5 h-2.5" />
                        Barge-in
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums text-neutral-400">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-neutral-200">
                  "{msg.text}"
                </p>
              </div>
            );
          })
        )}

        {/* Live typing / thinking indicator */}
        {state === 'thinking' && (
          <div className="p-3 rounded-lg border border-amber-800/30 bg-amber-950/20 mr-4 text-xs text-amber-300/90 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono">Processing intent & routing business tools...</span>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Footer notes */}
      <div className="px-4 py-2 bg-neutral-950/60 border-t border-neutral-800/60 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
        <span>Universal-3.5 Pro ASR</span>
        <span>Low-latency PCM16 duplex</span>
      </div>
    </div>
  );
};
