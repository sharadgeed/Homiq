'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, MapPin, Map, List, Scale, CheckCircle2, X, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import ListingCard from '@/components/ListingCard';
import InteractiveMap from '@/components/InteractiveMap';
import { Listing } from '@/lib/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search filter states
  const [city, setCity] = useState(searchParams.get('city') || 'Bengaluru');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'all');
  const [accommodationType, setAccommodationType] = useState(searchParams.get('accommodationType') || 'all');
  const [furnishing, setFurnishing] = useState(searchParams.get('furnishing') || 'all');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [maxTotalUpfront, setMaxTotalUpfront] = useState(searchParams.get('maxTotalUpfront') || '');
  const [zeroBrokerage, setZeroBrokerage] = useState(searchParams.get('zeroBrokerage') === 'true');
  const [foodIncluded, setFoodIncluded] = useState(searchParams.get('foodIncluded') === 'true');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verifiedOnly') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'availability_new');

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Compare selection tray
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const fetchResults = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (city && city !== 'all') params.set('city', city);
    if (searchQuery) params.set('search', searchQuery);
    if (propertyType && propertyType !== 'all') params.set('propertyType', propertyType);
    if (accommodationType && accommodationType !== 'all') params.set('accommodationType', accommodationType);
    if (furnishing && furnishing !== 'all') params.set('furnishing', furnishing);
    if (maxRent) params.set('maxRent', maxRent);
    if (maxTotalUpfront) params.set('maxTotalUpfront', maxTotalUpfront);
    if (zeroBrokerage) params.set('zeroBrokerage', 'true');
    if (foodIncluded) params.set('foodIncluded', 'true');
    if (verifiedOnly) params.set('verifiedOnly', 'true');
    if (sortBy) params.set('sortBy', sortBy);

    fetch(`/api/listings?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setListings(data.listings || []);
        setTotalCount(data.total || 0);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResults();
  }, [city, propertyType, accommodationType, furnishing, maxRent, maxTotalUpfront, zeroBrokerage, foodIncluded, verifiedOnly, sortBy]);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 listings simultaneously.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const openComparePage = () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 listings to compare side-by-side.');
      return;
    }
    router.push(`/compare?ids=${selectedForCompare.join(',')}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      {/* Top Search & Filter Bar */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
        <div className="homiq-container">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* City Selector */}
            <select
              className="form-select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: 'auto', minWidth: '160px', fontWeight: 600 }}
            >
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="all">All Cities</option>
            </select>

            {/* Keyword search input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search by neighbourhood (e.g. Koramangala, Powai, HSR, Cyber City)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchResults()}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            </div>

            <button onClick={fetchResults} className="btn btn-primary btn-sm" style={{ height: '40px' }}>
              Search
            </button>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', marginLeft: 'auto' }}>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}`}
                style={{ borderRadius: '6px', padding: '0.35rem 0.75rem' }}
              >
                <List size={16} />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : ''}`}
                style={{ borderRadius: '6px', padding: '0.35rem 0.75rem' }}
              >
                <Map size={16} />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="homiq-container" style={{ padding: '2rem 1.25rem', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Left Filter Sidebar */}
          <aside className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={16} color="var(--primary)" />
                <span>Filters</span>
              </h3>
              <button
                onClick={() => {
                  setPropertyType('all');
                  setAccommodationType('all');
                  setFurnishing('all');
                  setMaxRent('');
                  setMaxTotalUpfront('');
                  setZeroBrokerage(false);
                  setFoodIncluded(false);
                  setVerifiedOnly(false);
                }}
                style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}
              >
                Reset All
              </button>
            </div>

            <form onSubmit={handleApplyFilter}>
              {/* Category */}
              <div className="form-group">
                <label className="form-label">Accommodation Type</label>
                <select className="form-select" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="flat">Flats & Apartments</option>
                  <option value="room">Private Rooms</option>
                  <option value="pg">PG & Co-Living</option>
                  <option value="hostel">Hostels</option>
                </select>
              </div>

              {/* Occupancy */}
              <div className="form-group">
                <label className="form-label">Room Occupancy</label>
                <select className="form-select" value={accommodationType} onChange={e => setAccommodationType(e.target.value)}>
                  <option value="all">Any Occupancy</option>
                  <option value="entire_apartment">Entire Flat / House</option>
                  <option value="private_room">Private Single Room</option>
                  <option value="shared_room">Shared Room / Bed</option>
                </select>
              </div>

              {/* Furnishing */}
              <div className="form-group">
                <label className="form-label">Furnishing</label>
                <select className="form-select" value={furnishing} onChange={e => setFurnishing(e.target.value)}>
                  <option value="all">Any Furnishing</option>
                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              {/* Max Monthly Rent */}
              <div className="form-group">
                <label className="form-label">Max Monthly Rent (₹)</label>
                <select className="form-select" value={maxRent} onChange={e => setMaxRent(e.target.value)}>
                  <option value="">Any Rent</option>
                  <option value="12000">Up to ₹12,000</option>
                  <option value="20000">Up to ₹20,000</option>
                  <option value="30000">Up to ₹30,000</option>
                  <option value="45000">Up to ₹45,000</option>
                  <option value="70000">Up to ₹70,000</option>
                </select>
              </div>

              {/* Max Total Upfront Move-In Cost */}
              <div className="form-group">
                <label className="form-label">
                  Max Upfront Move-In Cost (₹)
                  <span title="Filters by sum of Security Deposit + First Month Rent + Brokerage" style={{ color: '#94a3b8', cursor: 'help' }}>ℹ</span>
                </label>
                <select className="form-select" value={maxTotalUpfront} onChange={e => setMaxTotalUpfront(e.target.value)}>
                  <option value="">Any Upfront Total</option>
                  <option value="40000">Under ₹40,000</option>
                  <option value="80000">Under ₹80,000</option>
                  <option value="120000">Under ₹1,20,000</option>
                  <option value="200000">Under ₹2,00,000</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: '1.25rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={zeroBrokerage}
                    onChange={e => setZeroBrokerage(e.target.checked)}
                  />
                  <span>Zero Brokerage Only (Direct Owner)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={foodIncluded}
                    onChange={e => setFoodIncluded(e.target.checked)}
                  />
                  <span>Food / Meals Included (PG/Co-Living)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={e => setVerifiedOnly(e.target.checked)}
                  />
                  <span>Verified Listings Only</span>
                </label>
              </div>
            </form>
          </aside>

          {/* Results Area */}
          <div>
            {/* Results Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Accommodations in {city === 'all' ? 'All Locations' : city}
                </h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Showing {listings.length} of {totalCount} verified options
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Sort by:</span>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ width: 'auto', fontSize: '0.8125rem' }}
                >
                  <option value="availability_new">Freshness (Confirmed Recently)</option>
                  <option value="rent_asc">Rent: Low to High</option>
                  <option value="rent_desc">Rent: High to Low</option>
                  <option value="cost_asc">Total Upfront Cost: Low to High</option>
                  <option value="rating">Top Rated by Renters</option>
                </select>
              </div>
            </div>

            {/* View Mode: Map vs List */}
            {viewMode === 'map' && listings.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <InteractiveMap
                  latitude={listings[0].latitude}
                  longitude={listings[0].longitude}
                  publicLocation={`${city} Metro Area`}
                  city={city}
                  neighbourhood="Major Tech Corridors"
                />
              </div>
            )}

            {/* Listings Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <RefreshCw size={32} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-muted)' }}>Loading transparent accommodations...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#94a3b8' }}>
                  <Search size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No matching listings found</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                  Try relaxing your rent or upfront cost filters, or search across all accommodation types.
                </p>
                <button
                  onClick={() => {
                    setPropertyType('all');
                    setAccommodationType('all');
                    setMaxRent('');
                    setMaxTotalUpfront('');
                    setZeroBrokerage(false);
                    setFoodIncluded(false);
                    fetchResults();
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid-2">
                {listings.map(item => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    showCompareToggle={true}
                    isSelectedForCompare={selectedForCompare.includes(item.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Compare Bar if items selected */}
      {selectedForCompare.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f172a',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
          zIndex: 40,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {selectedForCompare.length} homes selected for side-by-side comparison
            </span>
          </div>

          <button onClick={openComparePage} className="btn btn-accent btn-sm" style={{ fontWeight: 700 }}>
            Compare Now
          </button>

          <button
            onClick={() => setSelectedForCompare([])}
            style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <X size={14} /> Clear
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading accommodations search...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
