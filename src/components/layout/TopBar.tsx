import React, { useState } from 'react';
import { PhoneCall, Gauge, ShieldCheck, Square, Menu, Palette, Check } from 'lucide-react';
import { NavTab } from './Sidebar';
import { AgentState } from '../../types/voice';
import { AppTheme, THEME_CONFIGS } from '../../types/theme';

interface TopBarProps {
  activeTab: NavTab;
  agentState: AgentState;
  currentTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
  onToggleVoice: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  agentState,
  currentTheme = 'obsidian',
  onSelectTheme,
  onToggleVoice,
  onNavigate,
  onOpenMenu,
}) => {
  const isLive = agentState !== 'idle' && agentState !== 'error';
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const tabTitles: Record<NavTab, string> = {
    overview: 'Operations Overview',
    live: 'Live Voice Agent Workspace',
    conversations: 'Conversation History & Transcripts',
    actions: 'Verified Business Actions',
    analytics: 'Voice Intelligence Analytics',
    architecture: 'Technical Architecture & Judging',
    settings: 'Voice Engine Configuration',
  };

  return (
    <header className="h-16 px-3 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between shrink-0 select-none z-20">
      {/* Zone 1: Mobile Hamburger & Wordmark & Section Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onOpenMenu && (
          <button
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
          <span className="text-sm font-bold tracking-tight text-slate-900 shrink-0">
            VoiceOps AI
          </span>
          <span className="text-slate-300 hidden xs:inline">/</span>
          <span className="text-xs text-slate-500 font-medium truncate hidden sm:inline">
            {tabTitles[activeTab]}
          </span>
        </div>
      </div>

      {/* Zone 2: Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600">
        <button
          onClick={() => onNavigate('overview')}
          className={`hover:text-slate-900 transition-colors ${activeTab === 'overview' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => onNavigate('live')}
          className={`hover:text-slate-900 transition-colors ${activeTab === 'live' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Live Agent
        </button>
        <button
          onClick={() => onNavigate('actions')}
          className={`hover:text-slate-900 transition-colors ${activeTab === 'actions' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Business Actions
        </button>
        <button
          onClick={() => onNavigate('architecture')}
          className={`hover:text-slate-900 transition-colors ${activeTab === 'architecture' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Architecture
        </button>
      </nav>

      {/* Zone 3: Primary Actions & Latency Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Latency Metric */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono tabular-nums">
          <Gauge className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden md:inline">420 ms avg latency</span>
          <span className="md:hidden">420 ms</span>
        </div>

        {/* Security indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 text-emerald-700 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>API Key Encrypted</span>
        </div>

        {/* Theme / Background Switcher */}
        {onSelectTheme && (
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              title="Change Background Theme"
              aria-label="Change Background Theme"
              className="min-h-[44px] min-w-[44px] sm:min-w-0 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors active:scale-95"
            >
              <Palette className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline capitalize font-mono text-[11px]">
                {THEME_CONFIGS[currentTheme]?.name.split(' ')[0] || 'Theme'}
              </span>
            </button>

            {isThemeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsThemeMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 p-2 bg-white border border-slate-200 rounded-xl shadow-xl z-40 space-y-1 animate-fadeIn">
                  <div className="px-2.5 py-1.5 border-b border-slate-100 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Background Theme
                  </div>
                  {(Object.keys(THEME_CONFIGS) as AppTheme[]).map((tKey) => {
                    const cfg = THEME_CONFIGS[tKey];
                    const isSelected = currentTheme === tKey;
                    return (
                      <button
                        key={tKey}
                        onClick={() => {
                          onSelectTheme(tKey);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-900 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 shadow-xs"
                            style={{ backgroundColor: cfg.previewColor }}
                          />
                          <div className="truncate">
                            <span className="block truncate font-medium text-xs text-slate-800">{cfg.name}</span>
                            <span className="block text-[10px] text-slate-500 truncate font-normal">
                              {cfg.tagline}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Start / Stop Voice Session CTA */}
        {isLive ? (
          <button
            onClick={onToggleVoice}
            className="min-h-[44px] px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 shadow-sm shadow-rose-900/40 whitespace-nowrap active:scale-95"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>End Call</span>
          </button>
        ) : (
          <button
            onClick={onToggleVoice}
            className="min-h-[44px] px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 shadow-sm shadow-indigo-900/50 whitespace-nowrap active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Start Voice Session</span>
            <span className="xs:hidden">Call</span>
          </button>
        )}
      </div>
    </header>
  );
};
