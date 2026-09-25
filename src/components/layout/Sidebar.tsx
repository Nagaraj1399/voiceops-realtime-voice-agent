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
    <aside className="hidden md:flex w-64 bg-neutral-950 border-r border-neutral-800/80 flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-950/50">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-neutral-100 text-base tracking-tight flex items-center gap-1.5">
                <span>VoiceOps AI</span>
              </div>
              <span className="text-[11px] text-neutral-400 block font-normal leading-none mt-0.5">
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
                    ? 'bg-neutral-900 text-white font-semibold shadow-sm border border-neutral-800'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Integration Status */}
      <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/40">
        <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase">
              Technology Stack
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-200">AssemblyAI</span>
            <span className="text-[11px] font-mono text-emerald-400">Connected</span>
          </div>

          <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>Universal-3.5 Pro</span>
            <a
              href="https://www.assemblyai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-300 flex items-center gap-1"
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
