import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, logAuditEvent } from '@/lib/auth';
import { jsonResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return errorResponse('Email and new password are required', 400);
    }

    if (newPassword.length < 8) {
      return errorResponse('Password must be at least 8 characters long', 400);
    }

    const db = getDb();
    const user = db.prepare('SELECT id, email FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim()) as any;

    // Do not disclose whether email exists for anti-enumeration
    if (!user) {
      return jsonResponse({
        success: true,
        message: 'If the account exists, password recovery instructions or reset has been processed.',
      });
    }

    const newHash = await hashPassword(newPassword);
    const now = new Date().toISOString();

    db.prepare('UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ?').run(newHash, now, user.id);
    logAuditEvent(user.id, 'PASSWORD_RESET', 'user', user.id);

    return jsonResponse({
      success: true,
      message: 'Password successfully updated. You may now sign in with your new credentials.',
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
