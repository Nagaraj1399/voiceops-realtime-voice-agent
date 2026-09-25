/**
 * VoiceOps AI - Real-time Voice Operations Platform
 * From conversation to action.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { OverviewPage } from './components/pages/OverviewPage';
import { LiveAgentPage } from './components/pages/LiveAgentPage';
import { ConversationsPage } from './components/pages/ConversationsPage';
import { ActionsPage } from './components/pages/ActionsPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { ArchitecturePage } from './components/pages/ArchitecturePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { voiceEngine } from './services/voiceAgentEngine';
import {
  AgentState,
  PipelineStage,
  ConversationMessage,
  ToolCall,
  BusinessAction,
  ConversationSession,
  Booking,
  Customer,
} from './types/voice';
import { mockBookings, mockCustomers } from './services/toolRegistry';
import { AppTheme, THEME_CONFIGS } from './types/theme';

export default function App() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('voiceops_theme') as AppTheme;
      if (saved && THEME_CONFIGS[saved]) return saved;
    } catch (e) {
      // Fallback
    }
    return 'light';
  });

  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [actions, setActions] = useState<BusinessAction[]>([]);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(16).fill(0.04));
  const [currentIntent, setCurrentIntent] = useState<string>('');
  const [collectedEntities, setCollectedEntities] = useState<Record<string, string>>({});
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Persisted data from backend / local state
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  // Subscribe to voice agent engine events
  useEffect(() => {
    const unsubscribe = voiceEngine.subscribe({
      onStateChange: (state) => setAgentState(state),
      onPipelineStageChange: (stage) => setPipelineStage(stage),
      onMessage: () => {
        setMessages([...voiceEngine.getMessages()]);
        setCurrentIntent(voiceEngine.getCurrentIntent());
        setCollectedEntities(voiceEngine.getCollectedEntities());
      },
      onToolCall: () => {
        setToolCalls([...voiceEngine.getToolCalls()]);
      },
      onAction: (action) => {
        setActions([...voiceEngine.getActions()]);
        // If it's a booking, also update bookings list
        if (action.type === 'booking_created' && action.details) {
          const newBooking: Booking = {
            id: action.referenceId,
            customerName: String(action.details.customerName || 'Sarah Jenkins'),
            customerPhone: String(action.details.customerPhone || '+1 (555) 234-5678'),
            service: String(action.details.service || 'AC Maintenance'),
            date: String(action.details.date || 'Tomorrow'),
            timeSlot: String(action.details.timeSlot || '7:00 PM'),
            status: 'confirmed',
            address: String(action.details.address || '742 Evergreen Terrace, Springfield, OR'),
            createdAt: new Date().toISOString(),
          };
          setBookings((prev) => [newBooking, ...prev.filter(b => b.id !== newBooking.id)]);
        }
      },
      onInterruption: () => {
        console.log('VoiceOps App received Barge-in Interruption notification');
      },
      onAudioLevels: (levels) => {
        setAudioLevels(levels);
      },
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch initial history and actions from backend
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/voice/history');
        if (res.ok) {
          const data = await res.json();
          if (data.sessions) {
            setSessions(data.sessions);
          }
        }
        const actionRes = await fetch('/api/voice/actions');
        if (actionRes.ok) {
          const actionData = await actionRes.json();
          if (actionData.bookings) setBookings(actionData.bookings);
          if (actionData.customers) setCustomers(actionData.customers);
          if (actionData.actions) setActions(actionData.actions);
        }
      } catch (e) {
        console.warn('Backend fetch fallback to internal memory:', e);
      }
    }
    loadData();
  }, []);

  // Voice Session Controls
  const handleToggleVoice = useCallback(() => {
    if (agentState === 'idle' || agentState === 'error') {
      setActiveTab('live');
      voiceEngine.startSession();
    } else {
      voiceEngine.stopSession();
    }
  }, [agentState]);

  const handleInterrupt = useCallback(() => {
    voiceEngine.handleUserInterruption();
  }, []);

  const handleSendTextMessage = useCallback((text: string) => {
    voiceEngine.handleUserUtterance(text);
  }, []);

  const handleRunDemoScript = useCallback(() => {
    setActiveTab('live');
    voiceEngine.runDemoScript();
  }, []);

  const handleResetSession = useCallback(() => {
    voiceEngine.resetSession();
    setMessages([]);
    setToolCalls([]);
    setActions([]);
    setCurrentIntent('');
    setCollectedEntities({});
  }, []);

  // Synchronize theme with HTML document element, background styles, and meta theme-color
  useEffect(() => {
    try {
      localStorage.setItem('voiceops_theme', theme);
    } catch (e) {
      // Ignored
    }

    const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.light;
    
    // Update HTML & body background styles
    document.documentElement.style.backgroundColor = themeConfig.bgColor;
    document.body.style.backgroundColor = themeConfig.bgColor;
    
    // Toggle dark class
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }

    // Update meta theme-color tag for mobile viewport status bar
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', themeConfig.bgColor);
  }, [theme]);

  const activeThemeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.light;

  return (
    <div
      className={`flex h-[100dvh] w-full overflow-hidden text-slate-900 antialiased font-sans relative transition-colors duration-200 bg-white`}
      style={{
        backgroundColor: activeThemeConfig.bgColor,
      }}
    >
      {/* Dynamic Ambient Background Lighting Layer */}
      {activeThemeConfig.ambientGradient !== 'none' && (
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-60"
          style={{
            background: activeThemeConfig.ambientGradient,
          }}
        />
      )}

      {/* Desktop Sidebar Navigation (Hidden on mobile) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCallActive={agentState !== 'idle' && agentState !== 'error'}
      />

      {/* Mobile Slide-Over Drawer Navigation */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        agentState={agentState}
        currentTheme={theme}
        onSelectTheme={setTheme}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Top Navigation Bar with Mobile Hamburger & Theme Switcher */}
        <TopBar
          activeTab={activeTab}
          agentState={agentState}
          currentTheme={theme}
          onSelectTheme={setTheme}
          onToggleVoice={handleToggleVoice}
          onNavigate={setActiveTab}
          onOpenMenu={() => setIsMobileDrawerOpen(true)}
        />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 md:pb-6 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewPage
              onStartVoiceSession={handleToggleVoice}
              onLaunchDemo={handleRunDemoScript}
              audioLevels={audioLevels}
            />
          )}

          {activeTab === 'live' && (
            <LiveAgentPage
              agentState={agentState}
              pipelineStage={pipelineStage}
              messages={messages}
              toolCalls={toolCalls}
              actions={actions}
              audioLevels={audioLevels}
              currentIntent={currentIntent}
              collectedEntities={collectedEntities}
              onToggleSession={handleToggleVoice}
              onInterrupt={handleInterrupt}
              onSendTextMessage={handleSendTextMessage}
              onRunDemoScript={handleRunDemoScript}
              onResetSession={handleResetSession}
            />
          )}

          {activeTab === 'conversations' && (
            <ConversationsPage sessions={sessions} />
          )}

          {activeTab === 'actions' && (
            <ActionsPage
              bookings={bookings}
              customers={customers}
              actions={actions}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage />
          )}

          {activeTab === 'architecture' && (
            <ArchitecturePage />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              currentTheme={theme}
              onSelectTheme={setTheme}
            />
          )}
        </main>

        {/* Mobile Dynamic Bottom Navigation Bar (Hidden on desktop) */}
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenMenu={() => setIsMobileDrawerOpen(true)}
          agentState={agentState}
        />
      </div>
    </div>
  );
}
