import React from 'react';
import { IndianRupee, ShieldCheck, Info, Check, HelpCircle } from 'lucide-react';
import { Listing, calculateCosts } from '@/lib/types';
import { formatINR } from '@/lib/api-response';

interface CostBreakdownCardProps {
  listing: Listing;
}

export default function CostBreakdownCard({ listing }: CostBreakdownCardProps) {
  const costs = calculateCosts(listing);

  return (
    <div className="card" style={{ padding: '1.5rem', border: '1.5px solid var(--primary-light)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cost Transparency Guarantee
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Complete Financial Breakdown
          </h3>
        </div>
        <div style={{
          background: 'var(--primary-subtle)',
          color: 'var(--primary)',
          padding: '0.4rem 0.75rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.8125rem',
          fontWeight: 700
        }}>
          <ShieldCheck size={16} />
          <span>Zero Hidden Fees</span>
        </div>
      </div>

      {/* Grid of Two Main Totals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Total Upfront */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
          border: '1.5px solid #6ee7b7',
          borderRadius: '12px',
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 600, marginBottom: '0.25rem' }}>
            EST. TOTAL UPFRONT MOVE-IN COST
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#044e46' }}>
            {formatINR(costs.totalUpfrontCost)}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#047857', marginTop: '0.35rem' }}>
            Deposit + 1st Month + Brokerage + Move-in Fee
          </div>
        </div>

        {/* Monthly Recurring */}
        <div style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, marginBottom: '0.25rem' }}>
            EST. TOTAL MONTHLY RECURRING
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            {formatINR(costs.monthlyRecurringCost)}
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>/mo</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.35rem' }}>
            Rent + Maintenance + Electricity + Food
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Itemized Charges Breakdown
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div className="cost-row">
            <span>Monthly Base Rent</span>
            <span style={{ fontWeight: 600 }}>{formatINR(listing.rentAmount)} / mo</span>
          </div>

          <div className="cost-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Refundable Security Deposit
              <span title="Paid upfront, refunded at move-out as per terms" style={{ color: '#94a3b8', cursor: 'help' }}>ℹ</span>
            </span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(listing.depositAmount)} (one-time)</span>
          </div>

          <div className="cost-row">
            <span>Society Maintenance Charges</span>
            <span style={{ fontWeight: 600 }}>
              {listing.maintenanceAmount === 0 ? 'Included in Rent' : `${formatINR(listing.maintenanceAmount)} / mo`}
            </span>
          </div>

          <div className="cost-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Brokerage / Commission Fee
              {listing.brokerageAmount === 0 && <span className="badge badge-zero-brokerage" style={{ fontSize: '0.65rem' }}>Zero Brokerage</span>}
            </span>
            <span style={{ fontWeight: 600, color: listing.brokerageAmount === 0 ? 'var(--success)' : '#0f172a' }}>
              {listing.brokerageAmount === 0 ? '₹0 (Direct from Owner)' : `${formatINR(listing.brokerageAmount)} (one-time)`}
            </span>
          </div>

          <div className="cost-row">
            <span>Estimated Utilities (Power, Water, Gas, Wi-Fi)</span>
            <span style={{ fontWeight: 600 }}>
              {listing.utilityEstimatedAmount === 0 ? 'Included in Rent' : `~${formatINR(listing.utilityEstimatedAmount)} / mo (est.)`}
            </span>
          </div>

          {listing.foodCharges > 0 && (
            <div className="cost-row">
              <span>Food / Meal Plan Charges</span>
              <span style={{ fontWeight: 600 }}>{formatINR(listing.foodCharges)} / mo</span>
            </div>
          )}

          {listing.otherCharges > 0 && (
            <div className="cost-row">
              <span>One-Time Onboarding & Deep Cleaning</span>
              <span style={{ fontWeight: 600 }}>{formatINR(listing.otherCharges)} (one-time)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
