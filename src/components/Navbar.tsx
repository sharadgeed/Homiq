'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, Search, Heart, Scale, PlusCircle, User, LogOut, Shield,
  Building2, Home, MapPin, ChevronRight, Phone, Sparkles
} from 'lucide-react';
import MobileTabBar from './MobileTabBar';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => {});
  }, [pathname]);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setDrawerOpen(false);
    router.push('/');
    router.refresh();
  };

  const getDashboardHref = () => {
    if (!user) return '/auth/login';
    switch (user.role) {
      case 'admin': return '/dashboard/admin';
      case 'operator': return '/dashboard/operator';
      case 'broker': return '/dashboard/broker';
      case 'owner': return '/dashboard/owner';
      default: return '/dashboard/renter';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Sign In';
    switch (user.role) {
      case 'admin': return 'Admin Panel';
      case 'operator': return 'Operator Hub';
      case 'broker': return 'Broker Hub';
      case 'owner': return 'Owner Portal';
      default: return 'My Dashboard';
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="homiq-container navbar-inner">
          {/* Brand Logo with 3D Box */}
          <Link href="/" className="brand-logo">
            <div className="brand-icon-box">H</div>
            <span>Homiq</span>
            <span className="brand-dot" />
            <span className="brand-country-tag">India</span>
          </Link>

          {/* Desktop Center Links */}
          <nav className="nav-links">
            <Link href="/search" className={`nav-link ${pathname === '/search' && !pathname.includes('propertyType=pg') ? 'active' : ''}`}>
              <Search size={16} />
              <span>Find Homes</span>
            </Link>
            <Link href="/search?propertyType=pg" className={`nav-link ${pathname.includes('propertyType=pg') ? 'active' : ''}`}>
              <Building2 size={16} />
              <span>PG & Co-Living</span>
            </Link>
            <Link href="/compare" className={`nav-link ${pathname === '/compare' ? 'active' : ''}`}>
              <Scale size={16} />
              <span>Compare</span>
            </Link>
            <Link href="/saved" className={`nav-link ${pathname === '/saved' ? 'active' : ''}`}>
              <Heart size={16} />
              <span>Saved</span>
            </Link>
            <Link href="/legal/tenancy-guide" className={`nav-link ${pathname.includes('tenancy-guide') ? 'active' : ''}`}>
              <Shield size={16} />
              <span>Tenancy Guide</span>
            </Link>
          </nav>

          {/* Desktop & Mobile Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Desktop Auth Buttons */}
            <div style={{ display: 'none', alignItems: 'center', gap: '0.65rem' }} className="desktop-actions">
              {user ? (
                <>
                  <Link href={getDashboardHref()} className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
                    <User size={15} />
                    <span>{getDashboardLabel()}</span>
                  </Link>
                  {['owner', 'operator', 'broker', 'admin'].includes(user.role) && (
                    <Link href="/listings/new" className="btn btn-primary btn-sm">
                      <PlusCircle size={15} />
                      <span>List Property</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm"
                    title="Sign Out"
                    style={{ padding: '0.45rem 0.65rem' }}
                  >
                    <LogOut size={15} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn-secondary btn-sm">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary btn-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="mobile-menu-btn"
              aria-label="Open Mobile Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* MOBILE SLIDE-OUT DRAWER */}
      {/* ================================================================ */}
      {drawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-drawer-content" onClick={e => e.stopPropagation()}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="brand-icon-box" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>H</div>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>Homiq</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ padding: '0.4rem', borderRadius: '50%', background: '#f1f5f9', color: '#64748b' }}
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile / Login Card */}
            <div style={{
              margin: '1.25rem 0',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: user ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)' : '#f8fafc',
              border: `1.5px solid ${user ? '#a7f3d0' : '#e2e8f0'}`,
            }}>
              {user ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}>
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>
                        {user.role} • {user.verificationStatus === 'verified' ? 'Verified Member' : 'Pending Verification'}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={getDashboardHref()}
                    className="btn btn-primary btn-sm btn-full"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Open {getDashboardLabel()}
                  </Link>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                    Welcome to Homiq India
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.85rem' }}>
                    Transparent rentals with verified hosts
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <Link href="/auth/login" className="btn btn-secondary btn-sm">
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="btn btn-primary btn-sm">
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick City Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Select City
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad'].map(city => (
                  <Link
                    key={city}
                    href={`/search?city=${encodeURIComponent(city)}`}
                    className="pill-chip"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                  >
                    <MapPin size={11} color="var(--primary)" />
                    <span>{city}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
              <Link href="/search" className="nav-link" style={{ padding: '0.7rem 0.5rem', fontSize: '0.95rem' }}>
                <Search size={18} color="var(--primary)" />
                <span>Find Accommodation</span>
              </Link>
              <Link href="/search?propertyType=pg" className="nav-link" style={{ padding: '0.7rem 0.5rem', fontSize: '0.95rem' }}>
                <Building2 size={18} color="var(--primary)" />
                <span>PG & Co-Living Spaces</span>
              </Link>
              <Link href="/search?zeroBrokerage=true" className="nav-link" style={{ padding: '0.7rem 0.5rem', fontSize: '0.95rem' }}>
                <Sparkles size={18} color="var(--gold)" />
                <span>Zero Brokerage Homes</span>
              </Link>
              <Link href="/compare" className="nav-link" style={{ padding: '0.7rem 0.5rem', fontSize: '0.95rem' }}>
                <Scale size={18} color="var(--primary)" />
                <span>Compare Listings Side-by-Side</span>
              </Link>
              <Link href="/saved" className="nav-link" style={{ padding: '0.7rem 0.5rem', fontSize: '0.95rem' }}>
                <Heart size={18} color="#ef4444" />
                <span>Saved Wishlist</span>
              </Link>
              <Link href="/legal/tenancy-guide" className="nav-link" style={{ padding: '0.7rem 0.5rem', fontSize: '0.95rem' }}>
                <Shield size={18} color="var(--primary)" />
                <span>Tenancy Rights & MTA Guide</span>
              </Link>
            </nav>

            {/* Host CTA */}
            {user && ['owner', 'operator', 'broker', 'admin'].includes(user.role) ? (
              <Link
                href="/listings/new"
                className="btn btn-accent btn-full"
                style={{ marginTop: '1.25rem', padding: '0.8rem' }}
              >
                <PlusCircle size={18} />
                <span>List New Property</span>
              </Link>
            ) : (
              <div style={{
                marginTop: '1.25rem',
                background: '#f8fafc',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>Are you a Landlord or PG Operator?</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>List directly with verified renters</div>
                <Link href="/auth/register" className="btn btn-outline btn-sm btn-full">
                  Post Accommodation Free
                </Link>
              </div>
            )}

            {/* Logout button if authenticated */}
            {user && (
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-full"
                style={{ marginTop: '0.75rem', color: 'var(--danger)' }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar */}
      <MobileTabBar />

      <style jsx>{`
        @media (min-width: 993px) {
          .desktop-actions {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
