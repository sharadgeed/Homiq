'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Building2, Scale, Heart, User } from 'lucide-react';

export default function MobileTabBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => {});
  }, [pathname]);

  const getAccountHref = () => {
    if (!user) return '/auth/login';
    switch (user.role) {
      case 'admin': return '/dashboard/admin';
      case 'operator': return '/dashboard/operator';
      case 'broker': return '/dashboard/broker';
      case 'owner': return '/dashboard/owner';
      default: return '/dashboard/renter';
    }
  };

  const isHome = pathname === '/';
  const isSearch = pathname === '/search' && !pathname.includes('propertyType=pg');
  const isPg = pathname.includes('propertyType=pg');
  const isCompare = pathname.startsWith('/compare');
  const isSaved = pathname.startsWith('/saved');
  const isAccount = pathname.startsWith('/dashboard') || pathname.startsWith('/auth');

  return (
    <nav className="mobile-tab-bar" aria-label="Mobile Navigation Bar">
      <Link href="/" className={`mobile-tab-item ${isHome ? 'active' : ''}`}>
        {isHome && <span className="mobile-tab-active-dot" />}
        <Home size={20} strokeWidth={isHome ? 2.5 : 2} />
        <span>Explore</span>
      </Link>

      <Link href="/search" className={`mobile-tab-item ${isSearch ? 'active' : ''}`}>
        {isSearch && <span className="mobile-tab-active-dot" />}
        <Search size={20} strokeWidth={isSearch ? 2.5 : 2} />
        <span>Search</span>
      </Link>

      <Link href="/search?propertyType=pg" className={`mobile-tab-item ${isPg ? 'active' : ''}`}>
        {isPg && <span className="mobile-tab-active-dot" />}
        <Building2 size={20} strokeWidth={isPg ? 2.5 : 2} />
        <span>PGs</span>
      </Link>

      <Link href="/compare" className={`mobile-tab-item ${isCompare ? 'active' : ''}`}>
        {isCompare && <span className="mobile-tab-active-dot" />}
        <Scale size={20} strokeWidth={isCompare ? 2.5 : 2} />
        <span>Compare</span>
      </Link>

      <Link href="/saved" className={`mobile-tab-item ${isSaved ? 'active' : ''}`}>
        {isSaved && <span className="mobile-tab-active-dot" />}
        <Heart size={20} strokeWidth={isSaved ? 2.5 : 2} />
        <span>Saved</span>
      </Link>

      <Link href={getAccountHref()} className={`mobile-tab-item ${isAccount ? 'active' : ''}`}>
        {isAccount && <span className="mobile-tab-active-dot" />}
        <User size={20} strokeWidth={isAccount ? 2.5 : 2} />
        <span>{user ? 'Account' : 'Sign In'}</span>
      </Link>
    </nav>
  );
}
