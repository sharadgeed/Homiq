import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getDb } from './db/index';
import { getEnquiriesForUser, getViewingsForUser } from './db/queries';

describe('Homiq Enquiry & Viewing Management Engine', () => {
  test('retrieves seeded enquiries for renter and host', () => {
    const renterEnquiries = getEnquiriesForUser('usr_renter_1', 'renter');
    assert.ok(renterEnquiries.length >= 1);

    const firstEnq = renterEnquiries[0];
    assert.strictEqual(firstEnq.renterId, 'usr_renter_1');
    assert.ok(firstEnq.listingTitle);
    assert.ok(firstEnq.hostName);
    assert.ok(firstEnq.messages && firstEnq.messages.length > 0);
  });

  test('retrieves viewings for user with valid statuses', () => {
    const viewings = getViewingsForUser('usr_renter_1', 'renter');
    assert.ok(viewings.length >= 1);

    const firstV = viewings[0];
    assert.ok(['in_person', 'video_tour'].includes(firstV.viewingType));
    assert.ok(firstV.scheduledAt);
    assert.ok(firstV.status);
  });

  test('creates new enquiry and appends chat message in database', () => {
    const db = getDb();
    const testEnqId = 'enq_test_' + Date.now();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO enquiries (id, listingId, renterId, hostId, targetMoveInDate, durationMonths, message, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(testEnqId, 'lst_koramangala_1bhk', 'usr_renter_1', 'usr_owner_1', '2026-12-01', 11, 'Automated Test Enquiry', 'pending', now, now);

    db.prepare(`
      INSERT INTO enquiry_messages (id, enquiryId, senderId, message, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run('msg_test_' + Date.now(), testEnqId, 'usr_renter_1', 'Hello from test', now);

    const row = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(testEnqId) as any;
    assert.ok(row);
    assert.strictEqual(row.status, 'pending');

    // Clean up test enquiry
    db.prepare('DELETE FROM enquiry_messages WHERE enquiryId = ?').run(testEnqId);
    db.prepare('DELETE FROM enquiries WHERE id = ?').run(testEnqId);
  });
});
