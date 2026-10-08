import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { listingId, reason, details } = await req.json();

    if (!listingId || !reason || !details) {
      return errorResponse('listingId, reason, and details are required', 400);
    }

    const validReasons = ['misleading_price', 'unavailable_rented', 'scam_fake', 'discriminatory', 'hygiene_safety', 'other'];
    if (!validReasons.includes(reason)) {
      return errorResponse(`Invalid reason. Choose one of: ${validReasons.join(', ')}`, 400);
    }

    const db = getDb();
    const id = 'rep_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO reports (id, reporterId, listingId, reason, details, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
    `).run(id, user.id, listingId, reason, details.trim(), now, now);

    logAuditEvent(user.id, 'SUBMIT_REPORT', 'report', id, { listingId, reason });

    return jsonResponse({ success: true, message: 'Report submitted for moderation triage', id }, 201);
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to submit report', 500);
  }
}
