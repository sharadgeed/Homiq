import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { createSessionToken, COOKIE_NAME, logAuditEvent } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    // Strictly disable demo login in production unless explicitly permitted for test preview
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_LOGIN !== 'true') {
      return errorResponse('Demo login is disabled in this environment', 403);
    }

    const { role } = await req.json();

    const allowedRoles = ['renter', 'owner', 'operator', 'broker', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      return errorResponse(`Invalid demo role. Allowed: ${allowedRoles.join(', ')}`, 400);
    }

    const email = `${role}@homiq.in`;
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user) {
      return errorResponse(`Demo user for role ${role} not available. Initial seed may be pending.`, 404);
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    logAuditEvent(user.id, 'DEMO_LOGIN', 'user', user.id, { role: user.role });

    return jsonResponse({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (err: any) {
    console.error('Demo login error:', err);
    return errorResponse(err.message || 'Demo login failed', 500);
  }
}
