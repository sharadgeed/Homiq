'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building, PlusCircle, CheckCircle2, Clock, Calendar, MessageSquare,
  RefreshCw, PauseCircle, PlayCircle, ShieldCheck, Eye, Users, AlertCircle, Wrench
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import { Listing, Enquiry, Viewing } from '@/lib/types';
import { formatINR } from '@/lib/api-response';

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<'listings' | 'enquiries' | 'viewings' | 'maintenance'>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reconfirmingId, setReconfirmingId] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/listings?mine=true').then(r => r.json()),
      fetch('/api/enquiries').then(r => r.json()),
      fetch('/api/viewings').then(r => r.json()),
      fetch('/api/maintenance').then(r => r.json()),
    ])
      .then(([uData, lData, eData, vData, mData]) => {
        if (uData?.user) setCurrentUser(uData.user);
        setListings(lData.listings || []);
        setEnquiries(eData.enquiries || []);
        setViewings(vData.viewings || []);
        setMaintenance(mData.requests || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReconfirmAvailability = async (id: string) => {
    try {
      setReconfirmingId(id);
      const res = await fetch(`/api/listings/${id}/availability`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert('Availability status confirmed active for today! Timestamp updated on public listing.');
        fetchData();
      } else {
        alert(data.error || 'Failed to reconfirm');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReconfirmingId(null);
    }
  };

  const handleToggleListingStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRented = async (id: string) => {
    if (!confirm('Mark this listing as rented? It will be marked occupied.')) return;
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rented' }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateViewingStatus = async (viewingId: string, status: string) => {
    try {
      const res = await fetch('/api/viewings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewingId, status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      <main className="homiq-container" style={{ padding: '2.5rem 1.25rem', flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 700 }}>
                Landlord / Owner Portal
              </span>
              <span className="badge badge-verified">
                {currentUser?.verificationStatus === 'verified'
                  ? 'Owner Verified (Documents Reviewed)'
                  : 'Verification In Progress'}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Property Owner Console
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              {currentUser ? `${currentUser.name} • ` : ''}Manage rental listings, reconfirm availability dates, screen applicants, and schedule viewings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/listings/new" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Add New Listing
            </Link>
          </div>
        </div>

        {/* Operational Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Active Properties</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', margin: '0.2rem 0' }}>
              {listings.filter(l => l.status === 'active').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>Available for renters</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Total Views</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
              {listings.reduce((acc, curr) => acc + (curr.viewCount || 0), 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unique search impressions</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Enquiries Received</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', margin: '0.2rem 0' }}>
              {enquiries.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309' }}>Awaiting responses</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Scheduled Visits</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb', margin: '0.2rem 0' }}>
              {viewings.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>In-person & video tours</div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.75rem' }}>
          <button
            onClick={() => setActiveTab('listings')}
            className={`btn btn-sm ${activeTab === 'listings' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <Building size={16} />
            <span>My Properties ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`btn btn-sm ${activeTab === 'enquiries' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <MessageSquare size={16} />
            <span>Renter Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('viewings')}
            className={`btn btn-sm ${activeTab === 'viewings' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <Calendar size={16} />
            <span>Visit Bookings ({viewings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`btn btn-sm ${activeTab === 'maintenance' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <Wrench size={16} />
            <span>Maintenance ({maintenance.length})</span>
          </button>
        </div>

        {/* TAB 1: LISTINGS MANAGEMENT */}
        {activeTab === 'listings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {listings.map(l => (
              <div key={l.id} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={l.images[0]}
                    alt={l.title}
                    style={{ width: '100px', height: '80px', borderRadius: '8px', objectFit: 'cover', background: '#cbd5e1' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="badge" style={{
                        background: l.status === 'active' ? '#dcfce7' : l.status === 'rented' ? '#e2e8f0' : '#fef3c7',
                        color: l.status === 'active' ? '#15803d' : '#475569',
                        textTransform: 'capitalize'
                      }}>
                        {l.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {l.neighbourhood}, {l.city}
                      </span>
                    </div>

                    <Link href={`/listings/${l.id}`} style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      {l.title}
                    </Link>

                    <div style={{ fontSize: '0.85rem', color: '#044e46', fontWeight: 700, marginTop: '0.25rem' }}>
                      Rent: {formatINR(l.rentAmount)}/mo • Deposit: {formatINR(l.depositAmount)}
                    </div>
                  </div>
                </div>

                {/* Availability Reconfirm & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* 1-Click Reconfirm Button */}
                  <button
                    onClick={() => handleReconfirmAvailability(l.id)}
                    disabled={reconfirmingId === l.id}
                    className="btn btn-outline btn-sm"
                    title="Click to stamp availability timestamp as active today"
                  >
                    <RefreshCw size={14} className={reconfirmingId === l.id ? 'animate-spin' : ''} />
                    <span>Reconfirm Vacancy Today</span>
                  </button>

                  {/* Pause / Resume Button */}
                  <button
                    onClick={() => handleToggleListingStatus(l.id, l.status)}
                    className="btn btn-secondary btn-sm"
                  >
                    {l.status === 'active' ? (
                      <>
                        <PauseCircle size={15} color="#b45309" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle size={15} color="#15803d" />
                        <span>Activate</span>
                      </>
                    )}
                  </button>

                  {/* Mark as Rented Button */}
                  {l.status !== 'rented' && (
                    <button
                      onClick={() => handleMarkRented(l.id)}
                      className="btn btn-secondary btn-sm"
                      title="Mark as currently occupied"
                    >
                      <CheckCircle2 size={15} color="#2563eb" />
                      <span>Mark Rented</span>
                    </button>
                  )}

                  <Link href={`/listings/${l.id}`} className="btn btn-primary btn-sm">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {enquiries.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <MessageSquare size={32} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No enquiries yet</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Inquiries from prospective renters will show up here.
                </p>
              </div>
            ) : (
              enquiries.map(e => (
                <div key={e.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span className="badge" style={{ background: '#f1f5f9', color: '#475569', textTransform: 'capitalize' }}>
                        {e.status}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.35rem' }}>{e.listingTitle}</h4>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                        From Renter: <strong>{e.renterName}</strong> • Phone: {e.renterPhone || 'Verified in profile'}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Target Move-In: <strong>{e.targetMoveInDate}</strong> ({e.durationMonths} months lease)
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                    "{e.message}"
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href="/dashboard/renter" className="btn btn-primary btn-sm">
                      Reply to Renter
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: VIEWINGS */}
        {activeTab === 'viewings' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {viewings.map(v => (
              <div key={v.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge" style={{
                    background: v.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                    color: v.status === 'confirmed' ? '#15803d' : '#b45309',
                    textTransform: 'capitalize'
                  }}>
                    {v.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{v.viewingType}</span>
                </div>

                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{v.listingTitle}</h4>
                <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.75rem' }}>
                  Renter: <strong>{v.renterName}</strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
                  <div>Time: {new Date(v.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  {v.notes && <div style={{ color: '#64748b', marginTop: '0.2rem' }}>Notes: {v.notes}</div>}
                </div>

                {v.status === 'requested' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdateViewingStatus(v.id, 'confirmed')}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Accept Visit
                    </button>
                    <button
                      onClick={() => handleUpdateViewingStatus(v.id, 'cancelled')}
                      className="btn btn-secondary btn-sm"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {maintenance.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                No active maintenance requests.
              </div>
            ) : (
              maintenance.map(m => (
                <div key={m.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{
                      background: m.status === 'resolved' ? '#dcfce7' : '#fee2e2',
                      color: m.status === 'resolved' ? '#15803d' : '#b91c1c',
                      textTransform: 'capitalize'
                    }}>
                      Status: {m.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Category: {m.category}</span>
                  </div>

                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{m.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.35rem 0 0.75rem' }}>{m.description}</p>
                  {m.resolutionNotes && (
                    <div style={{ background: '#f1f5f9', padding: '0.65rem', borderRadius: '6px', fontSize: '0.8rem', color: '#334155' }}>
                      <strong>Resolution:</strong> {m.resolutionNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
