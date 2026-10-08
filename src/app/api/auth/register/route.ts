import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { hashPassword, createSessionToken, COOKIE_NAME, logAuditEvent } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      phone,
      role = 'renter',
      bio,
      cityPreference,
      budgetPreference,
      moveInDatePreference,
      commuteDestination,
      representationType,
      brokerageRegistrationNo,
    } = body;

    if (!email || !password || !name) {
      return errorResponse('Email, password, and full name are required', 400);
    }

    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters long', 400);
    }

    const validRoles = ['renter', 'owner', 'operator', 'broker'];
    if (!validRoles.includes(role)) {
      return errorResponse(`Invalid role. Select one of: ${validRoles.join(', ')}`, 400);
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
    if (existing) {
      return errorResponse('An account with this email address already exists', 409);
    }

    const passwordHash = await hashPassword(password);
    const userId = 'usr_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (
        id, email, passwordHash, name, phone, role, avatarUrl, verificationStatus,
        idDocType, idDocUrl, representationType, brokerageRegistrationNo, bio,
        moveInDatePreference, budgetPreference, cityPreference, commuteDestination,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      email.trim().toLowerCase(),
      passwordHash,
      name.trim(),
      phone || null,
      role,
      null,
      'unverified',
      null,
      null,
      representationType || null,
      brokerageRegistrationNo || null,
      bio || null,
      moveInDatePreference || null,
      budgetPreference ? Number(budgetPreference) : null,
      cityPreference || 'Bengaluru',
      commuteDestination || null,
      now,
      now
    );

    const token = await createSessionToken({
      userId,
      email: email.trim().toLowerCase(),
      role,
      name: name.trim(),
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    logAuditEvent(userId, 'USER_REGISTER', 'user', userId, { role, email });

    return jsonResponse(
      {
        success: true,
        user: {
          id: userId,
          email: email.trim().toLowerCase(),
          name: name.trim(),
          role,
          verificationStatus: 'unverified',
        },
      },
      201
    );
  } catch (err: any) {
    console.error('Registration error:', err);
    return errorResponse(err.message || 'Registration failed', 500);
  }
}
