import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: enquiryId } = await params;
    const user = await requireAuth();
    const { message } = await req.json();

    if (!message || !message.trim()) {
      return errorResponse('Message content is required', 400);
    }

    const db = getDb();
    const enquiry = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(enquiryId) as any;
    if (!enquiry) {
      return errorResponse('Enquiry not found', 404);
    }

    // Only renter or host or admin can post messages
    if (enquiry.renterId !== user.id && enquiry.hostId !== user.id && user.role !== 'admin') {
      return errorResponse('Forbidden: You are not a participant in this enquiry', 403);
    }

    const msgId = 'msg_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO enquiry_messages (id, enquiryId, senderId, message, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(msgId, enquiryId, user.id, message.trim(), now);

    // Update enquiry status to 'responded' if host replied
    const newStatus = user.id === enquiry.hostId ? 'responded' : enquiry.status;
    db.prepare('UPDATE enquiries SET status = ?, updatedAt = ? WHERE id = ?').run(newStatus, now, enquiryId);

    logAuditEvent(user.id, 'SEND_MESSAGE', 'enquiry', enquiryId);

    return jsonResponse({
      success: true,
      message: {
        id: msgId,
        enquiryId,
        senderId: user.id,
        senderName: user.name,
        message: message.trim(),
        createdAt: now,
      },
    }, 201);
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to send message', 500);
  }
}
