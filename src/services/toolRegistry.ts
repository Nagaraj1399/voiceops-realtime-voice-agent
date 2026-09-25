import { ToolSchema, Booking, Customer, BusinessAction } from '../types/voice';

// In-memory mock databases for business operations
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

// Tool execution engine with strict validation & state mutation
export async function executeTool(
  toolName: string,
  input: Record<string, unknown>
): Promise<{ success: boolean; result?: Record<string, unknown>; action?: BusinessAction; error?: string }> {
  // Simulate standard business API latency
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
