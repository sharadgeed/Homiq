import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { verifyPassword, createSessionToken, COOKIE_NAME, logAuditEvent } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim()) as any;

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return errorResponse('Invalid email or password', 401);
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
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    logAuditEvent(user.id, 'USER_LOGIN', 'user', user.id, { role: user.role });

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
    console.error('Login error:', err);
    return errorResponse(err.message || 'Login failed', 500);
  }
}
