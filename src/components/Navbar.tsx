'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Heart, Scale, PlusCircle, User, LogOut, Shield, Building2, Briefcase } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
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
    <header className="navbar">
      <div className="homiq-container navbar-inner">
        {/* Brand */}
        <Link href="/" className="brand-logo">
          <div style={{
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
          }}>
            H
          </div>
          <span>Homiq</span>
          <span className="brand-dot" />
          <span className="brand-country-tag">India</span>
        </Link>

        {/* Center Links */}
        <nav className="nav-links" style={{ display: 'flex' }}>
          <Link href="/search" className={`nav-link ${pathname === '/search' ? 'active' : ''}`}>
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

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
                style={{ padding: '0.4rem 0.6rem' }}
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
      </div>
    </header>
  );
}
