import React from 'react';
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
} from 'lucide-react';

export type NavTab = 'overview' | 'live' | 'conversations' | 'actions' | 'analytics' | 'architecture' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCallActive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCallActive = false,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live Agent', icon: Mic, badge: isCallActive ? 'LIVE' : undefined },
    { id: 'conversations', label: 'Conversations', icon: MessageSquareText },
    { id: 'actions', label: 'Actions', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'architecture', label: 'Architecture', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
                <span>VoiceOps AI</span>
              </div>
              <span className="text-[11px] text-slate-500 block font-normal leading-none mt-0.5">
                From conversation to action
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
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
      </div>

      {/* Bottom Integration Status */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70">
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase">
              Technology Stack
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">AssemblyAI</span>
            <span className="text-[11px] font-mono text-emerald-600 font-medium">Connected</span>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Universal-3.5 Pro</span>
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
    </aside>
  );
};
