import React from 'react';
import { User, Brain, Wrench, Server, CheckCircle2, Volume2, ArrowRight } from 'lucide-react';
import { PipelineStage } from '../../types/voice';

interface RealtimeToolPipelineProps {
  currentStage: PipelineStage;
  className?: string;
}

export const RealtimeToolPipeline: React.FC<RealtimeToolPipelineProps> = ({
  currentStage,
  className = '',
}) => {
  const steps = [
    {
      id: 'user_speech',
      label: 'USER SPEECH',
      sublabel: 'Speech-to-Text',
      icon: User,
    },
    {
      id: 'intent_detection',
      label: 'INTENT',
      sublabel: 'Semantic reasoning',
      icon: Brain,
    },
    {
      id: 'tool_routing',
      label: 'TOOL ROUTER',
      sublabel: 'JSON Schema match',
      icon: Wrench,
    },
    {
      id: 'business_system',
      label: 'BUSINESS API',
      sublabel: 'Execution & state',
      icon: Server,
    },
    {
      id: 'result_verification',
      label: 'VERIFY RESULT',
      sublabel: 'Payload verified',
      icon: CheckCircle2,
    },
    {
      id: 'voice_response',
      label: 'VOICE RESPONSE',
      sublabel: 'Conversational audio',
      icon: Volume2,
    },
  ];

  const getStageIndex = (stage: PipelineStage): number => {
    switch (stage) {
      case 'user_speech':
        return 0;
      case 'intent_detection':
        return 1;
      case 'tool_routing':
        return 2;
      case 'business_system':
        return 3;
      case 'result_verification':
        return 4;
      case 'voice_response':
        return 5;
      default:
        return -1;
    }
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className={`p-4 bg-white border border-slate-200 rounded-xl shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Real-Time Voice Pipeline
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          AssemblyAI Voice Agent Architecture
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentIndex;
          const isPassed = currentIndex > idx;

          return (
            <div
              key={step.id}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all duration-300 text-center ${
                isActive
                  ? 'bg-indigo-50 border-indigo-400 shadow-xs ring-1 ring-indigo-400/40'
                  : isPassed
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              {/* Arrow connector for non-last items */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}

              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center mb-1.5 transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : isPassed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <span
                className={`text-[11px] font-mono font-semibold tracking-tight uppercase ${
                  isActive ? 'text-indigo-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight">
                {step.sublabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
