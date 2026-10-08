import React from 'react';
import Link from 'next/link';
import { Search, MapPin, ShieldCheck, IndianRupee, ArrowRight, CheckCircle2, Building, Heart, Sparkles, Clock, Compass, Users } from 'lucide-react';
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

      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="hero-pattern" />
        <div className="homiq-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#d1fae5',
              marginBottom: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <ShieldCheck size={16} />
              <span>India's Trustworthy Rental Platform • Verified Landlords & Operators</span>
            </div>

            <h1 className="hero-title">
              Find Your Next Home in India <br />
              <span style={{ color: '#fed7aa' }}>With Zero Hidden Costs</span>
            </h1>

            <p className="hero-subtitle" style={{ margin: '0 auto 2.5rem' }}>
              Compare flats, private rooms, PGs, and hostels by <strong>total upfront move-in cost, confirmed availability, real commute times</strong>, and transparent house rules.
            </p>

            {/* Hero Location & Property Search Box */}
            <div className="hero-search-card" style={{ textAlign: 'left' }}>
              <form action="/search" method="GET">
                {/* Search Type Filter Tabs */}
                <div className="search-tabs">
                  <Link href="/search?propertyType=all" className="search-tab-btn active">
                    All Accommodation
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
                      <MapPin size={12} /> Target Metro
                    </label>
                    <select name="city" className="form-select" defaultValue="Bengaluru">
                      <option value="Bengaluru">Bengaluru (Bangalore)</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR (Gurgaon / Noida)</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
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

                  {/* Accommodation Type */}
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
                    <button type="submit" className="btn btn-accent btn-lg" style={{ height: '44px', width: '100%', marginTop: '1.25rem' }}>
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

      {/* Value Pillars (Transparency, Availability, Commute, Tenancy) */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 0' }}>
        <div className="homiq-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '0.65rem', borderRadius: '10px' }}>
                <IndianRupee size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Total Cost Transparency</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  See exact upfront move-in deposit, brokerage disclosures, maintenance, and food charges before you visit.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.65rem', borderRadius: '10px' }}>
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Confirmed Availability</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  No more ghost listings. Stamped confirmation dates show exactly when the landlord last validated vacant status.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.65rem', borderRadius: '10px' }}>
                <Compass size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Metro & Office Commute</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Interactive transit estimator for Bengaluru, Mumbai, Gurgaon, Pune, and Hyderabad tech corridors.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.65rem', borderRadius: '10px' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Condition Record & Checklist</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Protect your deposit with dated photographic move-in records agreed upon mutually by renter and owner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Accommodations */}
      <section className="homiq-section">
        <div className="homiq-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Handpicked & Title-Checked
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                Verified Homes in Top Indian Cities
              </h2>
            </div>
            <Link href="/search" className="btn btn-outline btn-sm">
              <span>View All Listings</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-3">
            {listings.map(item => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Role Workflows Callout Section */}
      <section style={{ background: '#f1f5f9', padding: '4.5rem 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="homiq-container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Built for Every Stakeholder
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              Tailored Workflows For Your Needs
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
              Whether you are moving for work, renting out your flat, managing a multi-floor PG, or running professional brokerage services.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {/* Renter */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ background: '#dcfce7', color: '#15803d', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Renters</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Search transparent homes, schedule live Google Meet tours, compare upfront costs side-by-side, and log move-in condition photos.
              </p>
              <Link href="/search" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Browse Available Homes
              </Link>
            </div>

            {/* Landlord / Owner */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ background: '#e0e7ff', color: '#4338ca', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Building size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Property Owners</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                List flats with 0% brokerage, 1-click reconfirm availability, screen verified renter inquiries, and maintain dated inventory records.
              </p>
              <Link href="/dashboard/owner" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Owner Portal
              </Link>
            </div>

            {/* PG / Co-Living Operator */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ background: '#fef3c7', color: '#b45309', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Building size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For PG & Co-Living Operators</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Manage room and bed-level inventory (single, double, triple sharing), configure daily meal plans, and track maintenance work orders.
              </p>
              <Link href="/dashboard/operator" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Operator Dashboard
              </Link>
            </div>

            {/* Broker */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ background: '#fce7f3', color: '#be185d', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For RERA Brokers</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Operate with full transparency: mandate RERA number disclosure, explicit owner representation status, and upfront fee transparency.
              </p>
              <Link href="/dashboard/broker" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Broker Desk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tenancy & Deposit Protection Guarantee */}
      <section className="homiq-section">
        <div className="homiq-container">
          <div style={{
            background: 'linear-gradient(135deg, #044e46 0%, #065f46 100%)',
            borderRadius: '24px',
            color: '#fff',
            padding: '3.5rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
                Tenant & Landlord Trust Protocol
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '1rem 0 1rem', lineHeight: 1.2 }}>
                Protecting Security Deposits with Photographic Verification
              </h2>
              <p style={{ fontSize: '1rem', color: '#d1fae5', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Arbitrary deposit deductions at move-out are a major pain point across Indian cities. Homiq's mutual move-in condition record captures timestamped photos of wall paint, switches, appliances, and keys, preventing disputes when moving out.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/legal/tenancy-guide" className="btn btn-accent btn-lg">
                  Read State Tenancy Guide
                </Link>
                <Link href="/search" className="btn btn-secondary btn-lg" style={{ background: '#fff', color: '#044e46' }}>
                  Explore Verified Homes
                </Link>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 color="#34d399" size={20} />
                <span>The Homiq Move-In Guarantee</span>
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                  <span>Mandatory 10-point electrical, plumbing & meter inspection.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                  <span>Direct landlord/renter digital sign-off before deposit transfer.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                  <span>RERA compliance checks on representative brokers.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                  <span>Proactive moderation triage against bait-and-switch listings.</span>
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
