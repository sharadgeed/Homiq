import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getEnquiriesForUser, getListingById } from '@/lib/db/queries';
import { getDb } from '@/lib/db';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuth();
    const enquiries = getEnquiriesForUser(user.id, user.role);
    return jsonResponse({ enquiries });
  } catch (err: any) {
    return errorResponse(err.message || 'Unauthorized', 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { listingId, targetMoveInDate, durationMonths = 11, message } = body;

    if (!listingId || !targetMoveInDate || !message) {
      return errorResponse('listingId, targetMoveInDate, and message are required', 400);
    }

    const listing = getListingById(listingId);
    if (!listing) {
      return errorResponse('Listing not found', 404);
    }

    // Host cannot enquire on own listing
    if (listing.ownerId === user.id) {
      return errorResponse('You cannot send an enquiry on your own listing', 400);
    }

    const db = getDb();
    const enquiryId = 'enq_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO enquiries (id, listingId, renterId, hostId, targetMoveInDate, durationMonths, message, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      enquiryId,
      listingId,
      user.id,
      listing.ownerId,
      targetMoveInDate,
      Number(durationMonths),
      message.trim(),
      'pending',
      now,
      now
    );

    // Initial message
    db.prepare(`
      INSERT INTO enquiry_messages (id, enquiryId, senderId, message, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'msg_' + Math.random().toString(36).substring(2, 11),
      enquiryId,
      user.id,
      message.trim(),
      now
    );

    // Increment listing enquiry count
    db.prepare('UPDATE listings SET enquiryCount = enquiryCount + 1 WHERE id = ?').run(listingId);

    logAuditEvent(user.id, 'CREATE_ENQUIRY', 'enquiry', enquiryId, { listingId, hostId: listing.ownerId });

    return jsonResponse({ success: true, enquiryId }, 201);
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to create enquiry', 500);
  }
}
