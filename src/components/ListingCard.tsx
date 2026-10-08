'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart, CheckCircle2, Clock, Bed, Bath, Sparkles, Shield,
  MapPin, IndianRupee, Scale, ChevronLeft, ChevronRight
} from 'lucide-react';
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
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const costs = calculateCosts(listing);
  const images = listing.images && listing.images.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'];

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

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const getFreshnessLabel = () => {
    if (!listing.availabilityConfirmedAt) return 'Pending confirmation';
    const confirmed = new Date(listing.availabilityConfirmedAt);
    const diffHours = Math.floor((Date.now() - confirmed.getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return 'Confirmed today';
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Confirmed yesterday';
    return `Confirmed ${diffDays}d ago`;
  };

  const propertyTypeLabel = {
    flat: 'Apartment',
    room: 'Private Room',
    pg: 'PG & Co-Living',
    hostel: 'Hostel',
    guesthouse: 'Guest House',
  }[listing.propertyType] || listing.propertyType;

  return (
    <div className="card card-hover listing-card-3d">
      {/* Image & Interactive Carousel */}
      <div className="card-image-wrapper">
        <img
          src={images[activeImgIndex]}
          alt={listing.title}
          loading="lazy"
          className="card-main-image"
        />

        {/* Image navigation controls for multi-photo listings */}
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="img-nav-btn prev" aria-label="Previous photo">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextImage} className="img-nav-btn next" aria-label="Next photo">
              <ChevronRight size={16} />
            </button>
            {/* Dots */}
            <div className="img-dots-bar">
              {images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`img-dot ${activeImgIndex === idx ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveImgIndex(idx); }}
                />
              ))}
            </div>
          </>
        )}

        {/* Top Badges */}
        <div className="top-badges-bar">
          {listing.verifiedListing ? (
            <span className="badge badge-verified shimmer-badge">
              <CheckCircle2 size={12} />
              <span>Verified Home</span>
            </span>
          ) : null}

          {listing.brokerageAmount === 0 ? (
            <span className="badge badge-zero-brokerage">Zero Brokerage</span>
          ) : (
            <span className="badge" style={{ background: 'rgba(255,255,255,0.9)', color: '#475569', backdropFilter: 'blur(4px)' }}>
              Broker Fee: {formatINR(listing.brokerageAmount)}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={toggleSave}
          title={isSaved ? 'Remove from saved' : 'Save to wishlist'}
          className={`wishlist-heart-btn ${isSaved ? 'saved' : ''}`}
          aria-label="Save listing"
        >
          <Heart
            size={18}
            color={isSaved ? '#ef4444' : '#475569'}
            fill={isSaved ? '#ef4444' : 'none'}
            style={{ transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
        </button>

        {/* Freshness Bar */}
        <div className="freshness-bar">
          <span className="freshness-indicator-dot" />
          <span>Available • {getFreshnessLabel()}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="card-body">
        {/* Category & Locality */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {propertyTypeLabel}
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <MapPin size={13} color="var(--primary)" />
            <span>{listing.neighbourhood}, {listing.city}</span>
          </span>
        </div>

        {/* Title */}
        <Link href={`/listings/${listing.id}`}>
          <h3 className="card-title">
            {listing.title}
          </h3>
        </Link>

        {/* Specs Pill Row */}
        <div className="specs-pill-row">
          {listing.totalBedrooms > 0 && (
            <span className="spec-pill">
              <Bed size={13} /> {listing.totalBedrooms} BHK
            </span>
          )}
          <span className="spec-pill" style={{ textTransform: 'capitalize' }}>
            {listing.furnishing.replace('_', ' ')}
          </span>
          {listing.foodIncluded && (
            <span className="spec-pill" style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0', fontWeight: 600 }}>
              Meals Included
            </span>
          )}
        </div>

        {/* Transparent Cost Box with 3D Border Glow */}
        <div className="card-cost-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Monthly Rent:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
              {formatINR(listing.rentAmount)}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '0.35rem' }}>
            <span>Total Move-in Upfront:</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>
              {formatINR(costs.totalUpfrontCost)}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto' }}>
          <Link href={`/listings/${listing.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, padding: '0.55rem 0.75rem' }}>
            View Full Breakdown
          </Link>
          {showCompareToggle && onToggleCompare && (
            <button
              onClick={() => onToggleCompare(listing.id)}
              className={`btn btn-sm ${isSelectedForCompare ? 'btn-accent' : 'btn-secondary'}`}
              style={{ padding: '0.55rem 0.75rem' }}
              title="Add to compare matrix"
            >
              <Scale size={14} />
              <span>{isSelectedForCompare ? 'Added' : 'Compare'}</span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .listing-card-3d {
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: var(--radius-lg);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
        }

        .listing-card-3d:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px -8px rgba(4, 78, 70, 0.2);
          border-color: #94a3b8;
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          background: #cbd5e1;
          overflow: hidden;
          border-top-left-radius: var(--radius-lg);
          border-top-right-radius: var(--radius-lg);
        }

        @media (max-width: 640px) {
          .card-image-wrapper {
            height: 210px;
          }
        }

        .card-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .listing-card-3d:hover .card-main-image {
          transform: scale(1.04);
        }

        .img-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          z-index: 3;
        }

        .img-nav-btn.prev { left: 8px; }
        .img-nav-btn.next { right: 8px; }

        .listing-card-3d:hover .img-nav-btn,
        @media (hover: none) {
          .img-nav-btn { opacity: 0.8; }
        }

        .img-dots-bar {
          position: absolute;
          bottom: 30px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 4px;
          z-index: 3;
        }

        .img-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .img-dot.active {
          width: 14px;
          border-radius: 4px;
          background: #ffffff;
        }

        .top-badges-bar {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          z-index: 2;
        }

        .wishlist-heart-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          z-index: 2;
          transition: transform 0.2s ease;
        }

        .wishlist-heart-btn:active {
          transform: scale(0.85);
        }

        .wishlist-heart-btn.saved {
          animation: heartPulse 0.3s ease;
        }

        .freshness-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%);
          backdrop-filter: blur(4px);
          color: #e2e8f0;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          z-index: 2;
        }

        .freshness-indicator-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
          box-shadow: 0 0 6px #22c55e;
        }

        .card-body {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.35;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.15s ease;
        }

        .card-title:hover {
          color: var(--primary);
        }

        .specs-pill-row {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 0.85rem;
          font-size: 0.78125rem;
          color: var(--text-secondary);
        }

        .spec-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #f8fafc;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .card-cost-box {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 10px;
          padding: 0.75rem 0.85rem;
          border: 1px solid #e2e8f0;
          margin-bottom: 0.85rem;
          transition: border-color 0.2s ease;
        }

        .listing-card-3d:hover .card-cost-box {
          border-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
