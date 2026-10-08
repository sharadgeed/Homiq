import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Scale, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="homiq-container" style={{ padding: '3rem 1.25rem', maxWidth: '840px', flex: 1 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Terms of Service & Broker Disclosures
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Platform rules, intermediary disclosures, and user obligations under Indian law.
        </p>

        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.7 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              1. Platform Role as Information Intermediary
            </h3>
            <p>
              Homiq acts as an electronic marketplace platform connecting accommodation seekers, property owners, co-living operators, and licensed brokers under Section 79 of the Information Technology Act, 2000. Homiq is not a party to the tenancy agreement executed between landlord and tenant.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              2. Broker Representation & Fee Disclosures
            </h3>
            <p>
              Brokers listing properties on Homiq must possess a valid State Real Estate Regulatory Authority (RERA) registration. Brokers must state whether they represent the owner or tenant and must disclose any brokerage charges upfront in the listing breakdown. Listing as an "owner" while charging brokerage constitutes an immediate grounds for account termination and RERA intimation.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              3. Non-Discrimination Policy
            </h3>
            <p>
              Listings that mandate discriminatory, harassing, or unlawful exclusions based on religion, caste, gender, or orientation are strictly prohibited on Homiq and subject to immediate removal and audit action.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
