import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, CheckCircle2, ShieldCheck, Clock, Bed, Bath, Sparkles, Building,
  Video, Calendar, AlertTriangle, MessageSquare, Heart, Share2, Scale, ExternalLink,
  Car, Wifi, Check, X, ShieldAlert, FileText, UserCheck, Phone, Mail
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import CostBreakdownCard from '@/components/CostBreakdownCard';
import CommuteEstimator from '@/components/CommuteEstimator';
import InteractiveMap from '@/components/InteractiveMap';
import ListingDetailActions from './ListingDetailActions';
import { getListingById } from '@/lib/db/queries';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { formatINR } from '@/lib/api-response';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const viewer = await getCurrentUser();
  const listing = getListingById(id, viewer?.id, viewer?.role);

  if (!listing) {
    notFound();
  }

  const db = getDb();
  const reviews = db.prepare(`
    SELECT r.*, u.name as renterName, u.avatarUrl as renterAvatar
    FROM reviews r
    JOIN users u ON r.renterId = u.id
    WHERE r.listingId = ? AND r.status = 'published'
    ORDER BY r.createdAt DESC
  `).all(listing.id) as any[];

  const getFreshnessDescription = () => {
    if (!listing.availabilityConfirmedAt) return 'Pending confirmation';
    const confirmed = new Date(listing.availabilityConfirmedAt);
    const diffHours = Math.floor((Date.now() - confirmed.getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return `Confirmed active today by host (${listing.ownerName || 'Verified Host'})`;
    const diffDays = Math.floor(diffHours / 24);
    return `Last confirmed active ${diffDays} day(s) ago by host`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      {/* Breadcrumb Bar */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 0' }}>
        <div className="homiq-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', color: '#64748b' }}>
            <Link href="/" style={{ color: 'var(--primary)' }}>Home</Link>
            <span>/</span>
            <Link href={`/search?city=${listing.city}`} style={{ color: 'var(--primary)' }}>{listing.city}</Link>
            <span>/</span>
            <Link href={`/search?neighbourhood=${listing.neighbourhood}`} style={{ color: 'var(--primary)' }}>{listing.neighbourhood}</Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{listing.title}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href={`/compare?ids=${listing.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
              <Scale size={14} /> Compare
            </Link>
          </div>
        </div>
      </div>

      {/* Main Listing Layout */}
      <main className="homiq-container" style={{ padding: '2rem 1.25rem', flex: 1 }}>
        {/* Availability Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #044e46 0%, #065f46 100%)',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              Availability Status: <strong>Ready for Move-In ({listing.availableFrom})</strong>
            </span>
            <span style={{ color: '#a7f3d0', fontSize: '0.8125rem' }}>• {getFreshnessDescription()}</span>
          </div>

          {listing.verifiedListing && (
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={14} /> Physical & Title Document Verified
            </span>
          )}
        </div>

        {/* Title & Location Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', fontWeight: 700 }}>
              {listing.propertyType.toUpperCase()}
            </span>
            <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
              {listing.accommodationType.replace('_', ' ')}
            </span>
            {listing.brokerageAmount === 0 && (
              <span className="badge badge-zero-brokerage">Zero Brokerage</span>
            )}
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            {listing.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            <MapPin size={16} color="var(--primary)" />
            <span>{listing.publicLocationDescription} • Pincode: {listing.pincode}</span>
          </div>
        </div>

        {/* High-Resolution Photo Gallery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '0.75rem',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '2rem',
          maxHeight: '480px'
        }}>
          <div style={{ height: '480px', background: '#cbd5e1' }}>
            <img
              src={listing.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'}
              alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.75rem', height: '480px' }}>
            <img
              src={listing.images[1] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'}
              alt="Room interior"
              style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#cbd5e1' }}
            />
            <img
              src={listing.images[2] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'}
              alt="Kitchen / Amenities"
              style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#cbd5e1' }}
            />
          </div>
        </div>

        {/* Two Column Layout: Main Details vs Right Sticky Booking Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2.5rem', alignItems: 'flex-start' }}>
          {/* Left Column: Details */}
          <div>
            {/* Highlights Grid */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configuration</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {listing.totalBedrooms > 0 ? `${listing.totalBedrooms} BHK` : 'Room'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bathrooms</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {listing.totalBathrooms} Attached
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Furnishing</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem', textTransform: 'capitalize' }}>
                  {listing.furnishing.replace('_', ' ')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carpet Area</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {listing.carpetAreaSqFt ? `${listing.carpetAreaSqFt} sq.ft` : 'Spacious'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.75rem' }}>About this Property</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                {listing.description}
              </p>
            </div>

            {/* Room Inventory for PG / Co-Living */}
            {listing.rooms && listing.rooms.length > 0 && (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Room & Bed-Level Inventory (PG / Co-Living)
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Transparent per-bed pricing and live availability:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {listing.rooms.map(rm => (
                    <div
                      key={rm.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          {rm.roomNumber}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          Capacity: {rm.capacity} beds ({rm.capacity - rm.occupiedBeds} vacant) • {rm.attachedBathroom ? 'Attached Washroom' : 'Common Washroom'} • {rm.acAvailable ? 'Air Conditioned' : 'Non-AC'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {formatINR(rm.rentPerBed)} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ bed</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: rm.status === 'available' ? 'var(--success)' : 'var(--danger)', fontWeight: 600, textTransform: 'capitalize' }}>
                          Status: {rm.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Grid */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>Amenities Included</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <div style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '0.35rem', borderRadius: '6px' }}>
                      <Check size={14} />
                    </div>
                    <span style={{ textTransform: 'capitalize' }}>{amenity.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules & Policies */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.75rem' }}>House Rules & Policies</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Agreed house rules set clear expectations between resident and property manager:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {listing.houseRules.map((rule, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commute Estimator */}
            <CommuteEstimator
              listingLat={listing.latitude}
              listingLng={listing.longitude}
              city={listing.city}
              neighbourhood={listing.neighbourhood}
            />

            {/* Interactive Map & Neighbourhood Facilities */}
            <InteractiveMap
              latitude={listing.latitude}
              longitude={listing.longitude}
              publicLocation={listing.publicLocationDescription}
              facilities={listing.neighbourhoodFacilities}
              city={listing.city}
              neighbourhood={listing.neighbourhood}
            />

            {/* Reviews Section */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Renter Reviews & Feedback</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {reviews.length > 0
                      ? `Average Rating: ${(reviews.reduce((acc, r) => acc + r.overallRating, 0) / reviews.length).toFixed(1)} / 5.0 (${reviews.length} published reviews)`
                      : 'No public reviews yet for this home'}
                  </p>
                </div>
              </div>

              {/* Dynamic Reviews or Honest Empty State */}
              {reviews.length === 0 ? (
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    No reviews have been submitted for this accommodation yet.
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Reviews can only be submitted by verified tenants and visitors following a scheduled viewing or move-in.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {reviews.map((rev: any) => (
                    <div key={rev.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          {rev.renterName} {rev.verifiedStay ? '• Verified Stay' : '• Verified Viewing'}
                        </div>
                        <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                          ★ {rev.overallRating.toFixed(1)} / 5.0
                        </span>
                      </div>
                      <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                        {rev.title}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                        {rev.comment}
                      </p>
                      {(rev.pros || rev.cons) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', marginTop: '0.5rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                          {rev.pros && <div style={{ color: '#15803d' }}><strong>Pros:</strong> {rev.pros}</div>}
                          {rev.cons && <div style={{ color: '#b45309' }}><strong>Cons:</strong> {rev.cons}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Action Console */}
          <div style={{ position: 'sticky', top: '5.5rem' }}>
            {/* Cost Breakdown Card */}
            <CostBreakdownCard listing={listing} />

            {/* Host Identity & Verification Profile Box */}
            <div className="card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.15rem'
                }}>
                  {listing.ownerName ? listing.ownerName.charAt(0) : 'H'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{listing.ownerName || 'Verified Host'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {listing.managerType === 'broker' ? 'RERA Registered Broker' : listing.managerType === 'authorized_representative' ? 'Property Operator' : 'Individual Property Owner'}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                    <ShieldCheck size={13} /> Verified
                  </span>
                </div>
              </div>

              {listing.brokerageRegistrationNo && (
                <div style={{ background: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#475569', marginBottom: '1rem' }}>
                  <strong>RERA Registration:</strong> {listing.brokerageRegistrationNo}
                </div>
              )}

              {/* Client Actions: Booking Visit, Video Tour, Enquiry, Report */}
              <ListingDetailActions listing={listing} />
            </div>

            {/* State Tenancy Info Notice */}
            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', padding: '0.85rem', marginTop: '1rem', fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 }}>
              <strong>Tenancy Advisory:</strong> Registered agreement mandatory as per State Tenancy guidelines. Model Tenancy Act principles adopted for notice periods and deposit limits.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
