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
  Sparkles,
  Database,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
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
  user: FirebaseUser | null;
  firestoreConnected: boolean;
  selectedModel: string;
  onSelectModel?: (model: string) => void;
  onSelectTheme?: (theme: AppTheme) => void;
  onSignInGoogle: () => void;
  onSignInGuest: () => void;
  onSignOut: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  agentState,
  currentTheme = 'light',
  user,
  firestoreConnected,
  selectedModel,
  onSelectModel,
  onSelectTheme,
  onSignInGoogle,
  onSignInGuest,
  onSignOut,
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
      <div className="relative w-4/5 max-w-xs bg-white border-r border-slate-200 flex flex-col justify-between h-full z-10 shadow-2xl animate-slideIn overflow-y-auto">
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

          {/* User Auth Section */}
          <div className="p-3 bg-slate-50 border-b border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-slate-900 truncate">
                      {user.displayName || 'VoiceOps Operator'}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-mono">
                      {user.email || 'Authenticated'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                  <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Firestore Synced
                  </span>
                  <button
                    onClick={() => {
                      onSignOut();
                      onClose();
                    }}
                    className="text-rose-600 hover:text-rose-800 font-sans font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onSignInGoogle();
                    onClose();
                  }}
                  className="w-full min-h-[42px] px-3 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
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
                  onClick={() => {
                    onSignInGuest();
                    onClose();
                  }}
                  className="w-full text-center text-[11px] text-slate-500 hover:text-slate-800 font-medium py-1"
                >
                  Continue as Guest Operator
                </button>
              </div>
            )}
          </div>

          {/* Model Selection on Mobile */}
          <div className="px-4 py-2.5 bg-indigo-50/50 border-b border-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-900 font-semibold mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conversational Model</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'gemini-3.8-live', label: 'Gemini 3.8 Live', badge: 'Live API' },
                { id: 'gemini-3.8-flash', label: 'Gemini Flash', badge: 'Fast' },
              ].map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectModel?.(m.id)}
                    className={`p-2 rounded-lg text-left text-xs border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs border-indigo-700'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="truncate font-medium">{m.label}</div>
                    <span className={`text-[9px] font-mono ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {m.badge}
                    </span>
                  </button>
                );
              })}
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
                Firebase Firestore
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">Cloud Database</span>
              <span className="font-mono text-emerald-600 text-[11px] font-medium">Synced</span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Gemini 3.8 Live API</span>
              <span className="text-indigo-600 font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
