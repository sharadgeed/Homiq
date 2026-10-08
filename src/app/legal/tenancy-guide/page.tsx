import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Building, Scale, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';

export default function TenancyGuidePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      <main className="homiq-container" style={{ padding: '3rem 1.25rem', maxWidth: '880px', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
            <ArrowLeft size={15} /> Back to Homiq
          </Link>
          <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
            Informational Guidance Only • Not Legal Counsel
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Indian Rental Accommodation & State Tenancy Laws Guide
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            A comprehensive breakdown of rental agreement execution, security deposit practices, notice periods, and how State laws govern tenancy in major Indian tech hubs.
          </p>
        </div>

        {/* State Tenancy Statutory Notice */}
        <div style={{ background: '#fffbeb', border: '1.5px solid #fef3c7', borderRadius: '12px', padding: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 700, marginBottom: '0.4rem' }}>
            <AlertTriangle size={20} />
            <span>CRITICAL STATUTORY NOTICE: State-Wise Jurisdiction in India</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#92400e', lineHeight: 1.6 }}>
            In India, Land and Housing are subjects governed under the State List (Seventh Schedule of the Constitution of India). While the Ministry of Housing and Urban Affairs circulated the <strong>Model Tenancy Act (MTA)</strong>, it serves solely as an advisory model framework. <strong>The Model Tenancy Act does not automatically apply uniformly across India.</strong> Tenancies are governed by the specific State statutes enacted or notified by respective State Assemblies (e.g. Karnataka, Maharashtra, Delhi, Telangana, Tamil Nadu).
          </p>
        </div>

        {/* State by State Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Karnataka */}
          <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #044e46' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              1. Karnataka (Bengaluru, Mysuru)
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Governing Law: Karnataka Rent Control Act & Karnataka Stamp Act
            </div>
            <ul style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li><strong>Deposit Norms:</strong> Traditionally landlords requested 5 to 10 months advance deposit. Under MTA recommendations, deposit limits are proposed at 2 months for residential premises, but customary market practice in Bangalore tech corridors (Koramangala, HSR, Bellandur) usually settles between 2 to 4 months through mutual negotiation.</li>
              <li><strong>Agreement & Stamp Duty:</strong> Agreements up to 11 months require e-stamping (typically ₹100 or ₹200 e-stamp paper plus notary). Tenancies exceeding 11 months mandate compulsory registration at the Sub-Registrar office.</li>
              <li><strong>Notice Period:</strong> Standard market practice stipulates 1 month written notice by either party.</li>
            </ul>
          </div>

          {/* Maharashtra */}
          <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #2563eb' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              2. Maharashtra (Mumbai, Pune)
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Governing Law: Maharashtra Rent Control Act, 1999 (Leave and License Framework)
            </div>
            <ul style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li><strong>Compulsory Registration:</strong> Unlike many other states, Section 55 of the Maharashtra Rent Control Act mandates compulsory registration of every Leave and License agreement, even for 11-month tenancies. Online biometric e-registration is widely used.</li>
              <li><strong>Police Verification:</strong> Police intimation / tenant verification is mandatory across Mumbai Police and Pune Police jurisdictions before move-in.</li>
              <li><strong>Deposit Practices:</strong> Deposits typically range from 2 to 3 months of license fee in Pune and Mumbai suburbs.</li>
            </ul>
          </div>

          {/* Delhi NCR */}
          <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #d97706' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              3. Delhi NCR (Delhi, Gurugram, Noida)
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Governing Law: Delhi Rent Control Act & Haryana / UP Tenancy Regulations
            </div>
            <ul style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li><strong>Security Deposit:</strong> Typically 1 to 2 months rent advance. Refund terms are strictly tied to settlement of electricity bills (DHBVN in Gurgaon, NPCL in Noida, BSES in Delhi).</li>
              <li><strong>Maintenance & Electricity:</strong> Power tariffs in high-rise societies in Gurgaon and Noida often include pre-paid smart meters or fixed dual-source DG generator power charges. Homiq requires landlords to disclose these separately.</li>
              <li><strong>Gated Society Rules:</strong> Residents' Welfare Associations (RWAs) enforce distinct move-in/move-out NOCs and non-refundable society shifting charges.</li>
            </ul>
          </div>

          {/* Best Practices for Renters & Landlords */}
          <div className="card" style={{ padding: '1.75rem', background: '#f8fafc' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              Homiq Deposit Protection Checklist
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem', color: '#475569' }}>
              <div>
                <strong>1. Mutual Inventory Handover:</strong><br />
                Always use Homiq's Move-In Condition recorder to photograph switchboards, meter readings, and wall paint on day 1.
              </div>
              <div>
                <strong>2. Electronic Transactions:</strong><br />
                Transfer token advances and monthly rent strictly via traceable bank transfers (NEFT/RTGS/UPI). Never pay cash advances.
              </div>
              <div>
                <strong>3. Sub-meter Verifications:</strong><br />
                Ensure initial reading of electricity and water meters are documented in the registered annexure.
              </div>
              <div>
                <strong>4. Lock-in Period Clarity:</strong><br />
                Explicitly check whether a lock-in period applies (usually 6 months in 11-month agreements) to prevent forfeiture of deposit.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
