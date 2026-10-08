import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getViewingsForUser, getListingById } from '@/lib/db/queries';
import { getDb } from '@/lib/db';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuth();
    const viewings = getViewingsForUser(user.id, user.role);
    return jsonResponse({ viewings });
  } catch (err: any) {
    return errorResponse(err.message || 'Unauthorized', 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const {
      listingId,
      enquiryId,
      scheduledAt,
      viewingType = 'in_person',
      notes,
    } = body;

    if (!listingId || !scheduledAt) {
      return errorResponse('listingId and scheduledAt timestamp are required', 400);
    }

    const listing = getListingById(listingId);
    if (!listing) {
      return errorResponse('Listing not found', 404);
    }

    const db = getDb();
    const viewingId = 'viw_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();

    // Auto-generate video tour link if video_tour selected
    const videoMeetingUrl = viewingType === 'video_tour'
      ? `https://meet.google.com/hmq-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`
      : null;

    db.prepare(`
      INSERT INTO viewings (id, enquiryId, listingId, renterId, hostId, scheduledAt, viewingType, videoMeetingUrl, notes, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      viewingId,
      enquiryId || null,
      listingId,
      user.id,
      listing.ownerId,
      scheduledAt,
      viewingType,
      videoMeetingUrl,
      notes || null,
      'requested',
      now,
      now
    );

    // Update enquiry status if linked
    if (enquiryId) {
      db.prepare('UPDATE enquiries SET status = ?, updatedAt = ? WHERE id = ?').run('viewing_scheduled', now, enquiryId);
    }

    logAuditEvent(user.id, 'REQUEST_VIEWING', 'viewing', viewingId, { listingId, viewingType, scheduledAt });

    return jsonResponse({ success: true, viewingId, videoMeetingUrl }, 201);
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to request viewing', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { viewingId, status, notes, scheduledAt } = await req.json();

    if (!viewingId || !status) {
      return errorResponse('viewingId and status are required', 400);
    }

    const validStatuses = ['requested', 'confirmed', 'rescheduled', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return errorResponse(`Invalid status. Allowed: ${validStatuses.join(', ')}`, 400);
    }

    const db = getDb();
    const viewing = db.prepare('SELECT * FROM viewings WHERE id = ?').get(viewingId) as any;
    if (!viewing) {
      return errorResponse('Viewing not found', 404);
    }

    // Only host, renter or admin can change viewing status
    if (viewing.hostId !== user.id && viewing.renterId !== user.id && user.role !== 'admin') {
      return errorResponse('Forbidden: Not authorized to update this viewing', 403);
    }

    const now = new Date().toISOString();
    const updateTime = scheduledAt || viewing.scheduledAt;
    const updateNotes = notes !== undefined ? notes : viewing.notes;

    db.prepare(`
      UPDATE viewings SET status = ?, scheduledAt = ?, notes = ?, updatedAt = ?
      WHERE id = ?
    `).run(status, updateTime, updateNotes, now, viewingId);

    logAuditEvent(user.id, 'UPDATE_VIEWING_STATUS', 'viewing', viewingId, { status });

    return jsonResponse({ success: true, status });
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to update viewing', 500);
  }
}
