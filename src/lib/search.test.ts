import { test, describe } from 'node:test';
import assert from 'node:assert';
import { searchListings, getListingById } from './db/queries';

describe('Homiq Search & Filter Engine', () => {
  test('returns listings for Bengaluru with correct count and properties', () => {
    const results = searchListings({ city: 'Bengaluru' });
    assert.ok(results.listings.length >= 3);
    for (const listing of results.listings) {
      assert.strictEqual(listing.city.toLowerCase(), 'bengaluru');
      assert.ok(listing.rentAmount > 0);
      assert.ok(Array.isArray(listing.amenities));
      assert.ok(Array.isArray(listing.houseRules));
    }
  });

  test('filters strictly by zero brokerage', () => {
    const results = searchListings({ zeroBrokerage: true });
    assert.ok(results.listings.length > 0);
    for (const listing of results.listings) {
      assert.strictEqual(listing.brokerageAmount, 0);
    }
  });

  test('filters by max total upfront cost', () => {
    const maxUpfront = 80000;
    const results = searchListings({ maxTotalUpfront: maxUpfront });
    assert.ok(results.listings.length > 0);
    for (const listing of results.listings) {
      const upfront = listing.depositAmount + listing.rentAmount + listing.brokerageAmount + listing.otherCharges;
      assert.ok(upfront <= maxUpfront);
    }
  });

  test('loads complete listing details including rooms and neighbourhood facilities', () => {
    const pg = getListingById('lst_hsr_coliving_pg');
    assert.ok(pg);
    assert.strictEqual(pg.propertyType, 'pg');
    assert.ok(pg.rooms && pg.rooms.length > 0);
    assert.ok(pg.neighbourhoodFacilities && pg.neighbourhoodFacilities.length > 0);
    assert.strictEqual(pg.foodIncluded, true);
  });
});
