import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { getListingById } from '@/lib/db/queries';
import { jsonResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuth();
    const db = getDb();

    let query = `
      SELECT m.*, l.title as listingTitle, r.name as requesterName
      FROM maintenance_requests m
      JOIN listings l ON m.listingId = l.id
      JOIN users r ON m.requesterId = r.id
    `;
    const params: any[] = [];

    if (user.role === 'renter') {
      query += ` WHERE m.requesterId = ?`;
      params.push(user.id);
    } else if (user.role === 'admin') {
      // admin sees all
    } else {
      query += ` WHERE m.hostId = ?`;
      params.push(user.id);
    }

    query += ` ORDER BY m.createdAt DESC`;

    const requests = db.prepare(query).all(...params);
    return jsonResponse({ requests });
  } catch (err: any) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { listingId, title, description, category = 'other', priority = 'medium' } = body;

    if (!listingId || !title || !description) {
      return errorResponse('listingId, title, and description are required', 400);
    }

    const listing = getListingById(listingId);
    if (!listing) {
      return errorResponse('Listing not found', 404);
    }

    const db = getDb();
    const id = 'mnt_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO maintenance_requests (id, listingId, requesterId, hostId, title, description, category, priority, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)
    `).run(id, listingId, user.id, listing.ownerId, title.trim(), description.trim(), category, priority, now, now);

    logAuditEvent(user.id, 'CREATE_MAINTENANCE_REQUEST', 'maintenance', id);

    return jsonResponse({ success: true, id }, 201);
  } catch (err: any) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { id, status, resolutionNotes } = await req.json();

    if (!id || !status) {
      return errorResponse('id and status are required', 400);
    }

    const db = getDb();
    const reqRow = db.prepare('SELECT * FROM maintenance_requests WHERE id = ?').get(id) as any;
    if (!reqRow) {
      return errorResponse('Maintenance request not found', 404);
    }

    if (reqRow.hostId !== user.id && user.role !== 'admin') {
      return errorResponse('Forbidden: Only host or admin can update maintenance status', 403);
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE maintenance_requests SET status = ?, resolutionNotes = ?, updatedAt = ?
      WHERE id = ?
    `).run(status, resolutionNotes || null, now, id);

    logAuditEvent(user.id, 'UPDATE_MAINTENANCE_STATUS', 'maintenance', id, { status });

    return jsonResponse({ success: true });
  } catch (err: any) {
    return handleApiError(err);
  }
}
