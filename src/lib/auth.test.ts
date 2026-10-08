import { test, describe } from 'node:test';
import assert from 'node:assert';
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from './auth/index';

describe('Homiq Authentication & Token Protection', () => {
  test('hashes password and verifies successfully', async () => {
    const raw = 'SecureSecretPassword2026!';
    const hash = await hashPassword(raw);

    assert.notStrictEqual(raw, hash);
    const isValid = await verifyPassword(raw, hash);
    assert.strictEqual(isValid, true);

    const isWrong = await verifyPassword('IncorrectPassword', hash);
    assert.strictEqual(isWrong, false);
  });

  test('creates signed JWT and verifies session payload', async () => {
    const payload = {
      userId: 'usr_renter_1',
      email: 'renter@homiq.in',
      role: 'renter' as const,
      name: 'Aarav Sharma',
    };

    const token = await createSessionToken(payload);
    assert.ok(token && typeof token === 'string');

    const decoded = await verifySessionToken(token);
    assert.ok(decoded);
    assert.strictEqual(decoded.userId, payload.userId);
    assert.strictEqual(decoded.role, 'renter');
    assert.strictEqual(decoded.email, payload.email);
  });

  test('rejects tampered or invalid JWT', async () => {
    const invalid = await verifySessionToken('invalid.token.here');
    assert.strictEqual(invalid, null);
  });
});
