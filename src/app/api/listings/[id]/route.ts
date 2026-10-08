import { NextRequest } from 'next/server';
import { getListingById } from '@/lib/db/queries';
import { requireAuth, getCurrentUser, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { jsonResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const viewer = await getCurrentUser();
    const listing = getListingById(id, viewer?.id, viewer?.role);
    if (!listing) {
      return errorResponse('Listing not found', 404);
    }
    return jsonResponse({ listing });
  } catch (err: any) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    const db = getDb();

    const existing = db.prepare('SELECT * FROM listings WHERE id = ?').get(id) as any;
    if (!existing) {
      return errorResponse('Listing not found', 404);
    }

    // Ownership or admin check
    if (existing.ownerId !== user.id && user.role !== 'admin') {
      return errorResponse('Forbidden: You can only edit your own listings', 403);
    }

    const body = await req.json();
    const {
      status,
      rentAmount,
      depositAmount,
      maintenanceAmount,
      foodCharges,
      title,
      description,
      availabilityConfirmedAt,
      availableFrom,
    } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (rentAmount !== undefined) {
      updates.push('rentAmount = ?');
      values.push(Number(rentAmount));
    }
    if (depositAmount !== undefined) {
      updates.push('depositAmount = ?');
      values.push(Number(depositAmount));
    }
    if (maintenanceAmount !== undefined) {
      updates.push('maintenanceAmount = ?');
      values.push(Number(maintenanceAmount));
    }
    if (foodCharges !== undefined) {
      updates.push('foodCharges = ?');
      values.push(Number(foodCharges));
    }
    if (title) {
      updates.push('title = ?');
      values.push(title.trim());
    }
    if (description) {
      updates.push('description = ?');
      values.push(description.trim());
    }
    if (availabilityConfirmedAt) {
      updates.push('availabilityConfirmedAt = ?');
      values.push(availabilityConfirmedAt);
    }
    if (availableFrom) {
      updates.push('availableFrom = ?');
      values.push(availableFrom);
    }

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());

    values.push(id);

    const query = `UPDATE listings SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);

    logAuditEvent(user.id, 'UPDATE_LISTING', 'listing', id, body);

    const updated = getListingById(id, user.id, user.role);
    return jsonResponse({ success: true, listing: updated });
  } catch (err: any) {
    return handleApiError(err);
  }
}
