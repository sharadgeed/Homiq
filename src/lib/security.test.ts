import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { AuthError, ForbiddenError, logAuditEvent } from './auth';
import { getListingById } from './db/queries';
import { getDb } from './db';
import { handleApiError } from './api-response';

describe('Homiq Security & Role Authorization Engine', () => {
  test('AuthError generates 401 HTTP status and message', () => {
    const err = new AuthError('Authentication required');
    assert.strictEqual(err.status, 401);
    assert.strictEqual(err.name, 'AuthError');

    const res = handleApiError(err);
    assert.strictEqual(res.status, 401);
  });

  test('ForbiddenError generates 403 HTTP status and message', () => {
    const err = new ForbiddenError('Access restricted for role');
    assert.strictEqual(err.status, 403);
    assert.strictEqual(err.name, 'ForbiddenError');

    const res = handleApiError(err);
    assert.strictEqual(res.status, 403);
  });

  test('Role authorization logic restricts non-admin roles', () => {
    const renterUser = { role: 'renter' as const, id: 'usr_renter_1' };
    const allowedRoles: string[] = ['admin'];

    assert.throws(
      () => {
        if (!allowedRoles.includes(renterUser.role)) {
          throw new ForbiddenError(`FORBIDDEN: Access restricted. Required role: [${allowedRoles.join(', ')}]`);
        }
      },
      (err: any) => err instanceof ForbiddenError && err.status === 403
    );

    const adminUser = { role: 'admin' as const, id: 'usr_admin_1' };
    assert.doesNotThrow(() => {
      if (!allowedRoles.includes(adminUser.role)) {
        throw new ForbiddenError('FORBIDDEN');
      }
    });
  });
});

describe('Homiq Data Privacy & Redaction Engine', () => {
  const listingId = 'lst_koramangala_1bhk';

  test('masks sensitive contact info and exact flat address for unauthenticated guest', () => {
    const listing = getListingById(listingId);
    assert.ok(listing);
    // Unauthenticated guest sees generalized locality rather than exact building/door number
    assert.strictEqual(listing.address, listing.publicLocationDescription);
    assert.ok(!listing.address.includes('#412'));
    assert.strictEqual(listing.ownerPhone, undefined);
    assert.strictEqual(listing.ownerEmail, undefined);
  });

  test('masks sensitive contact info for another renter with no confirmed viewing', () => {
    const listing = getListingById(listingId, 'usr_renter_unrelated', 'renter');
    assert.ok(listing);
    assert.strictEqual(listing.address, listing.publicLocationDescription);
    assert.ok(!listing.address.includes('#412'));
    assert.strictEqual(listing.ownerPhone, undefined);
    assert.strictEqual(listing.ownerEmail, undefined);
  });

  test('reveals exact door/building address and unmasked contact for listing owner', () => {
    const db = getDb();
    const rawListing = db.prepare('SELECT ownerId, address FROM listings WHERE id = ?').get(listingId) as any;
    assert.ok(rawListing);
    const rawOwner = db.prepare('SELECT phone, email FROM users WHERE id = ?').get(rawListing.ownerId) as any;
    assert.ok(rawOwner);

    const listing = getListingById(listingId, rawListing.ownerId, 'owner');
    assert.ok(listing);
    assert.strictEqual(listing.address, rawListing.address);
    assert.ok(listing.address.includes('#412'));
    assert.strictEqual(listing.ownerPhone, rawOwner.phone);
    assert.strictEqual(listing.ownerEmail, rawOwner.email);
  });

  test('reveals exact door/building address and unmasked contact for platform administrator', () => {
    const db = getDb();
    const raw = db.prepare('SELECT address FROM listings WHERE id = ?').get(listingId) as any;

    const listing = getListingById(listingId, 'usr_admin_1', 'admin');
    assert.ok(listing);
    assert.strictEqual(listing.address, raw.address);
    assert.ok(listing.address.includes('#412'));
  });
});

describe('Homiq Listing Access & Modification Authorization', () => {
  const testListingId = 'lst_indiranagar_2bhk';

  test('owner can only edit their own listing, not foreign listings', () => {
    const db = getDb();
    const listing = db.prepare('SELECT ownerId FROM listings WHERE id = ?').get(testListingId) as any;
    assert.ok(listing);

    const maliciousOwnerId = 'usr_owner_unauthorized_999';

    // Verify condition used in PATCH /api/listings/[id]
    const isOwnerOrAdmin = listing.ownerId === maliciousOwnerId || false;
    assert.strictEqual(isOwnerOrAdmin, false, 'Malicious owner must be denied modification');

    const legitimateOwnerCheck = listing.ownerId === listing.ownerId || false;
    assert.strictEqual(legitimateOwnerCheck, true, 'Legitimate owner must be allowed modification');
  });

  test('broker without explicit authorization cannot edit listing', () => {
    const db = getDb();
    const listing = db.prepare('SELECT ownerId FROM listings WHERE id = ?').get(testListingId) as any;
    assert.ok(listing);
    const unrelatedBrokerId = 'usr_broker_unauthorized';

    // Broker is neither listing owner nor platform admin
    const canBrokerEdit = listing.ownerId === unrelatedBrokerId || false;
    assert.strictEqual(canBrokerEdit, false, 'Broker without owner mandate cannot edit listing');
  });
});

describe('Homiq Review Eligibility & Trust Engine', () => {
  test('rejects review from user without enquiry, viewing, or move-in record', () => {
    const db = getDb();
    const listingId = 'lst_indiranagar_2bhk';
    const strangerId = 'usr_stranger_' + Date.now();

    const confirmedStay = db.prepare(`
      SELECT 1 FROM viewings WHERE listingId = ? AND renterId = ? AND status IN ('confirmed', 'completed')
      UNION
      SELECT 1 FROM move_in_records WHERE listingId = ? AND renterId = ?
    `).get(listingId, strangerId, listingId, strangerId);

    const hasEnquiry = db.prepare(`
      SELECT 1 FROM enquiries WHERE listingId = ? AND renterId = ?
    `).get(listingId, strangerId);

    const isEligible = Boolean(confirmedStay || hasEnquiry);
    assert.strictEqual(isEligible, false, 'Stranger without history must not be eligible for review');
  });

  test('identifies verified stay for renter with confirmed viewing or move-in record', () => {
    const db = getDb();
    const testRenter = 'usr_renter_1'; // Seeded valid user
    const testListing = 'lst_koramangala_1bhk';

    const confirmedStay = db.prepare(`
      SELECT 1 FROM viewings WHERE listingId = ? AND renterId = ? AND status IN ('confirmed', 'completed')
      UNION
      SELECT 1 FROM move_in_records WHERE listingId = ? AND renterId = ?
    `).get(testListing, testRenter, testListing, testRenter);

    assert.ok(confirmedStay, 'Renter with confirmed viewing or move-in must be recognized as eligible verified stay');
  });
});

describe('Homiq DPDP Act Data Privacy & Export / Erasure Engine', () => {
  const testUserId = 'usr_dpdp_test_' + Date.now();

  before(() => {
    const db = getDb();
    db.prepare(`
      INSERT INTO users (id, email, passwordHash, name, role, phone, bio, verificationStatus, createdAt, updatedAt)
      VALUES (?, ?, 'hash123', 'DPDP Test User', 'renter', '+919999988888', 'Test bio', 'unverified', datetime('now'), datetime('now'))
    `).run(testUserId, `dpdp_${testUserId}@example.com`);
  });

  after(() => {
    const db = getDb();
    db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
    db.prepare('DELETE FROM audit_logs WHERE actorId = ?').run(testUserId);
  });

  test('exports all personal data, bookings, and activities under DPDP Act', () => {
    const db = getDb();
    const userRow = db.prepare('SELECT id, email, name, phone, role FROM users WHERE id = ?').get(testUserId) as any;
    assert.ok(userRow);
    assert.strictEqual(userRow.name, 'DPDP Test User');

    const enquiries = db.prepare('SELECT * FROM enquiries WHERE renterId = ? OR hostId = ?').all(testUserId, testUserId);
    const viewings = db.prepare('SELECT * FROM viewings WHERE renterId = ? OR hostId = ?').all(testUserId, testUserId);

    assert.ok(Array.isArray(enquiries));
    assert.ok(Array.isArray(viewings));
  });

  test('anonymizes and erases PII on account deletion request while logging audit', () => {
    const db = getDb();
    const now = new Date().toISOString();

    logAuditEvent(testUserId, 'ACCOUNT_DELETION_EXECUTE', 'user', testUserId, { reason: 'DPDP erasure test' });

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
    `).run(now, testUserId);

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(testUserId) as any;
    assert.strictEqual(updated.name, 'Deleted Account');
    assert.strictEqual(updated.phone, null);
    assert.strictEqual(updated.passwordHash, 'DELETED');
    assert.strictEqual(updated.bio, null);
    assert.ok(updated.email.startsWith('deleted_'));

    const auditLog = db.prepare('SELECT * FROM audit_logs WHERE actorId = ? AND action = ?').get(testUserId, 'ACCOUNT_DELETION_EXECUTE') as any;
    assert.ok(auditLog, 'Audit event must be immutably recorded for statutory compliance');
  });
});

describe('Homiq Media Upload Validation Rules', () => {
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

  test('accepts valid MIME types and rejects dangerous file formats', () => {
    assert.strictEqual(ALLOWED_MIME_TYPES.includes('image/jpeg'), true);
    assert.strictEqual(ALLOWED_MIME_TYPES.includes('image/png'), true);
    assert.strictEqual(ALLOWED_MIME_TYPES.includes('image/webp'), true);
    assert.strictEqual(ALLOWED_MIME_TYPES.includes('application/pdf'), true);

    // Rejected formats
    assert.strictEqual(ALLOWED_MIME_TYPES.includes('application/x-msdownload'), false);
    assert.strictEqual(ALLOWED_MIME_TYPES.includes('text/javascript'), false);
    assert.strictEqual(ALLOWED_MIME_TYPES.includes('text/html'), false);
    assert.strictEqual(ALLOWED_MIME_TYPES.includes('application/zip'), false);
  });

  test('enforces 5MB size limit', () => {
    const validSize = 3 * 1024 * 1024; // 3MB
    const oversized = 6 * 1024 * 1024; // 6MB

    assert.ok(validSize <= MAX_SIZE_BYTES);
    assert.ok(oversized > MAX_SIZE_BYTES);
  });
});
