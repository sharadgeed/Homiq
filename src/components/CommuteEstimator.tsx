'use client';

import React, { useState } from 'react';
import { Navigation, Bike, Car, Train, Clock, MapPin, AlertCircle } from 'lucide-react';

interface CommuteEstimatorProps {
  listingLat: number;
  listingLng: number;
  city: string;
  neighbourhood: string;
}

// Popular destination hubs by Indian tech metros
const TECH_HUBS_BY_CITY: Record<string, Array<{ name: string; lat: number; lng: number }>> = {
  bengaluru: [
    { name: 'Manyata Tech Park, Nagavara', lat: 13.0487, lng: 77.6214 },
    { name: 'Embassy GolfLinks (EGL), Domlur', lat: 12.9515, lng: 77.6477 },
    { name: 'RMZ Ecoworld & Ecospace, Bellandur', lat: 12.9238, lng: 77.6835 },
    { name: 'Electronic City Phase 1 (Infosys/Wipro)', lat: 12.8399, lng: 77.6770 },
    { name: 'ITPL & Brigade Tech Park, Whitefield', lat: 12.9866, lng: 77.7317 },
  ],
  mumbai: [
    { name: 'Bandra-Kurla Complex (BKC)', lat: 19.0657, lng: 72.8687 },
    { name: 'NESCO IT Park & Goregaon East', lat: 19.1553, lng: 72.8554 },
    { name: 'Hiranandani Business Park & IIT Bombay, Powai', lat: 19.1197, lng: 72.9051 },
    { name: 'Mindspace IT Park, Malad West', lat: 19.1866, lng: 72.8354 },
  ],
  'delhi ncr': [
    { name: 'DLF Cyber City & Cyber Hub, Gurgaon', lat: 28.4907, lng: 77.0898 },
    { name: 'Sector 62 IT Hub, Noida', lat: 28.6256, lng: 77.3734 },
    { name: 'Golf Course Road, DLF Phase 5', lat: 28.4485, lng: 77.1026 },
    { name: 'Connaught Place (Central Delhi)', lat: 28.6315, lng: 77.2167 },
  ],
  pune: [
    { name: 'Hinjewadi IT Park (Phase 1 to 3)', lat: 18.5913, lng: 73.7389 },
    { name: 'Magarpatta Cybercity, Hadapsar', lat: 18.5147, lng: 73.9295 },
    { name: 'EON Free Zone, Kharadi', lat: 18.5529, lng: 73.9515 },
  ],
  hyderabad: [
    { name: 'Hitec City Cyber Towers', lat: 17.4504, lng: 78.3808 },
    { name: 'Financial District, Gachibowli', lat: 17.4156, lng: 78.3424 },
    { name: 'Mindspace Madhapur IT Park', lat: 17.4411, lng: 78.3871 },
  ],
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function CommuteEstimator({ listingLat, listingLng, city, neighbourhood }: CommuteEstimatorProps) {
  const normalizedCity = city.toLowerCase();
  const hubs = TECH_HUBS_BY_CITY[normalizedCity] || TECH_HUBS_BY_CITY['bengaluru'];

  const [selectedHubIndex, setSelectedHubIndex] = useState(0);
  const [customDestination, setCustomDestination] = useState('');

  const currentHub = hubs[selectedHubIndex] || hubs[0];
  const distanceKm = calculateDistanceKm(listingLat, listingLng, currentHub.lat, currentHub.lng);

  // Estimates factoring realistic Indian urban traffic
  const bikeTimeMins = Math.round(distanceKm * 2.8 + 5);
  const cabTimeMins = Math.round(distanceKm * 3.8 + 10);
  const metroTimeMins = Math.max(15, Math.round(distanceKm * 2.1 + 8));

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Navigation size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Office & College Commute Estimator</h3>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Estimate your daily door-to-door transit time from {neighbourhood} to major corporate tech parks or campuses:
      </p>

      {/* Hub Select */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="form-label">Select Destination Campus / Hub in {city}:</label>
        <select
          className="form-select"
          value={selectedHubIndex}
          onChange={(e) => setSelectedHubIndex(Number(e.target.value))}
        >
          {hubs.map((hub, idx) => (
            <option key={hub.name} value={idx}>{hub.name}</option>
          ))}
        </select>
      </div>

      {/* Commute Mode Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {/* Bike / 2-Wheeler */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#044e46' }}>
            <Bike size={20} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Two-Wheeler / Bike</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
            ~{bikeTimeMins} mins
          </div>
          <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>Fastest in traffic</div>
        </div>

        {/* Metro / Rapid Transit */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#15803d' }}>
            <Train size={20} />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#166534' }}>Metro + Feeder</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#14532d', margin: '0.2rem 0' }}>
            ~{metroTimeMins} mins
          </div>
          <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>Predictable schedule</div>
        </div>

        {/* Cab / Auto */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#d97706' }}>
            <Car size={20} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cab / Auto (Peak)</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
            ~{cabTimeMins} mins
          </div>
          <div style={{ fontSize: '0.7rem', color: '#b45309' }}>Subject to ORR congestion</div>
        </div>
      </div>

      {/* Disclaimer on estimate accuracy */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.6rem 0.85rem', borderRadius: '6px' }}>
        <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
        <span>
          Straight line distance: <strong>{distanceKm} km</strong>. Times are peak-hour estimates calculated using average corridor speeds (Bengaluru/Mumbai peak traffic factors applied). Actual times may vary based on weather and route.
        </span>
      </div>
    </div>
  );
}
