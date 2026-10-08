'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';
import { Listing, NeighbourhoodFacility } from '@/lib/types';
import { formatINR } from '@/lib/api-response';

interface InteractiveMapProps {
  latitude?: number;
  longitude?: number;
  publicLocation?: string;
  facilities?: NeighbourhoodFacility[];
  city?: string;
  neighbourhood?: string;
  listings?: Listing[];
}

export default function InteractiveMap({
  latitude = 12.9716,
  longitude = 77.5946,
  publicLocation = 'Central Tech Corridor',
  facilities = [],
  city = 'Bengaluru',
  neighbourhood = 'Central',
  listings,
}: InteractiveMapProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(listings && listings.length > 0 ? listings[0] : null);

  // If listings provided: Multi-listing map view (for search page)
  if (listings && listings.length > 0) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', borderRadius: '12px', overflow: 'hidden', background: '#e2e8f0' }}>
        {/* Map Canvas Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, #e0f2fe 0%, #f0fdf4 60%, #f1f5f9 100%)',
        }} />

        {/* Decorative Grid Roads */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.8 }}>
          <path d="M 0 160 Q 200 120 400 160 T 800 140" stroke="#cbd5e1" strokeWidth="16" fill="none" />
          <path d="M 0 160 Q 200 120 400 160 T 800 140" stroke="#ffffff" strokeWidth="10" fill="none" />
          <path d="M 300 0 L 320 600" stroke="#cbd5e1" strokeWidth="12" fill="none" />
          <path d="M 300 0 L 320 600" stroke="#ffffff" strokeWidth="8" fill="none" />
          <path d="M 100 80 L 650 480" stroke="#fed7aa" strokeWidth="10" fill="none" />
          <path d="M 100 80 L 650 480" stroke="#ffffff" strokeWidth="6" fill="none" />
        </svg>

        {/* Top Info Banner */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(8px)',
          padding: '0.45rem 0.85rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--primary)',
        }}>
          <MapPin size={16} />
          <span>Showing {listings.length} verified pins across {city}</span>
        </div>

        {/* Interactive Listing Price Pins */}
        {listings.map((item, idx) => {
          // Calculate dispersed positions across map container
          const pinPositions = [
            { top: '35%', left: '42%' },
            { top: '55%', left: '60%' },
            { top: '25%', left: '70%' },
            { top: '65%', left: '30%' },
            { top: '45%', left: '20%' },
            { top: '75%', left: '50%' },
          ];
          const pos = pinPositions[idx % pinPositions.length];
          const isSelected = selectedListing?.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedListing(item)}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 20 : 10,
                cursor: 'pointer',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div style={{
                background: isSelected ? 'var(--accent)' : 'var(--primary)',
                color: '#ffffff',
                padding: '0.35rem 0.65rem',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '0.8125rem',
                boxShadow: isSelected ? '0 6px 18px rgba(217, 83, 47, 0.45)' : '0 4px 12px rgba(4, 78, 70, 0.3)',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                whiteSpace: 'nowrap',
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
              }}>
                <span>{formatINR(item.rentAmount)}</span>
                {item.verifiedListing && <CheckCircle2 size={12} color="#4ade80" />}
              </div>
            </div>
          );
        })}

        {/* Selected Listing Floating Preview Card (Mobile & Desktop) */}
        {selectedListing && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            maxWidth: '380px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            padding: '0.85rem',
            boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
            zIndex: 25,
            display: 'flex',
            gap: '0.85rem',
            alignItems: 'center',
          }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#cbd5e1' }}>
              <img
                src={selectedListing.images[0]}
                alt={selectedListing.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {selectedListing.propertyType} • {selectedListing.neighbourhood}
              </div>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.25,
                margin: '0.2rem 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {selectedListing.title}
              </h4>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatINR(selectedListing.rentAmount)}
                <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#64748b' }}>/mo</span>
              </div>
            </div>
            <Link
              href={`/listings/${selectedListing.id}`}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem' }}
            >
              View
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Single-Listing view (for listing details page)
  const filteredFacilities = activeCategory === 'all'
    ? facilities
    : facilities.filter(f => f.category === activeCategory);

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={20} color="var(--primary)" />
            <span>Approximate Location & Neighbourhood Hubs</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Exact building address is shared once in-person viewing is scheduled for resident security.
          </p>
        </div>

        <span className="badge badge-fresh" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <ShieldCheck size={13} />
          <span>Privacy Protected Pin</span>
        </span>
      </div>

      {/* Map Graphic Canvas / OpenStreetMap Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '320px',
        background: '#e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #cbd5e1',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #f8fafc 100%)',
          opacity: 0.85,
        }} />

        {/* Decorative Grid Roads */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M 0 160 Q 200 120 400 160 T 800 140" stroke="#cbd5e1" strokeWidth="14" fill="none" />
          <path d="M 0 160 Q 200 120 400 160 T 800 140" stroke="#ffffff" strokeWidth="10" fill="none" />
          <path d="M 300 0 L 320 320" stroke="#cbd5e1" strokeWidth="10" fill="none" />
          <path d="M 300 0 L 320 320" stroke="#ffffff" strokeWidth="8" fill="none" />
          <path d="M 150 50 L 550 280" stroke="#fed7aa" strokeWidth="8" fill="none" />
        </svg>

        {/* Center Property Radar Pin */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}>
          {/* Radar ripple */}
          <div style={{
            position: 'absolute',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'rgba(4, 78, 70, 0.15)',
            border: '2px solid rgba(4, 78, 70, 0.4)',
            animation: 'pulseGlow 2s infinite ease-out',
          }} />

          <div style={{
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            border: '3px solid #fff',
          }}>
            <MapPin size={22} />
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#fff',
            padding: '0.3rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginTop: '0.5rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {publicLocation}
          </div>
        </div>
      </div>

      {/* Facilities Tabs */}
      {facilities && facilities.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
            {['all', 'transit', 'tech_park', 'hospital', 'grocery'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {filteredFacilities.map(f => (
              <div
                key={f.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8125rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{f.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'capitalize' }}>
                    {f.category.replace('_', ' ')} • {f.commuteMode}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{f.travelTimeMins} mins</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{f.distanceKm} km</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
