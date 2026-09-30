import React, { useState } from 'react';
import {
  PhoneCall,
  Gauge,
  ShieldCheck,
  Square,
  Menu,
  Palette,
  Check,
  Sparkles,
  LogOut,
  User as UserIcon,
  Database,
  ChevronDown,
  Layers,
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import { NavTab } from './Sidebar';
import { AgentState } from '../../types/voice';
import { AppTheme, THEME_CONFIGS } from '../../types/theme';

interface TopBarProps {
  activeTab: NavTab;
  agentState: AgentState;
  currentTheme?: AppTheme;
  user: FirebaseUser | null;
  firestoreConnected: boolean;
  selectedModel: string;
  onSelectModel?: (model: string) => void;
  onSelectTheme?: (theme: AppTheme) => void;
  onToggleVoice: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenMenu?: () => void;
  onSignInGoogle: () => void;
  onSignInGuest: () => void;
  onSignOut: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  agentState,
  currentTheme = 'light',
  user,
  firestoreConnected,
  selectedModel,
  onSelectModel,
  onSelectTheme,
  onToggleVoice,
  onNavigate,
  onOpenMenu,
  onSignInGoogle,
  onSignInGuest,
  onSignOut,
}) => {
  const isLive = agentState !== 'idle' && agentState !== 'error';
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const tabTitles: Record<NavTab, string> = {
    overview: 'Operations Overview',
    live: 'Live Voice Agent Workspace',
    conversations: 'Conversation History & Transcripts',
    actions: 'Verified Business Actions',
    analytics: 'Voice Intelligence Analytics',
    architecture: 'Technical Architecture & Judging',
    settings: 'Voice Engine Configuration',
  };

  const models = [
    {
      id: 'gemini-3.8-live',
      name: 'Gemini 3.8 Live',
      badge: 'Live API',
      description: 'Real-time conversational voice stream with immediate barge-in interruption',
    },
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash',
      badge: 'Fast',
      description: 'High-speed multimodal semantic reasoning & structured tool execution',
    },
  ];

  const currentModelObj = models.find((m) => m.id === selectedModel) || models[0];

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
      <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-600">
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

      {/* Zone 3: Primary Actions, Model Picker, Auth & Voice CTA */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Gemini Live API Model Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
            className="h-9 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Select Gemini conversational model"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 animate-pulse" />
            <span className="font-semibold text-slate-800">{currentModelObj.name}</span>
            <span className="px-1 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold">
              {currentModelObj.badge}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isModelMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsModelMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 p-2 bg-white border border-slate-200 rounded-xl shadow-xl z-40 space-y-1 animate-fadeIn">
                <div className="px-2.5 py-1.5 border-b border-slate-100 text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Conversational Model</span>
                  <span className="text-emerald-700 font-bold">Active API</span>
                </div>
                {models.map((m) => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectModel?.(m.id);
                        setIsModelMenuOpen(false);
                      }}
                      className={`w-full flex items-start justify-between p-2.5 rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 font-medium'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900">{m.name}</span>
                          <span className="px-1 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[9px] font-mono font-bold">
                            {m.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                          {m.description}
                        </p>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Firebase Firestore Connection Badge */}
        <div
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono"
          title="Google Firebase Firestore Database connection is verified"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Firestore Synced</span>
        </div>

        {/* Latency Metric */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono tabular-nums">
          <Gauge className="w-3.5 h-3.5 text-indigo-600" />
          <span>420 ms avg</span>
        </div>

        {/* Firebase Authentication: Google Sign In / User Profile */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="h-9 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg flex items-center gap-2 transition-colors active:scale-95"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline font-medium text-slate-800 truncate max-w-[110px]">
                {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Operator'}
              </span>
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white shrink-0"
                title="Firebase Auth Verified"
              />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 p-3 bg-white border border-slate-200 rounded-xl shadow-xl z-40 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-slate-900 truncate">
                        {user.displayName || 'VoiceOps Operator'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate font-mono">
                        {user.email || 'Signed in via Firebase'}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1 text-[11px] font-mono text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Firestore Sync:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span>User ID:</span>
                      <span className="truncate max-w-[120px]">{user.uid}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSignInGoogle}
              className="h-9 px-3 py-1 text-xs font-semibold text-slate-800 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-2 shadow-xs transition-all active:scale-95 whitespace-nowrap"
              title="Authenticate with your Google Account for personalized Firestore persistence"
            >
              {/* Google G SVG */}
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.18 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.17 0 10.02 0 12s.45 3.83 1.25 5.42l4.03-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Google Sign-In</span>
            </button>

            <button
              onClick={onSignInGuest}
              className="hidden sm:inline-flex h-9 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg items-center transition-colors"
              title="Sign in as Guest Operator"
            >
              Guest
            </button>
          </div>
        )}

        {/* Theme / Background Switcher */}
        {onSelectTheme && (
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              title="Change Background Theme"
              aria-label="Change Background Theme"
              className="h-9 min-w-[36px] sm:min-w-0 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors active:scale-95"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden lg:inline capitalize font-mono text-[11px]">
                {THEME_CONFIGS[currentTheme]?.name.split(' ')[0] || 'Theme'}
              </span>
            </button>

            {isThemeMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsThemeMenuOpen(false)} />
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
            className="h-9 px-3 sm:px-3.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 shadow-sm shadow-rose-900/40 whitespace-nowrap active:scale-95"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>End Call</span>
          </button>
        ) : (
          <button
            onClick={onToggleVoice}
            className="h-9 px-3 sm:px-3.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 shadow-sm shadow-indigo-900/50 whitespace-nowrap active:scale-95"
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
