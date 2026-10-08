import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateCosts } from './types';

describe('Homiq Cost Calculation Engine', () => {
  test('calculates correct upfront and recurring costs for owner flat with zero brokerage', () => {
    const listing = {
      rentAmount: 25000,
      depositAmount: 50000,
      brokerageAmount: 0,
      maintenanceAmount: 2500,
      utilityEstimatedAmount: 1500,
      foodCharges: 0,
      otherCharges: 1000,
    };

    const breakdown = calculateCosts(listing);

    // Upfront = 50000 (deposit) + 25000 (1st mo rent) + 0 (brokerage) + 1000 (other) = 76,000
    assert.strictEqual(breakdown.totalUpfrontCost, 76000);

    // Monthly = 25000 (rent) + 2500 (maintenance) + 1500 (utility) + 0 (food) = 29,000
    assert.strictEqual(breakdown.monthlyRecurringCost, 29000);
  });

  test('calculates correct upfront cost with broker representation fee disclosed', () => {
    const listing = {
      rentAmount: 40000,
      depositAmount: 120000,
      brokerageAmount: 20000, // 15 days brokerage
      maintenanceAmount: 4000,
      utilityEstimatedAmount: 2000,
      foodCharges: 0,
      otherCharges: 2000,
    };

    const breakdown = calculateCosts(listing);

    // Upfront = 120000 + 40000 + 20000 + 2000 = 182,000
    assert.strictEqual(breakdown.totalUpfrontCost, 182000);
    assert.strictEqual(breakdown.monthlyRecurringCost, 46000);
  });

  test('calculates correct recurring costs for PG with included 3-meal food plan', () => {
    const listing = {
      rentAmount: 16000,
      depositAmount: 30000,
      brokerageAmount: 0,
      maintenanceAmount: 0,
      utilityEstimatedAmount: 0,
      foodCharges: 3500,
      otherCharges: 500,
    };

    const breakdown = calculateCosts(listing);

    assert.strictEqual(breakdown.totalUpfrontCost, 46500);
    assert.strictEqual(breakdown.monthlyRecurringCost, 19500);
  });
});
