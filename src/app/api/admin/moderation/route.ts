import { NextRequest } from 'next/server';
import { requireRole, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireRole(['admin']);
    const db = getDb();

    // Stats
    const totalListings = (db.prepare('SELECT COUNT(*) as c FROM listings').get() as any).c;
    const activeListings = (db.prepare("SELECT COUNT(*) as c FROM listings WHERE status = 'active'").get() as any).c;
    const verifiedListings = (db.prepare('SELECT COUNT(*) as c FROM listings WHERE verifiedListing = 1').get() as any).c;
    const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
    const pendingReportsCount = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE status = 'pending'").get() as any).c;

    // Reports queue
    const reports = db.prepare(`
      SELECT rep.*, l.title as listingTitle, l.city as listingCity, u.name as reporterName, u.email as reporterEmail
      FROM reports rep
      JOIN listings l ON rep.listingId = l.id
      JOIN users u ON rep.reporterId = u.id
      ORDER BY rep.createdAt DESC
      LIMIT 50
    `).all();

    // Pending listings for verification or unverified
    const listings = db.prepare(`
      SELECT l.id, l.title, l.city, l.neighbourhood, l.rentAmount, l.depositAmount, l.status,
             l.verifiedListing, l.verificationNotes, l.availabilityConfirmedAt, l.createdAt,
             u.name as ownerName, u.role as ownerRole, u.email as ownerEmail, u.verificationStatus as ownerVerification
      FROM listings l
      JOIN users u ON l.ownerId = u.id
      ORDER BY l.createdAt DESC
      LIMIT 50
    `).all();

    // Audit logs
    const auditLogs = db.prepare(`
      SELECT a.*, u.name as actorName
      FROM audit_logs a
      LEFT JOIN users u ON a.actorId = u.id
      ORDER BY a.createdAt DESC
      LIMIT 40
    `).all();

    // Users overview
    const users = db.prepare(`
      SELECT id, name, email, role, phone, verificationStatus, representationType, brokerageRegistrationNo, createdAt
      FROM users
      ORDER BY createdAt DESC
      LIMIT 50
    `).all();

    return jsonResponse({
      stats: {
        totalListings,
        activeListings,
        verifiedListings,
        totalUsers,
        pendingReportsCount,
      },
      reports,
      listings,
      users,
      auditLogs,
    });
  } catch (err: any) {
    return errorResponse(err.message || 'Unauthorized admin access', err.status || 403);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireRole(['admin']);
    const body = await req.json();
    const { action, targetId, notes, status, verified } = body;
    const db = getDb();
    const now = new Date().toISOString();

    if (action === 'VERIFY_LISTING') {
      db.prepare(`
        UPDATE listings
        SET verifiedListing = ?, verificationNotes = ?, updatedAt = ?
        WHERE id = ?
      `).run(verified ? 1 : 0, notes || 'Verified by admin', now, targetId);

      logAuditEvent(admin.id, 'ADMIN_VERIFY_LISTING', 'listing', targetId, { verified, notes });
      return jsonResponse({ success: true, message: 'Listing verification status updated' });
    }

    if (action === 'UPDATE_LISTING_STATUS') {
      db.prepare(`
        UPDATE listings
        SET status = ?, updatedAt = ?
        WHERE id = ?
      `).run(status, now, targetId);

      logAuditEvent(admin.id, 'ADMIN_UPDATE_LISTING_STATUS', 'listing', targetId, { status });
      return jsonResponse({ success: true, message: `Listing status updated to ${status}` });
    }

    if (action === 'RESOLVE_REPORT') {
      db.prepare(`
        UPDATE reports
        SET status = ?, adminNotes = ?, updatedAt = ?
        WHERE id = ?
      `).run(status || 'resolved', notes || null, now, targetId);

      logAuditEvent(admin.id, 'ADMIN_RESOLVE_REPORT', 'report', targetId, { status, notes });
      return jsonResponse({ success: true, message: 'Report resolved' });
    }

    if (action === 'VERIFY_USER') {
      db.prepare(`
        UPDATE users
        SET verificationStatus = ?, updatedAt = ?
        WHERE id = ?
      `).run(status, now, targetId);

      logAuditEvent(admin.id, 'ADMIN_VERIFY_USER', 'user', targetId, { verificationStatus: status });
      return jsonResponse({ success: true, message: `User verification status updated to ${status}` });
    }

    return errorResponse('Invalid action specified', 400);
  } catch (err: any) {
    return errorResponse(err.message || 'Action failed', err.status || 403);
  }
}
