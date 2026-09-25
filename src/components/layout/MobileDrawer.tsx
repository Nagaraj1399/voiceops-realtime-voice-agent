import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Mic,
  MessageSquareText,
  CheckSquare,
  BarChart3,
  Cpu,
  Settings,
  Radio,
  ExternalLink,
  X,
  Gauge,
  ShieldCheck,
  Palette,
  Check,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { AgentState } from '../../types/voice';
import { AppTheme, THEME_CONFIGS } from '../../types/theme';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  agentState: AgentState;
  currentTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  agentState,
  currentTheme = 'obsidian',
  onSelectTheme,
}) => {
  const isCallActive = agentState !== 'idle' && agentState !== 'error';

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live Voice Agent', icon: Mic, badge: isCallActive ? 'LIVE' : undefined },
    { id: 'conversations', label: 'Conversation History', icon: MessageSquareText },
    { id: 'actions', label: 'Business Actions', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics & Latency', icon: BarChart3 },
    { id: 'architecture', label: 'Architecture & Rubrics', icon: Cpu },
    { id: 'settings', label: 'Voice Settings', icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-4/5 max-w-xs bg-white border-r border-slate-200 flex flex-col justify-between h-full z-10 shadow-2xl animate-slideIn">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm tracking-tight block">
                  VoiceOps AI
                </span>
                <span className="text-[10px] text-slate-500 block font-normal leading-none">
                  Voice-to-Action Platform
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close menu"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar on Mobile */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Gauge className="w-3.5 h-3.5 text-indigo-600" />
              <span>420 ms latency</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Universal-3.5 Pro</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs border border-indigo-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Theme / Background Switcher */}
          {onSelectTheme && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-2">
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                <span className="uppercase tracking-wider">Background Theme</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(THEME_CONFIGS) as AppTheme[]).map((tKey) => {
                  const cfg = THEME_CONFIGS[tKey];
                  const isSelected = currentTheme === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => onSelectTheme(tKey)}
                      className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-left text-xs font-medium flex items-center justify-between border transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-white border-indigo-500 text-indigo-950 font-semibold shadow-xs'
                          : 'bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cfg.previewColor }}
                        />
                        <span className="truncate text-[11px]">{cfg.name.split(' ')[0]}</span>
                      </div>
                      {isSelected && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">
                AssemblyAI Stack
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">WebSocket Duplex</span>
              <span className="font-mono text-emerald-600 text-[11px] font-medium">Ready</span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Barge-in VAD</span>
              <a
                href="https://www.assemblyai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 flex items-center gap-1 font-sans"
              >
                <span>Docs</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
