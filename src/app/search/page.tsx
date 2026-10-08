'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search, Filter, SlidersHorizontal, MapPin, Map, List, Scale,
  CheckCircle2, X, RefreshCw, Sparkles, Building2, Bed, ArrowUpDown
} from 'lucide-react';
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
  const [searchError, setSearchError] = useState<string | null>(null);

  // Mobile Filter Bottom Sheet Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compare selection tray
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const fetchResults = () => {
    setLoading(true);
    setSearchError(null);
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

    if (typeof window !== 'undefined') {
      const newQuery = params.toString();
      window.history.replaceState(null, '', newQuery ? `/search?${newQuery}` : '/search');
    }

    fetch(`/api/listings?${params.toString()}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Service temporarily unavailable (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        setListings(data.listings || []);
        setTotalCount(data.total || 0);
      })
      .catch(err => {
        console.error('Search fetch error:', err);
        setSearchError(err.message || 'Unable to load accommodations');
        setListings([]);
        setTotalCount(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResults();
  }, [city, propertyType, accommodationType, furnishing, maxRent, maxTotalUpfront, zeroBrokerage, foodIncluded, verifiedOnly, sortBy]);

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMobileFilterOpen(false);
    fetchResults();
  };

  const handleResetFilters = () => {
    setPropertyType('all');
    setAccommodationType('all');
    setFurnishing('all');
    setMaxRent('');
    setMaxTotalUpfront('');
    setZeroBrokerage(false);
    setFoodIncluded(false);
    setVerifiedOnly(false);
    setSortBy('availability_new');
    setMobileFilterOpen(false);
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

  // Count active non-default filters for mobile badge
  const activeFilterCount = [
    propertyType !== 'all',
    accommodationType !== 'all',
    furnishing !== 'all',
    Boolean(maxRent),
    Boolean(maxTotalUpfront),
    zeroBrokerage,
    foodIncluded,
    verifiedOnly,
  ].filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      {/* Top Search & Filter Control Bar */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.85rem 0', position: 'sticky', top: '4.25rem', zIndex: 40, backdropFilter: 'blur(12px)' }}>
        <div className="homiq-container">
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* City Selector */}
            <select
              className="form-select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: 'auto', minWidth: '135px', fontWeight: 700, padding: '0.6rem 0.85rem' }}
            >
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="all">All Cities</option>
            </select>

            {/* Keyword Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <input
                type="text"
                placeholder="Search neighbourhood (Koramangala, Powai, HSR)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchResults()}
                className="form-input"
                style={{ paddingLeft: '2.4rem', paddingRight: '0.85rem', height: '42px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
            </div>

            {/* Mobile Filter Button Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn btn-secondary mobile-filter-trigger"
              style={{ height: '42px', padding: '0.5rem 0.85rem', position: 'relative' }}
            >
              <SlidersHorizontal size={16} color="var(--primary)" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span style={{
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '0.2rem',
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle (List vs Map) */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', marginLeft: 'auto' }}>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}`}
                style={{ borderRadius: '6px', padding: '0.35rem 0.65rem' }}
                aria-label="List view"
              >
                <List size={16} />
                <span className="hide-on-tiny-screen">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : ''}`}
                style={{ borderRadius: '6px', padding: '0.35rem 0.65rem' }}
                aria-label="Map view"
              >
                <Map size={16} />
                <span className="hide-on-tiny-screen">Map</span>
              </button>
            </div>
          </div>

          {/* Quick-Filter Horizontal Scrollable Pill Ribbon (Crucial for mobile ergonomics) */}
          <div className="pill-ribbon" style={{ marginTop: '0.75rem', paddingBottom: '0.25rem' }}>
            <button
              onClick={() => { setPropertyType('all'); setZeroBrokerage(false); setVerifiedOnly(false); }}
              className={`pill-chip ${propertyType === 'all' && !zeroBrokerage && !verifiedOnly ? 'active' : ''}`}
            >
              All Types
            </button>
            <button
              onClick={() => setPropertyType(prev => prev === 'pg' ? 'all' : 'pg')}
              className={`pill-chip ${propertyType === 'pg' ? 'active' : ''}`}
            >
              <Building2 size={13} />
              <span>PG & Co-Living</span>
            </button>
            <button
              onClick={() => setPropertyType(prev => prev === 'flat' ? 'all' : 'flat')}
              className={`pill-chip ${propertyType === 'flat' ? 'active' : ''}`}
            >
              <Bed size={13} />
              <span>Flats / BHK</span>
            </button>
            <button
              onClick={() => setZeroBrokerage(prev => !prev)}
              className={`pill-chip ${zeroBrokerage ? 'active' : ''}`}
            >
              <Sparkles size={13} color={zeroBrokerage ? '#ffffff' : 'var(--gold)'} />
              <span>Zero Brokerage</span>
            </button>
            <button
              onClick={() => setVerifiedOnly(prev => !prev)}
              className={`pill-chip ${verifiedOnly ? 'active' : ''}`}
            >
              <CheckCircle2 size={13} color={verifiedOnly ? '#ffffff' : '#16a34a'} />
              <span>Verified Only</span>
            </button>
            <button
              onClick={() => setMaxRent(prev => prev === '25000' ? '' : '25000')}
              className={`pill-chip ${maxRent === '25000' ? 'active' : ''}`}
            >
              <span>Under ₹25k</span>
            </button>
            <button
              onClick={() => setFoodIncluded(prev => !prev)}
              className={`pill-chip ${foodIncluded ? 'active' : ''}`}
            >
              <span>Meals Included</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="homiq-container" style={{ padding: '1.75rem 1.25rem', flex: 1 }}>
        <div className="search-layout-grid">
          {/* Left Filter Sidebar (Desktop only) */}
          <aside className="card search-desktop-sidebar" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={16} color="var(--primary)" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleResetFilters}
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
                  <option value="all">Any Configuration</option>
                  <option value="entire_apartment">Entire Flat / House</option>
                  <option value="private_room">Private Bedroom</option>
                  <option value="shared_room">Shared Bed (PG / Hostel)</option>
                </select>
              </div>

              {/* Max Monthly Rent */}
              <div className="form-group">
                <label className="form-label">Max Monthly Rent</label>
                <select className="form-select" value={maxRent} onChange={e => setMaxRent(e.target.value)}>
                  <option value="">Any Monthly Rent</option>
                  <option value="15000">Up to ₹15,000</option>
                  <option value="25000">Up to ₹25,000</option>
                  <option value="35000">Up to ₹35,000</option>
                  <option value="50000">Up to ₹50,000</option>
                  <option value="80000">Up to ₹80,000</option>
                </select>
              </div>

              {/* Furnishing */}
              <div className="form-group">
                <label className="form-label">Furnishing Status</label>
                <select className="form-select" value={furnishing} onChange={e => setFurnishing(e.target.value)}>
                  <option value="all">Any Furnishing</option>
                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: '1.25rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={zeroBrokerage} onChange={e => setZeroBrokerage(e.target.checked)} />
                  <span>Zero Brokerage Only</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} />
                  <span>Document Verified Only</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={foodIncluded} onChange={e => setFoodIncluded(e.target.checked)} />
                  <span>Meals Included (PG/Hostel)</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Apply Filters
              </button>
            </form>
          </aside>

          {/* Right Main Results Section */}
          <main style={{ minWidth: 0 }}>
            {/* Header info & Sorting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Accommodations in {city === 'all' ? 'India' : city}
                </h1>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  {loading ? (
                    'Searching verified accommodations...'
                  ) : searchError ? (
                    <span style={{ color: 'var(--danger)' }}>Search failed</span>
                  ) : (
                    `Showing ${listings.length} of ${totalCount} available options (${listings.filter(l => l.verifiedListing).length} document verified)`
                  )}
                </div>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <ArrowUpDown size={13} /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontWeight: 600 }}
                >
                  <option value="availability_new">Verified & Fresh First</option>
                  <option value="rent_asc">Rent: Low to High</option>
                  <option value="rent_desc">Rent: High to Low</option>
                  <option value="cost_asc">Lowest Upfront Move-In Cost</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {searchError ? (
              <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#fef2f2', border: '1px solid #fecaca' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.5rem' }}>
                  Search Temporarily Unavailable
                </h3>
                <p style={{ color: '#7f1d1d', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  {searchError}. Please retry or adjust your search filters.
                </p>
                <button onClick={fetchResults} className="btn btn-primary btn-sm">
                  <RefreshCw size={14} /> Retry Search
                </button>
              </div>
            ) : loading ? (
              /* Loading Skeleton Grid */
              <div className="grid-2">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="card" style={{ height: '360px', background: '#f1f5f9', opacity: 0.6, animation: 'pulseGlow 1.5s infinite' }} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              /* Empty Results State */
              <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <Building2 size={36} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  No Accommodations Matching Criteria
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                  We couldn&apos;t find verified homes matching your exact filters in {city}. Try clearing some filters or searching adjacent tech corridors.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'list' ? (
              /* Results List Grid */
              <div className="grid-2">
                {listings.map(item => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    showCompareToggle
                    isSelectedForCompare={selectedForCompare.includes(item.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            ) : (
              /* Map View */
              <div className="card" style={{ padding: '1rem', height: '640px' }}>
                <InteractiveMap listings={listings} />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MOBILE SLIDE-UP FILTER BOTTOM SHEET */}
      {/* ================================================================ */}
      {mobileFilterOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div
            className="mobile-filter-sheet"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={18} color="var(--primary)" />
                <span>Filter Accommodations</span>
              </h3>
              <button onClick={() => setMobileFilterOpen(false)} style={{ padding: '0.35rem', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Category */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Accommodation Type</label>
                <select className="form-select" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="flat">Flats & Apartments</option>
                  <option value="room">Private Rooms</option>
                  <option value="pg">PG & Co-Living</option>
                  <option value="hostel">Hostels</option>
                </select>
              </div>

              {/* Max Monthly Rent */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Monthly Rent</label>
                <select className="form-select" value={maxRent} onChange={e => setMaxRent(e.target.value)}>
                  <option value="">Any Monthly Rent</option>
                  <option value="15000">Up to ₹15,000</option>
                  <option value="25000">Up to ₹25,000</option>
                  <option value="35000">Up to ₹35,000</option>
                  <option value="50000">Up to ₹50,000</option>
                  <option value="80000">Up to ₹80,000</option>
                </select>
              </div>

              {/* Furnishing */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Furnishing</label>
                <select className="form-select" value={furnishing} onChange={e => setFurnishing(e.target.value)}>
                  <option value="all">Any Furnishing</option>
                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={zeroBrokerage} onChange={e => setZeroBrokerage(e.target.checked)} />
                  <span>Zero Brokerage Only</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} />
                  <span>Verified Landlords / Title Verified</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={foodIncluded} onChange={e => setFoodIncluded(e.target.checked)} />
                  <span>Meals Included (PG/Hostel)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={handleResetFilters} className="btn btn-secondary btn-full">
                  Reset
                </button>
                <button type="button" onClick={() => handleApplyFilter()} className="btn btn-primary btn-full">
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Compare Drawer Bar if items selected */}
      {selectedForCompare.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '4.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          color: '#ffffff',
          borderRadius: '9999px',
          padding: '0.5rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 85,
          whiteSpace: 'nowrap',
          maxWidth: '92%',
        }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
            {selectedForCompare.length} selected to compare
          </span>
          <button onClick={openComparePage} className="btn btn-accent btn-sm" style={{ padding: '0.35rem 0.85rem' }}>
            <Scale size={14} /> Compare Now
          </button>
          <button onClick={() => setSelectedForCompare([])} style={{ color: '#94a3b8' }}>
            <X size={16} />
          </button>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .search-layout-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: flex-start;
        }

        .mobile-filter-trigger {
          display: none;
        }

        @media (max-width: 900px) {
          .search-layout-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .search-desktop-sidebar {
            display: none;
          }
          .mobile-filter-trigger {
            display: inline-flex;
          }
          .hide-on-tiny-screen {
            display: none;
          }
        }

        .mobile-filter-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top-left-radius: var(--radius-xl);
          border-top-right-radius: var(--radius-xl);
          padding: 1.5rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
          box-shadow: 0 -10px 35px rgba(0, 0, 0, 0.25);
          animation: slideUpSheet 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 85vh;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
          <RefreshCw size={20} className="animate-spin" />
          <span>Loading verified accommodations...</span>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
