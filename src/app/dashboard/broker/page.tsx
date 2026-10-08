'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Briefcase, PlusCircle, AlertCircle, CheckCircle2,
  Calendar, FileText, UserCheck, RefreshCw, Scale
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import { formatINR } from '@/lib/api-response';

export default function BrokerDashboard() {
  const [brokerListing, setBrokerListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings/lst_indiranagar_2bhk')
      .then(res => res.json())
      .then(data => setBrokerListing(data.listing))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      <main className="homiq-container" style={{ padding: '2.5rem 1.25rem', flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge" style={{ background: '#fce7f3', color: '#be185d', fontWeight: 700 }}>
                RERA Professional Broker Desk
              </span>
              <span className="badge badge-verified">Karnataka RERA Reg: PRM/KA/RERA/1251</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Broker Representation & Leads Desk
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Vikram Kulkarni • Owner-Authorized Residential Representative in Indiranagar & Whitefield.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/listings/new" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Disclose & List Property
            </Link>
          </div>
        </div>

        {/* Regulatory Disclosure Banner (Prompt mandated: Never appear as owner, disclose fees) */}
        <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.35rem' }}>
            <ShieldCheck size={20} color="var(--primary)" />
            <span>Statutory Representation & Fee Transparency Compliance</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
            Under Homiq Trust Guidelines, brokers are registered as authorized intermediaries and will never be presented to renters as direct property owners. All brokerage commissions (e.g. 15 days rent) must be disclosed transparently in the upfront cost matrix.
          </p>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Active Mandates</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', margin: '0.2rem 0' }}>
              1 Managed
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>Authorised by Landlord</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Disclosed Commission</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
              15 Days Rent
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pre-disclosed to applicant</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Assigned Leads</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', margin: '0.2rem 0' }}>
              9 Enquiries
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309' }}>Awaiting viewing follow-up</div>
          </div>
        </div>

        {/* Assigned Managed Listings Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Managed Properties with Authorized Disclosure</h2>

          {brokerListing ? (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-verified">Owner Representative Verified</span>
                  <span className="badge" style={{ background: '#fce7f3', color: '#be185d' }}>
                    Brokerage Disclosed: {formatINR(brokerListing.brokerageAmount)}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{brokerListing.title}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {brokerListing.neighbourhood}, {brokerListing.city} • Rent: {formatINR(brokerListing.rentAmount)}/mo • Upfront Deposit: {formatINR(brokerListing.depositAmount)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/listings/${brokerListing.id}`} className="btn btn-primary btn-sm">
                  View Public Listing
                </Link>
                <Link href="/dashboard/owner" className="btn btn-secondary btn-sm">
                  View Leads
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Loading authorized broker mandates...
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
