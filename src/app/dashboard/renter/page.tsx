'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar, MessageSquare, Video, CheckCircle2, Clock, FileText,
  AlertCircle, ShieldCheck, Heart, User, Send, Star, ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import { Enquiry, Viewing, MoveInRecord } from '@/lib/types';
import { formatINR } from '@/lib/api-response';

export default function RenterDashboard() {
  const [activeTab, setActiveTab] = useState<'viewings' | 'enquiries' | 'move_in'>('viewings');
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [moveInRecords, setMoveInRecords] = useState<MoveInRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Message reply state
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/viewings').then(r => r.json()),
      fetch('/api/enquiries').then(r => r.json()),
      fetch('/api/move-in').then(r => r.json()),
    ])
      .then(([vData, eData, mData]) => {
        setViewings(vData.viewings || []);
        setEnquiries(eData.enquiries || []);
        setMoveInRecords(mData.records || []);
        if (eData.enquiries?.length > 0) {
          setSelectedEnquiry(eData.enquiries[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !replyText.trim()) return;
    setSendingReply(true);

    try {
      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() }),
      });

      if (res.ok) {
        setReplyText('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
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
              <span className="badge" style={{ background: '#dcfce7', color: '#166534', fontWeight: 700 }}>
                Renter Portal
              </span>
              <span className="badge badge-verified">ID Verified (Aadhaar / DigiLocker)</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              My Accommodation Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Track scheduled in-person & video visits, chat with landlords, and inspect condition records.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/search" className="btn btn-primary btn-sm">
              Explore More Homes
            </Link>
            <Link href="/saved" className="btn btn-secondary btn-sm">
              <Heart size={15} /> Saved Wishlist
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.75rem' }}>
          <button
            onClick={() => setActiveTab('viewings')}
            className={`btn btn-sm ${activeTab === 'viewings' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <Calendar size={16} />
            <span>Scheduled Viewings ({viewings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`btn btn-sm ${activeTab === 'enquiries' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <MessageSquare size={16} />
            <span>Enquiries & Chat ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('move_in')}
            className={`btn btn-sm ${activeTab === 'move_in' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <FileText size={16} />
            <span>Move-In Condition Records ({moveInRecords.length})</span>
          </button>
        </div>

        {/* TAB 1: VIEWINGS */}
        {activeTab === 'viewings' && (
          <div>
            {viewings.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <Calendar size={32} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No viewings scheduled yet</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                  When browsing flats and rooms, click "Request Viewing" to book in-person or remote video walkthroughs.
                </p>
                <Link href="/search" className="btn btn-primary btn-sm">
                  Find Accommodations
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {viewings.map(v => (
                  <div key={v.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge" style={{
                        background: v.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                        color: v.status === 'confirmed' ? '#15803d' : '#b45309',
                        textTransform: 'capitalize'
                      }}>
                        {v.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Type: {v.viewingType === 'video_tour' ? 'Live Video Tour' : 'In-Person Visit'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      {v.listingTitle}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      Host: <strong>{v.hostName}</strong>
                    </p>

                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={15} color="var(--primary)" />
                        <span>Scheduled: {new Date(v.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      {v.notes && (
                        <div style={{ color: '#64748b', fontSize: '0.775rem', marginTop: '0.25rem' }}>
                          Notes: {v.notes}
                        </div>
                      )}
                    </div>

                    {v.viewingType === 'video_tour' && v.videoMeetingUrl && (
                      <a
                        href={v.videoMeetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-accent btn-sm btn-full"
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <Video size={16} /> Join Google Meet Walkthrough
                      </a>
                    )}

                    <Link href={`/listings/${v.listingId}`} className="btn btn-secondary btn-sm btn-full">
                      View Property Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ENQUIRIES & CHAT */}
        {activeTab === 'enquiries' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
            {/* Enquiry Threads Sidebar */}
            <div className="card" style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Your Inquiries</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {enquiries.map(enq => (
                  <button
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: selectedEnquiry?.id === enq.id ? 'var(--primary-subtle)' : '#f8fafc',
                      border: selectedEnquiry?.id === enq.id ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {enq.listingTitle}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Host: {enq.hostName} • Status: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{enq.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Area */}
            {selectedEnquiry ? (
              <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '420px' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedEnquiry.listingTitle}</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Host: <strong>{selectedEnquiry.hostName}</strong> • Target Move-in: {selectedEnquiry.targetMoveInDate}
                  </div>
                </div>

                {/* Messages stream */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', overflowY: 'auto', maxHeight: '320px' }}>
                  {selectedEnquiry.messages?.map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        maxWidth: '80%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        alignSelf: msg.senderId === selectedEnquiry.renterId ? 'flex-end' : 'flex-start',
                        background: msg.senderId === selectedEnquiry.renterId ? 'var(--primary)' : '#f1f5f9',
                        color: msg.senderId === selectedEnquiry.renterId ? '#fff' : '#0f172a',
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '0.2rem' }}>
                        {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div>{msg.message}</div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <input
                    type="text"
                    placeholder="Type your message to host..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button type="submit" disabled={sendingReply} className="btn btn-primary btn-sm">
                    <Send size={16} /> Send
                  </button>
                </form>
              </div>
            ) : (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                Select an enquiry thread from the left to view messages.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MOVE-IN CONDITION RECORDS */}
        {activeTab === 'move_in' && (
          <div>
            <div style={{ marginBottom: '1.25rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 700, marginBottom: '0.35rem' }}>
                <ShieldCheck size={20} />
                <span>Move-In Condition Security Deposit Protection</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#047857', lineHeight: 1.5 }}>
                Dated photographic checklists agreed upon mutually between you and your landlord ensure that pre-existing scuffs, meter readings, or appliance states are not wrongfully deducted from your security deposit at move-out.
              </p>
            </div>

            {moveInRecords.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <FileText size={32} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No move-in records filed yet</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                  Once you finalize a rental agreement, record dated inspection photos and inventory checklist with the landlord.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {moveInRecords.map(rec => (
                  <div key={rec.id} className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <span className="badge" style={{ background: '#dcfce7', color: '#166534', fontWeight: 700, marginBottom: '0.35rem' }}>
                          Status: Agreed by Both Parties
                        </span>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{rec.listingTitle}</h3>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          Landlord: {rec.hostName} • Handover Move-In Date: {rec.moveInDate}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Agreed Rent / Deposit:</div>
                        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                          {formatINR(rec.agreedRent)}/mo • Deposit: {formatINR(rec.agreedDeposit)}
                        </div>
                      </div>
                    </div>

                    {/* Inspection Checklist items */}
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                        10-Point Inventory Inspection Checklist
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.65rem', fontSize: '0.8125rem' }}>
                        {Object.entries(rec.checklist).map(([key, val]) => (
                          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckCircle2 size={15} color="var(--success)" />
                            <span><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Condition Notes */}
                    {rec.conditionNotes && (
                      <div style={{ background: '#f1f5f9', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                        <strong>Mutually Agreed Condition Notes:</strong>
                        <p style={{ marginTop: '0.25rem', color: '#334155' }}>{rec.conditionNotes}</p>
                      </div>
                    )}

                    {/* Dated Photos Gallery */}
                    {rec.datedPhotos?.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                          Dated Inspection Photos (Timestamp Stamped)
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                          {rec.datedPhotos.map((photo, i) => (
                            <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff' }}>
                              <img src={photo.url} alt={photo.caption} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                              <div style={{ padding: '0.5rem', fontSize: '0.75rem' }}>
                                <div style={{ fontWeight: 600, color: '#0f172a' }}>{photo.caption}</div>
                                <div style={{ color: '#64748b' }}>Date: {photo.date}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
