import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return errorResponse('listingId is required', 400);
    }

    const db = getDb();
    const reviews = db.prepare(`
      SELECT r.*, u.name as renterName, u.avatarUrl as renterAvatar
      FROM reviews r
      JOIN users u ON r.renterId = u.id
      WHERE r.listingId = ? AND r.status = 'published'
      ORDER BY r.createdAt DESC
    `).all(listingId);

    return jsonResponse({ reviews });
  } catch (err: any) {
    return errorResponse(err.message || 'Error fetching reviews', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const {
      listingId,
      overallRating = 5,
      cleanlinessRating = 5,
      locationRating = 5,
      valueRating = 5,
      landlordRating = 5,
      title,
      comment,
      pros,
      cons,
    } = body;

    if (!listingId || !title || !comment) {
      return errorResponse('listingId, title, and comment are required', 400);
    }

    const db = getDb();
    const id = 'rev_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO reviews (
        id, listingId, renterId, overallRating, cleanlinessRating, locationRating, valueRating, landlordRating,
        title, comment, pros, cons, verifiedStay, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'published', ?)
    `).run(
      id,
      listingId,
      user.id,
      Number(overallRating),
      Number(cleanlinessRating),
      Number(locationRating),
      Number(valueRating),
      Number(landlordRating),
      title.trim(),
      comment.trim(),
      pros ? pros.trim() : null,
      cons ? cons.trim() : null,
      now
    );

    logAuditEvent(user.id, 'SUBMIT_REVIEW', 'review', id, { listingId, rating: overallRating });

    return jsonResponse({ success: true, id }, 201);
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to submit review', 500);
  }
}
