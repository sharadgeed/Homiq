import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { requireAuth, COOKIE_NAME, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { jsonResponse, handleApiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const db = getDb();
    const now = new Date().toISOString();

    // Log deletion in immutable audit log before removing PII
    logAuditEvent(user.id, 'ACCOUNT_DELETION_EXECUTE', 'user', user.id, {
      requestedAt: now,
      reason: 'User self-service deletion request under DPDP Act',
    });

    // Delete or anonymize user record
    db.prepare(`
      UPDATE users
      SET name = 'Deleted Account',
          email = 'deleted_' || id || '@purged.homiq.in',
          phone = NULL,
          passwordHash = 'DELETED',
          bio = NULL,
          avatarUrl = NULL,
          updatedAt = ?
      WHERE id = ?
    `).run(now, user.id);

    // Clear session cookie
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);

    return jsonResponse({
      success: true,
      message: 'Account personal data successfully erased. Statutory compliance audit trail retained.',
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
