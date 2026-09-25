import React, { useState } from 'react';
import { AgentState, ConversationMessage, ToolCall, BusinessAction, PipelineStage } from '../../types/voice';
import { TranscriptPanel } from '../voice/TranscriptPanel';
import { VoiceControl } from '../voice/VoiceControl';
import { VoiceVisualizer } from '../voice/VoiceVisualizer';
import { RealtimeToolPipeline } from '../voice/RealtimeToolPipeline';
import { AgentActivityPanel } from '../voice/AgentActivityPanel';
import { DemoGuidance } from '../voice/DemoGuidance';
import { Send, Radio, Info, Mic, MessageSquare, Zap, Square, AlertCircle, Play } from 'lucide-react';

interface LiveAgentPageProps {
  agentState: AgentState;
  pipelineStage: PipelineStage;
  messages: ConversationMessage[];
  toolCalls: ToolCall[];
  actions: BusinessAction[];
  audioLevels: number[];
  currentIntent: string;
  collectedEntities: Record<string, string>;
  onToggleSession: () => void;
  onInterrupt: () => void;
  onSendTextMessage: (text: string) => void;
  onRunDemoScript: () => void;
  onResetSession: () => void;
}

export const LiveAgentPage: React.FC<LiveAgentPageProps> = ({
  agentState,
  pipelineStage,
  messages,
  toolCalls,
  actions,
  audioLevels,
  currentIntent,
  collectedEntities,
  onToggleSession,
  onInterrupt,
  onSendTextMessage,
  onRunDemoScript,
  onResetSession,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'studio' | 'transcript' | 'activity'>('studio');

  const isCallActive = agentState !== 'idle' && agentState !== 'error';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendTextMessage(inputText.trim());
    setInputText('');
  };

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setInputText(prompt);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Hackathon Context */}
      <div className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="leading-snug">
            <strong className="text-slate-900">Hackathon Live Demo:</strong> VoiceOps AI turns conversational audio directly into verified tool execution.
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
          <span className="hidden sm:inline">Turn-Taking: Neural VAD</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-emerald-700 font-semibold">Barge-in Active</span>
        </div>
      </div>

      {/* MOBILE ONLY: Sticky Live Call Status Header Bar when active */}
      {isCallActive && (
        <div className="lg:hidden p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                agentState === 'speaking'
                  ? 'bg-indigo-600 animate-ping'
                  : agentState === 'listening'
                  ? 'bg-emerald-500 animate-pulse'
                  : agentState === 'thinking'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <div className="leading-tight">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono block">
                {agentState === 'speaking' && 'Agent Speaking'}
                {agentState === 'listening' && 'Listening to you...'}
                {agentState === 'thinking' && 'Processing Intent...'}
                {agentState === 'interrupted' && 'User Interrupted'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentIntent ? `Intent: ${currentIntent}` : 'Duplex Voice Stream'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {agentState === 'speaking' && (
              <button
                onClick={onInterrupt}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-xs font-mono font-medium flex items-center gap-1 active:scale-95"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Barge-In</span>
              </button>
            )}

            <button
              onClick={onToggleSession}
              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 active:scale-95 shadow-xs"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>End</span>
            </button>
          </div>
        </div>
      )}

      {/* MOBILE ONLY: Dynamic View Switcher Tabs */}
      <div className="lg:hidden flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium">
        <button
          onClick={() => setMobileTab('studio')}
          className={`flex-1 min-h-[38px] flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
            mobileTab === 'studio'
              ? 'bg-white text-indigo-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-indigo-600" />
          <span>Voice Studio</span>
        </button>

        <button
          onClick={() => setMobileTab('transcript')}
          className={`flex-1 min-h-[38px] flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
            mobileTab === 'transcript'
              ? 'bg-white text-indigo-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          <span>Transcript</span>
          {messages.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-[10px] font-mono text-slate-700 font-semibold">
              {messages.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setMobileTab('activity')}
          className={`flex-1 min-h-[38px] flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
            mobileTab === 'activity'
              ? 'bg-white text-indigo-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Tools & Actions</span>
          {toolCalls.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-medium">
              {toolCalls.length}
            </span>
          )}
        </button>
      </div>

      {/* MOBILE VIEW CONTENT */}
      <div className="lg:hidden space-y-4">
        {mobileTab === 'studio' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Circular Voice Control */}
            <VoiceControl
              state={agentState}
              onToggleSession={onToggleSession}
              onInterrupt={onInterrupt}
            />

            {/* Audio Waveform Visualizer */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Audio Frequency Stream
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {agentState === 'speaking' ? 'Agent Output' : agentState === 'listening' ? 'User Input' : 'Idle'}
                </span>
              </div>
              <VoiceVisualizer levels={audioLevels} state={agentState} />
            </div>

            {/* Real-time Tool Pipeline Tracker */}
            <RealtimeToolPipeline currentStage={pipelineStage} />

            {/* "Try Saying" Demo Guidance */}
            <DemoGuidance
              onRunDemoScript={onRunDemoScript}
              onResetSession={onResetSession}
              onSelectPrompt={handleSelectPrompt}
              selectedPrompt={selectedPrompt}
            />
          </div>
        )}

        {mobileTab === 'transcript' && (
          <div className="h-[calc(100dvh-17rem)] min-h-[420px] flex flex-col animate-fadeIn">
            <TranscriptPanel
              messages={messages}
              state={agentState}
              className="flex-1 shadow-xs"
            />

            {/* Text input fallback */}
            <form onSubmit={handleSend} className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type spoken phrase here..."
                className="flex-1 px-3 py-2.5 text-sm sm:text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-xs"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shrink-0 active:scale-95 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {mobileTab === 'activity' && (
          <div className="h-[calc(100dvh-17rem)] min-h-[420px] animate-fadeIn">
            <AgentActivityPanel
              currentIntent={currentIntent}
              collectedEntities={collectedEntities}
              toolCalls={toolCalls}
              actions={actions}
              className="h-full shadow-xs"
            />
          </div>
        )}
      </div>

      {/* DESKTOP 3-COLUMN CORE GRID (Hidden on mobile) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-5 min-h-[640px]">
        {/* LEFT COLUMN: Live Conversation Transcript (Col 1-4) */}
        <div className="lg:col-span-4 h-[680px] flex flex-col">
          <TranscriptPanel
            messages={messages}
            state={agentState}
            className="flex-1 shadow-xs"
          />

          {/* Quick manual text input fallback for silent testing */}
          <form onSubmit={handleSend} className="mt-2.5 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type voice phrase here..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-xs"
            />
            <button
              type="submit"
              aria-label="Send transcript message"
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* CENTER COLUMN: Voice Interaction & Pipeline (Col 5-8) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Circular Microphone & Interruption State */}
          <VoiceControl
            state={agentState}
            onToggleSession={onToggleSession}
            onInterrupt={onInterrupt}
          />

          {/* Subtle Audio Waveform Visualizer */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Frequency Activity
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {agentState === 'speaking' ? 'Agent Output' : agentState === 'listening' ? 'User Input' : 'Idle'}
              </span>
            </div>
            <VoiceVisualizer levels={audioLevels} state={agentState} />
          </div>

          {/* Real-time Tool Pipeline Tracker */}
          <RealtimeToolPipeline currentStage={pipelineStage} />

          {/* "Try Saying" Demo Guidance */}
          <DemoGuidance
            onRunDemoScript={onRunDemoScript}
            onResetSession={onResetSession}
            onSelectPrompt={handleSelectPrompt}
            selectedPrompt={selectedPrompt}
          />
        </div>

        {/* RIGHT COLUMN: Live Agent Activity, Tool Calls & Actions (Col 9-12) */}
        <div className="lg:col-span-4 h-[680px]">
          <AgentActivityPanel
            currentIntent={currentIntent}
            collectedEntities={collectedEntities}
            toolCalls={toolCalls}
            actions={actions}
            className="h-full shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};
