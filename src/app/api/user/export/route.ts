import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { jsonResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const db = getDb();

    // Collect all data belonging to the user
    const enquiries = db.prepare('SELECT * FROM enquiries WHERE renterId = ? OR hostId = ?').all(user.id, user.id);
    const viewings = db.prepare('SELECT * FROM viewings WHERE renterId = ? OR hostId = ?').all(user.id, user.id);
    const saved = db.prepare('SELECT * FROM saved_listings WHERE userId = ?').all(user.id);
    const reviews = db.prepare('SELECT * FROM reviews WHERE renterId = ?').all(user.id);
    const moveInRecords = db.prepare('SELECT * FROM move_in_records WHERE renterId = ? OR hostId = ?').all(user.id, user.id);
    const maintenance = db.prepare('SELECT * FROM maintenance_requests WHERE requesterId = ? OR hostId = ?').all(user.id, user.id);
    const auditEvents = db.prepare('SELECT action, targetType, targetId, createdAt FROM audit_logs WHERE actorId = ?').all(user.id);

    logAuditEvent(user.id, 'DATA_EXPORT_REQUEST', 'user', user.id);

    return jsonResponse({
      exportTimestamp: new Date().toISOString(),
      complianceFramework: 'Digital Personal Data Protection Act (DPDP Act 2023)',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        bio: user.bio,
        cityPreference: user.cityPreference,
        budgetPreference: user.budgetPreference,
        createdAt: user.createdAt,
      },
      enquiries,
      viewings,
      savedListings: saved,
      reviews,
      moveInRecords,
      maintenanceRequests: maintenance,
      auditHistory: auditEvents,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
