import React from 'react';
import Link from 'next/link';
import { Shield, MapPin, IndianRupee, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="homiq-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>
              <div style={{ background: '#044e46', color: '#fff', borderRadius: '8px', padding: '0.2rem 0.6rem', border: '1px solid #0d695f' }}>H</div>
              <span>Homiq</span>
              <span style={{ fontSize: '0.75rem', background: '#d9532f', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>India</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '1.25rem' }}>
              The trustworthy accommodation platform for people moving to India's top tech hubs and metros. Transparent total costs, confirmed availability, and zero hidden surprises.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#34d399', alignItems: 'center' }}>
              <CheckCircle2 size={16} />
              <span>RERA Disclosures & Stamped Availability Status</span>
            </div>
          </div>

          {/* Top Tech Metros */}
          <div>
            <h4 className="footer-heading">Major Tech Hubs</h4>
            <ul className="footer-links">
              <li><Link href="/search?city=Bengaluru" className="footer-link">Bengaluru (Koramangala, HSR, Indiranagar, Whitefield)</Link></li>
              <li><Link href="/search?city=Mumbai" className="footer-link">Mumbai (Powai, Andheri, Bandra, BKC)</Link></li>
              <li><Link href="/search?city=Delhi NCR" className="footer-link">Delhi NCR (Cyber City Gurgaon, Noida Sector 62)</Link></li>
              <li><Link href="/search?city=Pune" className="footer-link">Pune (Hinjewadi Phase 1-3, Viman Nagar)</Link></li>
              <li><Link href="/search?city=Hyderabad" className="footer-link">Hyderabad (Hitec City, Gachibowli, Madhapur)</Link></li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="footer-heading">Role Portals</h4>
            <ul className="footer-links">
              <li><Link href="/dashboard/renter" className="footer-link">Renter Hub & Move-in Records</Link></li>
              <li><Link href="/dashboard/owner" className="footer-link">Property Owner / Landlord Portal</Link></li>
              <li><Link href="/dashboard/operator" className="footer-link">PG & Co-Living Inventory Manager</Link></li>
              <li><Link href="/dashboard/broker" className="footer-link">Broker RERA Representation Desk</Link></li>
              <li><Link href="/dashboard/admin" className="footer-link">Platform Compliance & Moderation</Link></li>
            </ul>
          </div>

          {/* Transparency & Legal */}
          <div>
            <h4 className="footer-heading">Safety & Transparency</h4>
            <ul className="footer-links">
              <li><Link href="/legal/tenancy-guide" className="footer-link">State Tenancy Act Guide</Link></li>
              <li><Link href="/compare" className="footer-link">Cost Comparison Calculator</Link></li>
              <li><Link href="/legal/safety" className="footer-link">Fraud Prevention & Scam Warnings</Link></li>
              <li><Link href="/legal/terms" className="footer-link">Terms of Service & Broker Disclosures</Link></li>
              <li><Link href="/legal/privacy" className="footer-link">Privacy & Data Retention</Link></li>
            </ul>
          </div>
        </div>

        {/* State Tenancy Law Disclaimer mandated by prompt */}
        <div className="legal-advisory-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#f59e0b', fontWeight: 600 }}>
            <AlertTriangle size={15} />
            <span>Important Legal Guidance Disclaimer (State Tenancy Jurisdiction):</span>
          </div>
          <p>
            Rental laws and tenancy regulations across India are governed by individual State legislatures. While the Central Government released the Model Tenancy Act (MTA), it does not apply uniformly across all Indian states and only becomes binding where explicitly notified by State law (e.g. Karnataka Rent Control Act, Maharashtra Rent Control Act 1999, Delhi Rent Control Act). All legal guidelines, agreement templates, and deposit norms published on Homiq are purely educational and informational. Users must verify local municipal guidelines and execute registered rental agreements in compliance with applicable State laws.
          </p>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8125rem'
        }}>
          <div>© {new Date().getFullYear()} Homiq India. All rights reserved. • Electronic marketplace intermediary under IT Act 2000 §79.</div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8' }}>
            <span>INR (₹) Standard</span>
            <span>English / Pan-India Multi-Lingual Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
