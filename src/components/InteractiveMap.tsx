'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ShieldCheck } from 'lucide-react';
import { NeighbourhoodFacility } from '@/lib/types';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  publicLocation: string;
  facilities?: NeighbourhoodFacility[];
  city: string;
  neighbourhood: string;
}

export default function InteractiveMap({
  latitude,
  longitude,
  publicLocation,
  facilities = [],
  city,
  neighbourhood,
}: InteractiveMapProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

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
        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
        backgroundSize: '20px 20px, 40px 40px, 40px 40px',
      }}>
        {/* OpenStreetMap Tile background iframe or interactive canvas representation */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #f8fafc 100%)',
          opacity: 0.85
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
            marginTop: '0.4rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
          }}>
            {publicLocation}
          </div>
        </div>

        {/* Map UI Overlay controls */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          padding: '0.4rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.7rem',
          color: '#475569',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}>
          GPS: {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E • OpenStreetMap
        </div>
      </div>

      {/* Facilities Categories Filter */}
      {facilities.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Places' },
              { id: 'transit', label: 'Transit & Metro' },
              { id: 'tech_park', label: 'Tech Parks' },
              { id: 'grocery', label: 'Daily Needs' },
              { id: 'hospital', label: 'Hospitals' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Facilities list grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.65rem' }}>
            {filteredFacilities.map((fac, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8125rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{fac.name}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {fac.category.replace('_', ' ')} • {fac.commuteMode}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{fac.distanceKm} km</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>~{fac.travelTimeMins} mins</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
