/**
 * VoiceOps AI - Data Types & JSON Schema Definitions
 * Supporting AssemblyAI Voice Agent real-time integration
 */

export type AgentState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'interrupted' | 'error';

export type PipelineStage = 
  | 'idle'
  | 'user_speech'
  | 'intent_detection'
  | 'tool_routing'
  | 'business_system'
  | 'result_verification'
  | 'voice_response';

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  durationMs?: number;
  interrupted?: boolean;
  intent?: string;
  toolCallId?: string;
}

export interface ToolCall {
  id: string;
  toolName: string;
  timestamp: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  durationMs?: number;
  error?: string;
}

export interface BusinessAction {
  id: string;
  type: 'booking_created' | 'availability_checked' | 'customer_retrieved' | 'booking_cancelled' | 'human_escalated';
  title: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'failed';
  referenceId: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  address?: string;
  createdAt: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  membership: 'Standard' | 'Premium Plus' | 'VIP Enterprise';
  pastServices: string[];
}

export interface ConversationSession {
  id: string;
  startTime: string;
  duration: string;
  intent: string;
  status: 'Completed' | 'In Progress' | 'Escalated' | 'Failed';
  messageCount: number;
  toolCallsCount: number;
  interruptionsCount: number;
  avgLatencyMs: number;
  messages: ConversationMessage[];
  toolCalls: ToolCall[];
  actions: BusinessAction[];
  summary: string;
  outcome: string;
}

export interface LatencyMetrics {
  speechToTextMs: number;
  llmReasoningMs: number;
  toolExecutionMs: number;
  textToSpeechMs: number;
  totalRoundtripMs: number;
}

export interface ToolSchema {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
}
