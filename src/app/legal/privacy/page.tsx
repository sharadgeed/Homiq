import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, Trash2, EyeOff } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="homiq-container" style={{ padding: '3rem 1.25rem', maxWidth: '840px', flex: 1 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Privacy Policy & Data Retention
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Our commitments under the Digital Personal Data Protection Act (DPDP Act 2023) of India.
        </p>

        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.7 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              1. Non-Exposure of Exact Residential Addresses & Contact Data
            </h3>
            <p>
              To protect the privacy of current residents and individual landlords, public listing pages on Homiq display only approximate neighbourhood locations and nearby transit pins. Exact apartment numbers, building names, and phone numbers are shared solely after an in-person or video viewing appointment is accepted by both parties.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              2. Sensitive Identity Document Protection
            </h3>
            <p>
              Homiq does not store raw Aadhaar numbers or biometric information. Government identity verification is performed via secure DigiLocker API gateways and masked document previews. Verification files are encrypted at rest with AES-256 and purged following compliance review.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              3. Data Retention & Account Deletion
            </h3>
            <p>
              Users may request immediate account deletion and data export at any time. Rental transaction records and audit logs are retained strictly for the statutory duration required under Indian taxation and real estate record-keeping laws.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
