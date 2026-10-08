import React from 'react';
import Link from 'next/link';
import {
  Search, MapPin, ShieldCheck, IndianRupee, ArrowRight, CheckCircle2,
  Building, Heart, Sparkles, Clock, Compass, Users, Check, Zap, Eye
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import ListingCard from '@/components/ListingCard';
import { searchListings } from '@/lib/db/queries';

export default async function HomePage() {
  const { listings } = searchListings({ limit: 6 });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      {/* Hero Section with 3D Depth & Floating Elements */}
      <section className="hero-gradient">
        <div className="hero-pattern" />

        {/* 3D Floating Decorative Ambient Orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(4, 78, 70, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-5%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 83, 47, 0.2) 0%, rgba(4, 78, 70, 0) 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }} />

        <div className="homiq-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            {/* 3D Floating Pill Badge */}
            <div className="animate-float-3d" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#d1fae5',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 10px #34d399',
                  display: 'inline-block'
                }} />
                <span>India-Focused Rental Platform • Zero Hidden Move-in Costs</span>
              </div>
            </div>

            <h1 className="hero-title">
              Find Your Next Home in India <br />
              <span style={{
                background: 'linear-gradient(135deg, #fed7aa 0%, #fde047 50%, #fed7aa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                With 100% Transparent Costs
              </span>
            </h1>

            <p className="hero-subtitle" style={{ margin: '0 auto 2rem' }}>
              Compare flats, private rooms, PGs, and hostels by <strong>total upfront move-in deposits, confirmed availability, real commute times</strong>, and transparent house rules.
            </p>

            {/* Quick Metro City Select Ribbon (Thumb-friendly on mobile) */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <div className="pill-ribbon" style={{ justifyContent: 'center' }}>
                {[
                  { name: 'Bengaluru', sub: 'Koramangala, HSR, Indiranagar' },
                  { name: 'Mumbai', sub: 'Powai, Bandra, Andheri' },
                  { name: 'Delhi NCR', sub: 'Cyber City, Gurgaon' },
                  { name: 'Pune', sub: 'Hinjewadi, Kharadi' },
                  { name: 'Hyderabad', sub: 'Hitec City, Gachibowli' },
                ].map((item, idx) => (
                  <Link
                    key={item.name}
                    href={`/search?city=${encodeURIComponent(item.name)}`}
                    className={`pill-chip ${idx === 0 ? 'active' : ''}`}
                    style={{
                      background: idx === 0 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <MapPin size={12} color="#34d399" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3D Glassmorphic Hero Search Box */}
            <div className="hero-search-card" style={{ textAlign: 'left' }}>
              <form action="/search" method="GET">
                {/* Search Type Filter Tabs */}
                <div className="search-tabs">
                  <Link href="/search?propertyType=all" className="search-tab-btn active">
                    All Accommodations
                  </Link>
                  <Link href="/search?propertyType=flat" className="search-tab-btn">
                    Flats & Apartments
                  </Link>
                  <Link href="/search?propertyType=room" className="search-tab-btn">
                    Private Rooms
                  </Link>
                  <Link href="/search?propertyType=pg" className="search-tab-btn">
                    PG & Co-Living
                  </Link>
                  <Link href="/search?zeroBrokerage=true" className="search-tab-btn">
                    Zero Brokerage
                  </Link>
                </div>

                <div className="search-inputs-grid">
                  {/* City Selector */}
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      <MapPin size={12} color="var(--primary)" /> Target Metro
                    </label>
                    <select name="city" className="form-select" defaultValue="Bengaluru">
                      <option value="Bengaluru">Bengaluru (Bangalore)</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR (Gurgaon / Noida)</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="all">All Cities</option>
                    </select>
                  </div>

                  {/* Neighbourhood Search */}
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Locality / Tech Hub
                    </label>
                    <input
                      type="text"
                      name="search"
                      placeholder="e.g. Koramangala, Powai, HSR"
                      className="form-input"
                    />
                  </div>

                  {/* Accommodation Category */}
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Category
                    </label>
                    <select name="propertyType" className="form-select" defaultValue="all">
                      <option value="all">All Types</option>
                      <option value="flat">Full Flat / BHK</option>
                      <option value="room">Private Room</option>
                      <option value="pg">PG / Co-Living</option>
                      <option value="hostel">Hostel</option>
                    </select>
                  </div>

                  {/* Max Upfront Budget */}
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Max Rent / Mo
                    </label>
                    <select name="maxRent" className="form-select" defaultValue="50000">
                      <option value="15000">Up to ₹15,000</option>
                      <option value="25000">Up to ₹25,000</option>
                      <option value="35000">Up to ₹35,000</option>
                      <option value="50000">Up to ₹50,000</option>
                      <option value="100000">Above ₹50,000</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="btn btn-accent btn-lg"
                      style={{
                        height: '46px',
                        width: '100%',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.95rem',
                      }}
                    >
                      <Search size={18} />
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Value Pillars (Transparency, Availability, Commute, Tenancy) */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 0' }}>
        <div className="homiq-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {/* 1. Cost */}
            <div className="card-hover" style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', padding: '1rem', borderRadius: 'var(--radius-md)', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '0.65rem', borderRadius: '10px' }}>
                <IndianRupee size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem', color: '#0f172a' }}>Total Cost Transparency</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  See exact upfront move-in deposit, brokerage disclosures, maintenance, and food charges before visiting.
                </p>
              </div>
            </div>

            {/* 2. Availability */}
            <div className="card-hover" style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', padding: '1rem', borderRadius: 'var(--radius-md)', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.65rem', borderRadius: '10px' }}>
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem', color: '#0f172a' }}>Stamped Availability</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Zero ghost listings. Stamped confirmation dates show exactly when the host last reconfirmed vacant status.
                </p>
              </div>
            </div>

            {/* 3. Commute */}
            <div className="card-hover" style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', padding: '1rem', borderRadius: 'var(--radius-md)', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.65rem', borderRadius: '10px' }}>
                <Compass size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem', color: '#0f172a' }}>Metro & Transit Estimator</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Calculated walking and transit times to purple/green metro, BMTC, local trains, and IT tech corridors.
                </p>
              </div>
            </div>

            {/* 4. Mutual Condition */}
            <div className="card-hover" style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', padding: '1rem', borderRadius: 'var(--radius-md)', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.65rem', borderRadius: '10px' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem', color: '#0f172a' }}>Move-In Trust Checklist</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Protect your security deposit with dated photographic inventory checklists agreed upon by renter and host.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Accommodations (Interactive 3D Grid) */}
      <section className="homiq-section">
        <div className="homiq-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Housing Catalog
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                Accommodations in Top Indian Tech Hubs
              </h2>
            </div>
            <Link href="/search" className="btn btn-outline btn-sm">
              <span>View All 20+ Listings</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <Building size={32} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Accommodations Catalog Initializing</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Search across Bengaluru, Mumbai, Delhi NCR, Pune, and Hyderabad to explore transparent listings.
              </p>
              <Link href="/search" className="btn btn-primary btn-sm">Search All Metro Listings</Link>
            </div>
          ) : (
            <div className="grid-3">
              {listings.map(item => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 Role Workflows Callout Section */}
      <section style={{ background: '#f1f5f9', padding: '4.5rem 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="homiq-container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Built for Every Stakeholder
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              Tailored Portals For Your Rental Role
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Whether you are moving for a new job, renting your flat directly, managing a 100-bed PG facility, or providing professional advisory.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {/* Renter */}
            <div className="card card-hover" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#dcfce7', color: '#15803d', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Renters</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Search transparent homes, schedule live Google Meet tours, compare upfront costs side-by-side, and log mutual move-in condition photos.
              </p>
              <Link href="/search" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 'auto' }}>
                Browse Available Homes
              </Link>
            </div>

            {/* Landlord / Owner */}
            <div className="card card-hover" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#e0e7ff', color: '#4338ca', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Building size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Property Owners</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                List flats with 0% brokerage, 1-click reconfirm availability, screen verified renter inquiries, and maintain dated inventory records.
              </p>
              <Link href="/dashboard/owner" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 'auto' }}>
                Owner Portal
              </Link>
            </div>

            {/* PG / Co-Living Operator */}
            <div className="card card-hover" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#fef3c7', color: '#b45309', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Building size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For PG & Co-Living</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Manage room and bed inventory (single, twin, triple sharing), configure daily meal packages, and track resident maintenance requests.
              </p>
              <Link href="/dashboard/operator" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 'auto' }}>
                Operator Hub
              </Link>
            </div>

            {/* Broker */}
            <div className="card card-hover" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#fce7f3', color: '#be185d', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For RERA Brokers</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Operate with high trust: disclose RERA registration certificates, state representation mandates, and transparent fees upfront.
              </p>
              <Link href="/dashboard/broker" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 'auto' }}>
                Broker Desk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tenancy & Deposit Protection Protocol with 3D Depth Card */}
      <section className="homiq-section">
        <div className="homiq-container">
          <div style={{
            background: 'radial-gradient(circle at 10% 20%, rgba(13, 105, 95, 0.95) 0%, #044e46 60%, #033c36 100%)',
            borderRadius: 'var(--radius-xl)',
            color: '#fff',
            padding: 'clamp(2rem, 4vw + 1rem, 3.5rem) clamp(1.25rem, 3vw + 0.5rem, 2.5rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            boxShadow: '0 24px 50px -10px rgba(4, 78, 70, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
                Tenant & Landlord Trust Protocol
              </span>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw + 0.5rem, 2.4rem)', fontWeight: 800, margin: '1rem 0 1rem', lineHeight: 1.25 }}>
                Protecting Security Deposits with Photographic Verification
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#d1fae5', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Arbitrary deposit deductions at move-out are a major pain point across Indian cities. Homiq&apos;s mutual move-in condition record captures timestamped photos of wall paint, switches, appliances, and keys, preventing disputes when moving out.
              </p>
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <Link href="/legal/tenancy-guide" className="btn btn-accent btn-lg">
                  Read State Tenancy Guide
                </Link>
                <Link href="/search" className="btn btn-secondary btn-lg" style={{ background: '#fff', color: '#044e46' }}>
                  Explore Verified Homes
                </Link>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
            }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 color="#34d399" size={20} />
                <span>The Homiq Move-In Trust Protocol</span>
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#e2e8f0' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                  <span>Mutual 10-point electrical, plumbing, and meter reading checklist.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                  <span>Voluntary tenant & landlord digital sign-off with timestamped condition records.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                  <span>Mandatory RERA registration number disclosures for broker agents.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                  <span>Community moderation triage against misleading pricing and ghost listings.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
