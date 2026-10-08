import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { getListingById } from '@/lib/db/queries';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    const db = getDb();
    let query = `
      SELECT m.*, l.title as listingTitle, r.name as renterName, h.name as hostName
      FROM move_in_records m
      JOIN listings l ON m.listingId = l.id
      JOIN users r ON m.renterId = r.id
      JOIN users h ON m.hostId = h.id
    `;
    const params: any[] = [];

    if (listingId) {
      query += ` WHERE m.listingId = ? AND (m.renterId = ? OR m.hostId = ? OR ?)`;
      params.push(listingId, user.id, user.id, user.role === 'admin' ? 1 : 0);
    } else {
      query += ` WHERE m.renterId = ? OR m.hostId = ? OR ?`;
      params.push(user.id, user.id, user.role === 'admin' ? 1 : 0);
    }

    query += ` ORDER BY m.updatedAt DESC`;

    const rows = db.prepare(query).all(...params) as any[];
    const parsed = rows.map(r => ({
      ...r,
      checklist: JSON.parse(r.checklist || '{}'),
      datedPhotos: JSON.parse(r.datedPhotos || '[]'),
    }));

    return jsonResponse({ records: parsed });
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
      renterId,
      moveInDate,
      agreedRent,
      agreedDeposit,
      checklist = {},
      conditionNotes,
      datedPhotos = [],
      status = 'agreed_by_both',
    } = body;

    if (!listingId || !moveInDate || !agreedRent || !agreedDeposit) {
      return errorResponse('Missing required fields: listingId, moveInDate, agreedRent, agreedDeposit', 400);
    }

    const listing = getListingById(listingId);
    if (!listing) {
      return errorResponse('Listing not found', 404);
    }

    const hostId = listing.ownerId;
    const finalRenterId = renterId || (user.role === 'renter' ? user.id : null);
    if (!finalRenterId) {
      return errorResponse('Renter ID must be specified', 400);
    }

    // Authorization: User must be host, renter, or admin
    if (user.id !== hostId && user.id !== finalRenterId && user.role !== 'admin') {
      return errorResponse('Forbidden: You are not authorized for this move-in record', 403);
    }

    const db = getDb();
    const id = 'mir_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO move_in_records (
        id, listingId, renterId, hostId, moveInDate, agreedRent, agreedDeposit,
        checklist, conditionNotes, datedPhotos, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      listingId,
      finalRenterId,
      hostId,
      moveInDate,
      Number(agreedRent),
      Number(agreedDeposit),
      JSON.stringify(checklist),
      conditionNotes || null,
      JSON.stringify(datedPhotos),
      status,
      now,
      now
    );

    logAuditEvent(user.id, 'CREATE_MOVE_IN_RECORD', 'move_in_record', id, { listingId, agreedRent });

    return jsonResponse({ success: true, recordId: id }, 201);
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to save move-in record', 500);
  }
}
