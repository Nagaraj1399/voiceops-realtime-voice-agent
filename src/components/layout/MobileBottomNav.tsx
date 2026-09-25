import React from 'react';
import {
  LayoutDashboard,
  Mic,
  MessageSquareText,
  CheckSquare,
  Menu,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { AgentState } from '../../types/voice';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMenu: () => void;
  agentState: AgentState;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMenu,
  agentState,
}) => {
  const isCallActive = agentState !== 'idle' && agentState !== 'error';

  const navButtons: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    isLiveAgent?: boolean;
  }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live Voice', icon: Mic, isLiveAgent: true },
    { id: 'conversations', label: 'History', icon: MessageSquareText },
    { id: 'actions', label: 'Actions', icon: CheckSquare },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/90 px-2 py-1.5 flex items-center justify-around shadow-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      {navButtons.map((btn) => {
        const Icon = btn.icon;
        const isActive = activeTab === btn.id;

        return (
          <button
            key={btn.id}
            onClick={() => onSelectTab(btn.id)}
            className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 px-2 transition-all select-none relative ${
              isActive
                ? 'text-indigo-400 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {/* Live Indicator on Voice button */}
            {btn.isLiveAgent && isCallActive && (
              <span className="absolute top-1 right-1/4 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}

            <div
              className={`p-1 rounded-md transition-colors ${
                isActive
                  ? 'bg-indigo-950/60 text-indigo-300'
                  : 'text-neutral-400'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>

            <span className="text-[10px] tracking-tight leading-none">
              {btn.label}
            </span>

            {/* Active underline bar */}
            {isActive && (
              <span className="w-4 h-0.5 bg-indigo-500 rounded-full mt-0.5" />
            )}
          </button>
        );
      })}

      {/* Menu / Drawer Toggle */}
      <button
        onClick={onOpenMenu}
        aria-label="Open all navigation tabs"
        className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 px-2 transition-all select-none text-neutral-400 hover:text-neutral-200 ${
          ['analytics', 'architecture', 'settings'].includes(activeTab)
            ? 'text-indigo-400 font-semibold'
            : ''
        }`}
      >
        <div
          className={`p-1 rounded-md transition-colors ${
            ['analytics', 'architecture', 'settings'].includes(activeTab)
              ? 'bg-indigo-950/60 text-indigo-300'
              : 'text-neutral-400'
          }`}
        >
          <Menu className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight leading-none">More</span>
      </button>
    </nav>
  );
};
