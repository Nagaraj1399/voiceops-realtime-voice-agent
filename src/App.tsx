/**
 * VoiceOps AI - Real-time Voice Operations Platform
 * From conversation to action.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
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
  auth,
  signInWithGoogle,
  signInAsGuest,
  signOutUser,
  testConnection,
  saveConversationToFirestore,
  subscribeToConversations,
  saveBookingToFirestore,
  subscribeToBookings,
  saveActionToFirestore,
  subscribeToActions,
} from './services/firebase';
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

  // Gemini Conversational Model: default to gemini-3.8-live (Live API)
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-live');

  // Firebase Authentication & Firestore Connection
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(false);

  // Keep a reference to current user for callbacks
  const userRef = useRef<FirebaseUser | null>(null);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Persisted data from Firestore / backend
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  // Synchronize model with voiceEngine
  useEffect(() => {
    voiceEngine.setModel(selectedModel);
  }, [selectedModel]);

  // Test Firestore Connection and listen to Firebase Auth State
  useEffect(() => {
    testConnection().then((connected) => {
      setFirestoreConnected(connected);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // When Firebase user changes, subscribe to their Firestore collections
  useEffect(() => {
    if (!user) return;

    // 1. Subscribe to user conversations
    const unsubConv = subscribeToConversations(user.uid, (data) => {
      if (data && data.length > 0) {
        setSessions(data);
      }
    });

    // 2. Subscribe to user bookings
    const unsubBookings = subscribeToBookings(user.uid, (data) => {
      if (data && data.length > 0) {
        setBookings(data);
      } else {
        // Seed initial mock bookings into user's personal Firestore subcollection
        mockBookings.slice(0, 3).forEach((b) => {
          saveBookingToFirestore(user.uid, b);
        });
      }
    });

    // 3. Subscribe to user actions
    const unsubActions = subscribeToActions(user.uid, (data) => {
      if (data && data.length > 0) {
        setActions(data);
      }
    });

    return () => {
      unsubConv();
      unsubBookings();
      unsubActions();
    };
  }, [user]);

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

        // If user is authenticated, persist action to Firestore
        if (userRef.current) {
          saveActionToFirestore(userRef.current.uid, action);
        }

        // If it's a booking, also update bookings list & persist
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
          setBookings((prev) => [newBooking, ...prev.filter((b) => b.id !== newBooking.id)]);

          if (userRef.current) {
            saveBookingToFirestore(userRef.current.uid, newBooking);
          }
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

  // Fetch initial history and actions from backend if no firestore user
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/voice/history');
        if (res.ok) {
          const data = await res.json();
          if (data.sessions && !userRef.current) {
            setSessions(data.sessions);
          }
        }
        const actionRes = await fetch('/api/voice/actions');
        if (actionRes.ok) {
          const actionData = await actionRes.json();
          if (actionData.bookings && !userRef.current) setBookings(actionData.bookings);
          if (actionData.customers) setCustomers(actionData.customers);
          if (actionData.actions && !userRef.current) setActions(actionData.actions);
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

      // Persist conversation session to Firestore if user is authenticated and messages exist
      const msgs = voiceEngine.getMessages();
      const currentToolCalls = voiceEngine.getToolCalls();
      const currentActions = voiceEngine.getActions();

      if (userRef.current && msgs.length > 0) {
        const session: ConversationSession = {
          id: `VO-SESS-${Date.now().toString().slice(-6)}`,
          startTime: 'Just now',
          duration: '1m 15s',
          intent: voiceEngine.getCurrentIntent() || 'Operational Booking Request',
          status: 'Completed',
          messageCount: msgs.length,
          toolCallsCount: currentToolCalls.length,
          interruptionsCount: 1,
          avgLatencyMs: 420,
          summary: `Duplex voice call using ${selectedModel} with verified business actions.`,
          outcome: currentActions.length > 0 ? currentActions[0].title : 'Inquiry Completed',
          messages: msgs,
          toolCalls: currentToolCalls,
          actions: currentActions,
        };
        saveConversationToFirestore(userRef.current.uid, session);
      }
    }
  }, [agentState, selectedModel]);

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

  // Auth actions
  const handleSignInGoogle = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const handleSignInGuest = useCallback(async () => {
    await signInAsGuest();
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOutUser();
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
        user={user}
        firestoreConnected={firestoreConnected}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onSelectTheme={setTheme}
        onSignInGoogle={handleSignInGoogle}
        onSignInGuest={handleSignInGuest}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Top Navigation Bar with Google Sign In, Model Picker & Theme Switcher */}
        <TopBar
          activeTab={activeTab}
          agentState={agentState}
          currentTheme={theme}
          user={user}
          firestoreConnected={firestoreConnected}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onSelectTheme={setTheme}
          onToggleVoice={handleToggleVoice}
          onNavigate={setActiveTab}
          onOpenMenu={() => setIsMobileDrawerOpen(true)}
          onSignInGoogle={handleSignInGoogle}
          onSignInGuest={handleSignInGuest}
          onSignOut={handleSignOut}
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
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              user={user}
              firestoreConnected={firestoreConnected}
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
