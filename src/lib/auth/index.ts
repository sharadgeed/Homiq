import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { User, UserRole } from '@/lib/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'homiq_super_secret_dev_key_2026_india_housing_platform_123456789'
);

export const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'homiq_session';

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    const db = getDb();
    const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.userId) as any;
    if (!userRow) return null;

    return {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      phone: userRow.phone,
      role: userRow.role as UserRole,
      avatarUrl: userRow.avatarUrl,
      verificationStatus: userRow.verificationStatus,
      idDocType: userRow.idDocType,
      idDocUrl: userRow.idDocUrl,
      representationType: userRow.representationType,
      brokerageRegistrationNo: userRow.brokerageRegistrationNo,
      bio: userRow.bio,
      moveInDatePreference: userRow.moveInDatePreference,
      budgetPreference: userRow.budgetPreference,
      cityPreference: userRow.cityPreference,
      commuteDestination: userRow.commuteDestination,
      createdAt: userRow.createdAt,
      updatedAt: userRow.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED: Authentication required to perform this action.');
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<User> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`FORBIDDEN: Access restricted. Required role: [${allowedRoles.join(', ')}], current role: ${user.role}`);
  }
  return user;
}

export function logAuditEvent(actorId: string | null, action: string, targetType: string, targetId: string, metadata?: any, ipAddress?: string) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO audit_logs (id, actorId, action, targetType, targetId, metadata, ipAddress, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'aud_' + Math.random().toString(36).substring(2, 11),
      actorId,
      action,
      targetType,
      targetId,
      metadata ? JSON.stringify(metadata) : null,
      ipAddress || null,
      new Date().toISOString()
    );
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
