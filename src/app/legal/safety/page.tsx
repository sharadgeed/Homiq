import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, ArrowLeft, CheckCircle2, Lock, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SafetyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="homiq-container" style={{ padding: '3rem 1.25rem', maxWidth: '840px', flex: 1 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Safety & Fraud Prevention Protocols
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          How Homiq protects room seekers, tenants, and property owners from scams, fake listings, and unauthorized intermediaries.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #b91c1c' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#b91c1c', marginBottom: '0.5rem' }}>
              Warning: Common Rental Scams in Indian Metros
            </h3>
            <ul style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li><strong>The "Army Officer / Transfer" Imposter Scam:</strong> Scammers claiming to be defense personnel or customs officers who demand a "Gate Pass" or "Visiting Fee" via QR code before showing the flat. <em>Never send money to view a property. Viewings on Homiq are completely free.</em></li>
              <li><strong>Fake Electricity Bill / Registry:</strong> Imposters stealing photos of real apartments from social media. Look for the "Verified Home" badge on Homiq where physical title documents were inspected.</li>
              <li><strong>Bait-and-Switch Brokerage:</strong> Quoting low rent online and later demanding unmentioned 1-month brokerage. Homiq strictly displays brokerage upfront or flags listings as Zero Brokerage.</li>
            </ul>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Homiq's Safety Verification Measures
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem', color: '#475569' }}>
              <div>
                <strong>Aadhaar / DigiLocker Verification:</strong><br />
                Identity verification prevents anonymous abusive actors.
              </div>
              <div>
                <strong>Property Tax & Utility Verification:</strong><br />
                Owners upload current electricity bills or municipal property tax receipts.
              </div>
              <div>
                <strong>RERA Broker Accreditation:</strong><br />
                Real estate brokers must disclose state RERA credentials.
              </div>
              <div>
                <strong>24-Hour Moderation Triage:</strong><br />
                Every user report is audited by our human compliance staff.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
