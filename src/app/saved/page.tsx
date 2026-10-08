'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Scale, ArrowLeft, Trash2, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import ListingCard from '@/components/ListingCard';
import { Listing } from '@/lib/types';

export default function SavedListingsPage() {
  const router = useRouter();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = () => {
    setLoading(true);
    fetch('/api/saved')
      .then(res => {
        if (res.status === 401) {
          router.push('/auth/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data?.saved) setSavedListings(data.saved);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleToggleSave = (id: string, isSaved: boolean) => {
    if (!isSaved) {
      setSavedListings(prev => prev.filter(l => l.id !== id));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      <main className="homiq-container" style={{ padding: '2.5rem 1.25rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Heart size={24} color="#ef4444" fill="#ef4444" />
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Your Saved Accommodations
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Keep track of shortlisted homes, compare upfront costs, or schedule viewings.
            </p>
          </div>

          {savedListings.length >= 2 && (
            <Link
              href={`/compare?ids=${savedListings.map(l => l.id).slice(0, 4).join(',')}`}
              className="btn btn-accent btn-sm"
            >
              <Scale size={16} /> Compare All ({savedListings.length})
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Loading your wishlist...
          </div>
        ) : savedListings.length === 0 ? (
          <div className="card" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <Heart size={36} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No saved listings yet</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Browse apartments, private rooms, and PGs, then click the heart icon to save them for easy comparison.
            </p>
            <Link href="/search" className="btn btn-primary">
              <Search size={16} /> Explore Available Homes
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {savedListings.map(item => (
              <ListingCard
                key={item.id}
                listing={item}
                isSavedInitial={true}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
