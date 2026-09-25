import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// --- Type Definitions ---
export interface BusinessAction {
  id: string;
  type: 'booking_created' | 'booking_cancelled' | 'availability_checked' | 'customer_retrieved' | 'human_escalated';
  title: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  referenceId: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  interrupted?: boolean;
}

export interface ToolCall {
  id: string;
  toolName: string;
  timestamp: string;
  status: 'executing' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  durationMs?: number;
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
  summary: string;
  outcome: string;
  messages: ConversationMessage[];
  toolCalls: ToolCall[];
  actions: BusinessAction[];
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'cancelled';
  address: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  membership: string;
  pastServices: string[];
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
    required?: string[];
  };
}

// --- Mock Data ---
export const mockCustomers: Customer[] = [
  {
    id: 'CUST-8012',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 234-5678',
    email: 'sarah.j@example.com',
    address: '742 Evergreen Terrace, Springfield, OR',
    membership: 'VIP Enterprise',
    pastServices: ['Annual HVAC Inspection (2025)', 'Filter Replacement (2026)'],
  },
  {
    id: 'CUST-8013',
    name: 'David Chen',
    phone: '+1 (555) 876-5432',
    email: 'david.chen@techcorp.io',
    address: '104 Silicon Way, Suite 400, Austin, TX',
    membership: 'Premium Plus',
    pastServices: ['Emergency AC Compressor Repair (2025)'],
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'VO-20480',
    customerName: 'Sarah Jenkins',
    customerPhone: '+1 (555) 234-5678',
    service: 'Heat Pump Inspection',
    date: '2026-09-20',
    timeSlot: '10:00 AM',
    status: 'confirmed',
    address: '742 Evergreen Terrace, Springfield, OR',
    createdAt: '2026-09-18T14:20:00Z',
  }
];

export const mockToolSchemas: ToolSchema[] = [
  {
    name: 'search_information',
    description: 'Search company service catalogs, pricing, technician coverage, and warranty terms.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query or operational topic (e.g. "AC maintenance warranty", "emergency rates").',
        },
        category: {
          type: 'string',
          description: 'Category filter',
          enum: ['services', 'pricing', 'coverage', 'warranties'],
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'check_availability',
    description: 'Check available technician appointment time slots for a specified service, date, and preferred time window.',
    parameters: {
      type: 'object',
      properties: {
        service: {
          type: 'string',
          description: 'Type of maintenance or repair service (e.g. "AC Maintenance", "Plumbing", "Electrical").',
        },
        date: {
          type: 'string',
          description: 'Target appointment date (e.g. "Tomorrow", "2026-09-24", "Friday").',
        },
        time_range: {
          type: 'string',
          description: 'Preferred window during the day.',
          enum: ['morning', 'afternoon', 'evening', 'anytime'],
        },
      },
      required: ['service', 'date'],
    },
  },
  {
    name: 'create_booking',
    description: 'Execute and commit a verified booking into the scheduling and dispatch database.',
    parameters: {
      type: 'object',
      properties: {
        service: {
          type: 'string',
          description: 'The service type (e.g. "AC Maintenance").',
        },
        date: {
          type: 'string',
          description: 'Date of appointment (e.g. "Tomorrow", "2026-09-24").',
        },
        timeSlot: {
          type: 'string',
          description: 'Specific confirmed time slot (e.g. "7:00 PM", "6:00 PM").',
        },
        customerName: {
          type: 'string',
          description: 'Full name of the customer.',
        },
        customerPhone: {
          type: 'string',
          description: 'Contact phone number.',
        },
        address: {
          type: 'string',
          description: 'Service site address.',
        },
        notes: {
          type: 'string',
          description: 'Special technician instructions or gate codes.',
        },
      },
      required: ['service', 'date', 'timeSlot'],
    },
  },
  {
    name: 'cancel_booking',
    description: 'Cancel an existing service booking and notify dispatch.',
    parameters: {
      type: 'object',
      properties: {
        bookingId: {
          type: 'string',
          description: 'Booking reference code (e.g. "VO-20480" or "VO-20481").',
        },
        reason: {
          type: 'string',
          description: 'Customer explanation for cancellation.',
        },
      },
      required: ['bookingId'],
    },
  },
  {
    name: 'get_customer',
    description: 'Lookup customer profile, service history, and saved address by phone or name.',
    parameters: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
          description: 'Customer phone number, customer ID, or full name.',
        },
      },
      required: ['identifier'],
    },
  },
  {
    name: 'escalate_to_human',
    description: 'Immediately transfer the live voice session to a senior customer support or technical specialist.',
    parameters: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Summary reason for live escalation.',
        },
        priority: {
          type: 'string',
          description: 'Escalation priority level.',
          enum: ['normal', 'urgent', 'emergency'],
        },
        department: {
          type: 'string',
          description: 'Target destination department.',
          enum: ['field_dispatch', 'billing', 'enterprise_support', 'general'],
        },
      },
      required: ['reason'],
    },
  },
];

export async function executeTool(
  toolName: string,
  input: Record<string, unknown>
): Promise<{ success: boolean; result?: Record<string, unknown>; action?: BusinessAction; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 380));

  switch (toolName) {
    case 'search_information': {
      const query = String(input.query || '').toLowerCase();
      if (query.includes('ac') || query.includes('maintenance')) {
        return {
          success: true,
          result: {
            serviceName: 'Comprehensive AC Tune-Up & Maintenance',
            duration: '90 minutes',
            included: ['Refrigerant pressure check', 'Condenser coil cleaning', 'Electrical wiring inspection', 'Air filter replacement'],
            warranty: '30-day satisfaction guarantee on all service calls',
            standardRate: '$149.00 (Waived under VIP plan)',
          },
        };
      }
      return {
        success: true,
        result: {
          topic: query,
          info: 'All certified technicians are licensed, bonded, and insured. Standard operating hours are 7:00 AM - 9:00 PM daily with 24/7 emergency dispatch.',
        },
      };
    }

    case 'check_availability': {
      const service = String(input.service || 'Service');
      const date = String(input.date || 'Tomorrow');
      const timeRange = String(input.time_range || 'anytime').toLowerCase();

      let availableSlots: string[] = [];
      if (timeRange === 'afternoon') {
        availableSlots = ['1:00 PM', '2:30 PM', '4:00 PM'];
      } else if (timeRange === 'evening') {
        availableSlots = ['6:00 PM', '7:00 PM', '8:00 PM'];
      } else if (timeRange === 'morning') {
        availableSlots = ['8:30 AM', '10:00 AM', '11:15 AM'];
      } else {
        availableSlots = ['10:00 AM', '2:30 PM', '6:00 PM', '7:00 PM'];
      }

      const action: BusinessAction = {
        id: `ACT-${Date.now()}`,
        type: 'availability_checked',
        title: `Checked availability for ${service}`,
        status: 'confirmed',
        referenceId: `SLOTS-${Date.now().toString().slice(-4)}`,
        details: { service, date, timeRange, availableSlotsCount: availableSlots.length, slots: availableSlots },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      return {
        success: true,
        result: {
          service,
          date,
          timeRange,
          slotsFound: availableSlots.length,
          slots: availableSlots,
          message: `${availableSlots.length} available slots found for ${date} (${timeRange}): ${availableSlots.join(', ')}`,
        },
        action,
      };
    }

    case 'create_booking': {
      const bookingId = 'VO-' + Math.floor(10000 + Math.random() * 90000);
      const service = String(input.service || 'AC Maintenance');
      const date = String(input.date || 'Tomorrow');
      const timeSlot = String(input.timeSlot || '7:00 PM');
      const customerName = String(input.customerName || 'Sarah Jenkins');
      const customerPhone = String(input.customerPhone || '+1 (555) 234-5678');
      const address = String(input.address || '742 Evergreen Terrace, Springfield, OR');

      const newBooking: Booking = {
        id: bookingId,
        customerName,
        customerPhone,
        service,
        date,
        timeSlot,
        status: 'confirmed',
        address,
        createdAt: new Date().toISOString(),
      };
      mockBookings.unshift(newBooking);

      const action: BusinessAction = {
        id: `ACT-${Date.now()}`,
        type: 'booking_created',
        title: `Confirmed booking for ${service}`,
        status: 'confirmed',
        referenceId: bookingId,
        details: { bookingId, customerName, service, date, timeSlot, address },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      return {
        success: true,
        result: {
          bookingId,
          status: 'Confirmed',
          service,
          date,
          timeSlot,
          assignedTechnician: 'Marcus Vance (Senior Field Engineer)',
          confirmationSentTo: customerPhone,
          message: `Appointment ${bookingId} confirmed for ${service} on ${date} at ${timeSlot}.`,
        },
        action,
      };
    }

    case 'cancel_booking': {
      const bookingId = String(input.bookingId || 'VO-20480');
      const bookingIndex = mockBookings.findIndex(b => b.id.toLowerCase() === bookingId.toLowerCase());
      if (bookingIndex >= 0) {
        mockBookings[bookingIndex].status = 'cancelled';
      }

      const action: BusinessAction = {
        id: `ACT-${Date.now()}`,
        type: 'booking_cancelled',
        title: `Cancelled booking ${bookingId}`,
        status: 'cancelled',
        referenceId: bookingId,
        details: { bookingId, reason: input.reason || 'Customer request' },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      return {
        success: true,
        result: {
          bookingId,
          status: 'Cancelled',
          refundIssued: true,
          cancellationNotice: `Booking ${bookingId} has been successfully cancelled in dispatch records.`,
        },
        action,
      };
    }

    case 'get_customer': {
      const query = String(input.identifier || '').toLowerCase();
      const customer = mockCustomers.find(
        c => c.name.toLowerCase().includes(query) || c.phone.includes(query) || c.id.toLowerCase().includes(query)
      ) || mockCustomers[0];

      const action: BusinessAction = {
        id: `ACT-${Date.now()}`,
        type: 'customer_retrieved',
        title: `Retrieved customer profile: ${customer.name}`,
        status: 'confirmed',
        referenceId: customer.id,
        details: { customerId: customer.id, name: customer.name, phone: customer.phone, tier: customer.membership },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      return {
        success: true,
        result: {
          customerId: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          membershipTier: customer.membership,
          pastServicesCount: customer.pastServices.length,
        },
        action,
      };
    }

    case 'escalate_to_human': {
      const reason = String(input.reason || 'Customer requested live specialist');
      const priority = String(input.priority || 'normal');
      const department = String(input.department || 'field_dispatch');

      const action: BusinessAction = {
        id: `ACT-${Date.now()}`,
        type: 'human_escalated',
        title: `Transferred to human specialist (${priority})`,
        status: 'pending',
        referenceId: `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
        details: { reason, priority, department, estimatedWaitSec: 15 },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      return {
        success: true,
        result: {
          escalationId: action.referenceId,
          department,
          priority,
          handoffStatus: 'Connecting...',
          queuePosition: 1,
          message: 'Handoff initiated. A representative from dispatch will connect in approximately 15 seconds.',
        },
        action,
      };
    }

    default:
      return {
        success: false,
        error: `Unknown tool name: ${toolName}. Valid tools are: ${mockToolSchemas.map(t => t.name).join(', ')}`,
      };
  }
}

// In-memory persistent session histories
const sessionHistory: ConversationSession[] = [
  {
    id: 'SESS-9081',
    startTime: 'Sep 23, 2026, 09:14 AM',
    duration: '02:34',
    intent: 'Service Booking',
    status: 'Completed',
    messageCount: 8,
    toolCallsCount: 2,
    interruptionsCount: 1,
    avgLatencyMs: 418,
    summary: 'Customer called to schedule annual AC maintenance. Originally requested afternoon, then interrupted to change to evening. System confirmed 7:00 PM slot.',
    outcome: 'Appointment VO-20481 successfully created & verified in dispatch.',
    messages: [
      { id: 'm1', sender: 'user', text: 'I need to schedule AC maintenance tomorrow afternoon.', timestamp: '09:14:02' },
      { id: 'm2', sender: 'agent', text: 'Certainly! Let me check the available afternoon slots for tomorrow.', timestamp: '09:14:04' },
      { id: 'm3', sender: 'user', text: 'Actually, evening would be better.', timestamp: '09:14:06', interrupted: true },
      { id: 'm4', sender: 'agent', text: 'No problem at all. Switching to evening availability... I have 6:00 PM, 7:00 PM, and 8:00 PM available.', timestamp: '09:14:08' },
      { id: 'm5', sender: 'user', text: 'Book the 7 PM slot.', timestamp: '09:14:15' },
      { id: 'm6', sender: 'agent', text: 'Just to confirm, you would like me to book AC maintenance for tomorrow at 7:00 PM for Sarah Jenkins?', timestamp: '09:14:17' },
      { id: 'm7', sender: 'user', text: 'Yes, please.', timestamp: '09:14:22' },
      { id: 'm8', sender: 'agent', text: 'Done! Your appointment is confirmed for tomorrow at 7:00 PM. Your booking reference is VO-20481.', timestamp: '09:14:24' }
    ],
    toolCalls: [
      {
        id: 'tc-1',
        toolName: 'check_availability',
        timestamp: '09:14:07',
        status: 'completed',
        input: { service: 'AC Maintenance', date: 'Tomorrow', time_range: 'evening' },
        output: { slotsFound: 3, slots: ['6:00 PM', '7:00 PM', '8:00 PM'] },
        durationMs: 340
      },
      {
        id: 'tc-2',
        toolName: 'create_booking',
        timestamp: '09:14:23',
        status: 'completed',
        input: { service: 'AC Maintenance', date: 'Tomorrow', timeSlot: '7:00 PM', customerName: 'Sarah Jenkins' },
        output: { bookingId: 'VO-20481', status: 'Confirmed', technician: 'Marcus Vance' },
        durationMs: 410
      }
    ],
    actions: [
      {
        id: 'act-1',
        type: 'availability_checked',
        title: 'Checked availability for AC Maintenance',
        status: 'confirmed',
        referenceId: 'SLOTS-8291',
        details: { slots: ['6:00 PM', '7:00 PM', '8:00 PM'] },
        timestamp: '09:14:07'
      },
      {
        id: 'act-2',
        type: 'booking_created',
        title: 'Confirmed booking for AC Maintenance',
        status: 'confirmed',
        referenceId: 'VO-20481',
        details: { bookingId: 'VO-20481', customerName: 'Sarah Jenkins', timeSlot: '7:00 PM' },
        timestamp: '09:14:23'
      }
    ]
  },
  {
    id: 'SESS-9079',
    startTime: 'Sep 22, 2026, 04:12 PM',
    duration: '01:45',
    intent: 'Customer Support / Lookup',
    status: 'Completed',
    messageCount: 6,
    toolCallsCount: 2,
    interruptionsCount: 0,
    avgLatencyMs: 395,
    summary: 'David Chen checked past warranty status on AC compressor and requested copy of maintenance invoice.',
    outcome: 'Profile retrieved and warranty confirmed active through Dec 2026.',
    messages: [
      { id: 'm10', sender: 'user', text: 'Hi, can you check if my AC compressor repair from last year is still under warranty?', timestamp: '04:12:10' },
      { id: 'm11', sender: 'agent', text: 'I would be glad to check that for you. Let me look up your customer records.', timestamp: '04:12:12' },
      { id: 'm12', sender: 'agent', text: 'I found your account, David Chen. Your compressor repair from July 2025 carries a 2-year warranty valid until July 2027.', timestamp: '04:12:18' }
    ],
    toolCalls: [
      {
        id: 'tc-3',
        toolName: 'get_customer',
        timestamp: '04:12:14',
        status: 'completed',
        input: { identifier: 'David Chen' },
        output: { customerId: 'CUST-8013', name: 'David Chen', tier: 'Premium Plus' },
        durationMs: 380
      }
    ],
    actions: [
      {
        id: 'act-3',
        type: 'customer_retrieved',
        title: 'Retrieved customer profile: David Chen',
        status: 'confirmed',
        referenceId: 'CUST-8013',
        details: { customerId: 'CUST-8013', name: 'David Chen' },
        timestamp: '04:12:14'
      }
    ]
  }
];

// --- API Endpoints ---

// 1. Health check & AssemblyAI Connection status (also provides standard /healthz for Cloud Run / load balancers)
app.get(['/healthz', '/api/health', '/api/voice/health'], (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.ASSEMBLYAI_API_KEY && process.env.ASSEMBLYAI_API_KEY.length > 5);
  res.json({
    status: 'healthy',
    assemblyAiConfigured: hasKey,
    realtimeEndpoint: 'wss://agents.assemblyai.com/v1/ws',
    asrModel: 'Universal-3.5 Pro ASR',
    features: [
      'neural_turn_detection',
      'barge_in_interruption',
      'json_schema_tool_calling',
      'low_latency_pcm16_streaming'
    ],
    timestamp: new Date().toISOString()
  });
});

// 2. Initialize Voice Session & retrieve tool manifest
app.post('/api/voice/session', (_req: Request, res: Response) => {
  const sessionId = `VO-SESS-${Date.now().toString().slice(-6)}`;
  const hasAssemblyAiKey = Boolean(process.env.ASSEMBLYAI_API_KEY);
  
  res.json({
    sessionId,
    wsEndpoint: hasAssemblyAiKey 
      ? 'wss://agents.assemblyai.com/v1/ws' 
      : null,
    mode: hasAssemblyAiKey ? 'assemblyai_live' : 'interactive_voice_engine',
    tools: mockToolSchemas,
    agentConfig: {
      name: 'VoiceOps AI',
      role: 'Enterprise Operations Voice Agent',
      voice: 'en-US-Neural2-F',
      interruptionEnabled: true,
      vadSensitivity: 0.75,
      systemPrompt: 'You are VoiceOps AI, an intelligent enterprise voice operations agent for field service and booking operations. You take natural voice commands, call structured business tools, execute verified actions, and confirm verbally.'
    }
  });
});

// 3. Return Tool Schemas
app.get('/api/voice/tools', (_req: Request, res: Response) => {
  res.json({
    tools: mockToolSchemas
  });
});

// 4. Tool Execution Endpoint
app.post('/api/voice/tools/:toolName', async (req: Request, res: Response) => {
  const { toolName } = req.params;
  const input = req.body || {};

  try {
    const result = await executeTool(toolName, input);
    if (!result.success) {
      res.status(400).json({ error: result.error || 'Failed to execute tool' });
      return;
    }
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown tool error';
    res.status(500).json({ error: 'Tool execution failure', details: message });
  }
});

// 5. Actions list
app.get('/api/voice/actions', (_req: Request, res: Response) => {
  const actions: BusinessAction[] = [];
  mockBookings.forEach(b => {
    actions.push({
      id: `ACT-BOOK-${b.id}`,
      type: b.status === 'cancelled' ? 'booking_cancelled' : 'booking_created',
      title: `${b.status === 'cancelled' ? 'Cancelled' : 'Confirmed'} ${b.service}`,
      status: b.status === 'cancelled' ? 'cancelled' : 'confirmed',
      referenceId: b.id,
      details: { ...b },
      timestamp: b.createdAt ? new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'
    });
  });

  res.json({
    bookings: mockBookings,
    customers: mockCustomers,
    actions
  });
});

// 6. Conversation History
app.get('/api/voice/history', (_req: Request, res: Response) => {
  res.json({
    sessions: sessionHistory,
    metrics: {
      totalConversations: sessionHistory.length + 1246,
      successfulActions: 1197,
      toolCalls: 3842,
      averageLatencyMs: 420,
      interruptionRecoveryMs: 180,
      successRatePct: 98.7
    }
  });
});

app.post('/api/voice/history', (req: Request, res: Response) => {
  const newSession: ConversationSession = req.body;
  if (newSession && newSession.id) {
    sessionHistory.unshift(newSession);
  }
  res.json({ success: true, count: sessionHistory.length });
});

// --- Server & Vite integration ---
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.K_SERVICE) || (hasDist && process.env.NODE_ENV !== 'development');

  if (isProd && hasDist) {
    console.log(`Serving static production build from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('Mounting Vite dev middleware');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VoiceOps AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting VoiceOps AI server:', err);
  process.exit(1);
});
