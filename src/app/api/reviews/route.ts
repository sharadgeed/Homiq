import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { jsonResponse, errorResponse, handleApiError } from '@/lib/api-response';

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
    return handleApiError(err);
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

    // Eligibility verification: Must have interacted with listing (viewing, enquiry, or move-in)
    const confirmedStay = db.prepare(`
      SELECT 1 FROM viewings WHERE listingId = ? AND renterId = ? AND status IN ('confirmed', 'completed')
      UNION
      SELECT 1 FROM move_in_records WHERE listingId = ? AND renterId = ?
    `).get(listingId, user.id, listingId, user.id);

    const hasEnquiry = db.prepare(`
      SELECT 1 FROM enquiries WHERE listingId = ? AND renterId = ?
    `).get(listingId, user.id);

    if (!confirmedStay && !hasEnquiry && user.role !== 'admin') {
      return errorResponse(
        'Review eligibility requirement: You must have an active enquiry, scheduled viewing, or move-in record for this accommodation to submit a review.',
        403
      );
    }

    const isVerifiedStay = Boolean(confirmedStay);
    // If not a verified stay, place review in moderation queue ('flagged')
    const reviewStatus = isVerifiedStay || user.role === 'admin' ? 'published' : 'flagged';

    const id = 'rev_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO reviews (
        id, listingId, renterId, overallRating, cleanlinessRating, locationRating, valueRating, landlordRating,
        title, comment, pros, cons, verifiedStay, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      isVerifiedStay ? 1 : 0,
      reviewStatus,
      now
    );

    logAuditEvent(user.id, 'SUBMIT_REVIEW', 'review', id, {
      listingId,
      rating: overallRating,
      verifiedStay: isVerifiedStay,
      status: reviewStatus,
    });

    return jsonResponse(
      {
        success: true,
        id,
        status: reviewStatus,
        verifiedStay: isVerifiedStay,
        message:
          reviewStatus === 'published'
            ? 'Review published successfully'
            : 'Review submitted for moderation review',
      },
      201
    );
  } catch (err: any) {
    return handleApiError(err);
  }
}
