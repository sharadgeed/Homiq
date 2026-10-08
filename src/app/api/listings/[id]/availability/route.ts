import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { reconfirmAvailability } from '@/lib/db/queries';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireAuth();

    const ok = reconfirmAvailability(id, user.id);
    if (!ok) {
      return errorResponse('Failed to reconfirm: Not authorized or listing not found', 403);
    }

    logAuditEvent(user.id, 'RECONFIRM_AVAILABILITY', 'listing', id);
    return jsonResponse({ success: true, timestamp: new Date().toISOString() });
  } catch (err: any) {
    return errorResponse(err.message || 'Error reconfirming availability', 500);
  }
}
