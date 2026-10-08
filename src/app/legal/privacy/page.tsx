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
              Homiq does not collect raw, unmasked Aadhaar numbers or biometric information. Users submitting verification proofs are instructed to provide masked documents where personal identifier digits are redacted. Files uploaded for verification are accessible strictly to authorized compliance staff. Full automated DigiLocker and document verification integrations remain subject to regulatory licensing and partner onboarding.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              3. Data Rights, Export & Account Erasure (DPDP Act 2023)
            </h3>
            <p>
              Under India's Digital Personal Data Protection Act (DPDP Act 2023), registered users have the right to review, export, and request erasure of their personal data. Self-service data export is accessible via <code>/api/user/export</code> and account deletion via <code>/api/user/delete</code>. Upon an erasure request, personal identifiable records are redacted or anonymized, while statutory audit logs and transaction dispute histories are retained for applicable legal periods.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              4. Privacy Desk & Grievance Redressal
            </h3>
            <p>
              For privacy inquiries, data rectification, or regulatory grievances, contact Homiq's Data Protection Desk at <a href="mailto:privacy@homiq.in" style={{ color: 'var(--primary)', fontWeight: 600 }}>privacy@homiq.in</a>. All privacy requests are acknowledged within statutory Indian timelines.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
