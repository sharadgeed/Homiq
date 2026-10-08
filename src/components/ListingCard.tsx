'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, CheckCircle2, Clock, Bed, Bath, Sparkles, Shield, MapPin, IndianRupee, Scale } from 'lucide-react';
import { Listing, calculateCosts } from '@/lib/types';
import { formatINR } from '@/lib/api-response';

interface ListingCardProps {
  listing: Listing;
  isSavedInitial?: boolean;
  onToggleSave?: (id: string, saved: boolean) => void;
  showCompareToggle?: boolean;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (id: string) => void;
}

export default function ListingCard({
  listing,
  isSavedInitial = false,
  onToggleSave,
  showCompareToggle = false,
  isSelectedForCompare = false,
  onToggleCompare,
}: ListingCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const costs = calculateCosts(listing);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;

    try {
      setSaving(true);
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
        if (onToggleSave) onToggleSave(listing.id, data.saved);
      } else if (res.status === 401) {
        router.push('/auth/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getFreshnessLabel = () => {
    if (!listing.availabilityConfirmedAt) return 'Availability pending confirmation';
    const confirmed = new Date(listing.availabilityConfirmedAt);
    const diffHours = Math.floor((Date.now() - confirmed.getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return 'Available • Confirmed today';
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Available • Confirmed yesterday';
    return `Available • Confirmed ${diffDays}d ago`;
  };

  const propertyTypeLabel = {
    flat: 'Apartment / Flat',
    room: 'Private Room',
    pg: 'PG & Co-Living',
    hostel: 'Hostel',
    guesthouse: 'Guest House',
  }[listing.propertyType] || listing.propertyType;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Image & Badges */}
      <div style={{ position: 'relative', width: '100%', height: '220px', background: '#cbd5e1', overflow: 'hidden' }}>
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {listing.verifiedListing && (
            <span className="badge badge-verified">
              <CheckCircle2 size={12} />
              <span>Verified Home</span>
            </span>
          )}
          {listing.brokerageAmount === 0 ? (
            <span className="badge badge-zero-brokerage">Zero Brokerage</span>
          ) : (
            <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
              Broker Fee: {formatINR(listing.brokerageAmount)}
            </span>
          )}
        </div>

        {/* Save Wishlist Button */}
        <button
          onClick={toggleSave}
          title={isSaved ? 'Remove from saved' : 'Save to wishlist'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Heart size={18} color={isSaved ? '#ef4444' : '#64748b'} fill={isSaved ? '#ef4444' : 'none'} />
        </button>

        {/* Freshness Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          color: '#e2e8f0',
          padding: '0.35rem 0.75rem',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span>{getFreshnessLabel()}</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Type & Location */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {propertyTypeLabel}
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <MapPin size={13} />
            <span>{listing.neighbourhood}, {listing.city}</span>
          </span>
        </div>

        {/* Title */}
        <Link href={`/listings/${listing.id}`}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {listing.title}
          </h3>
        </Link>

        {/* Specs Pill row */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          {listing.totalBedrooms > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f8fafc', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <Bed size={13} /> {listing.totalBedrooms} BHK
            </span>
          )}
          <span style={{ background: '#f8fafc', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', textTransform: 'capitalize' }}>
            {listing.furnishing.replace('_', ' ')}
          </span>
          {listing.foodIncluded && (
            <span style={{ background: '#ecfdf5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
              Meals Included
            </span>
          )}
        </div>

        {/* Transparent Cost Box */}
        <div style={{
          marginTop: 'auto',
          background: '#f8fafc',
          borderRadius: '8px',
          padding: '0.75rem',
          border: '1px solid #e2e8f0',
          marginBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Rent:</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatINR(listing.rentAmount)}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '0.35rem' }}>
            <span>Est. Total Upfront Move-in:</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>
              {formatINR(costs.totalUpfrontCost)}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <Link href={`/listings/${listing.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
            View Full Breakdown
          </Link>
          {showCompareToggle && onToggleCompare && (
            <button
              onClick={() => onToggleCompare(listing.id)}
              className={`btn btn-sm ${isSelectedForCompare ? 'btn-accent' : 'btn-secondary'}`}
              title="Add to compare matrix"
            >
              <Scale size={14} />
              <span>{isSelectedForCompare ? 'Selected' : 'Compare'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
