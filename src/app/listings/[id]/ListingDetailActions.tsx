'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Video, MessageSquare, AlertTriangle, ShieldCheck, Check, RefreshCw, X } from 'lucide-react';
import { Listing } from '@/lib/types';

interface ListingDetailActionsProps {
  listing: Listing;
}

export default function ListingDetailActions({ listing }: ListingDetailActionsProps) {
  const router = useRouter();

  // Modals state
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Viewing Form state
  const [viewingType, setViewingType] = useState<'in_person' | 'video_tour'>('in_person');
  const [scheduledDate, setScheduledDate] = useState('2026-10-15');
  const [scheduledTime, setScheduledTime] = useState('11:00');
  const [viewingNotes, setViewingNotes] = useState('');
  const [viewingSubmitting, setViewingSubmitting] = useState(false);
  const [viewingSuccess, setViewingSuccess] = useState<any>(null);

  // Enquiry Form state
  const [moveInDate, setMoveInDate] = useState(listing.availableFrom || '2026-11-01');
  const [durationMonths, setDurationMonths] = useState(11);
  const [enquiryMessage, setEnquiryMessage] = useState(
    `Hello, I am interested in renting this ${listing.propertyType} in ${listing.neighbourhood}. Is it available for move-in from ${listing.availableFrom || 'next month'}?`
  );
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState<any>(null);

  // Report Form state
  const [reportReason, setReportReason] = useState('misleading_price');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Submit viewing request
  const handleScheduleViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    setViewingSubmitting(true);
    try {
      const scheduledAt = `${scheduledDate}T${scheduledTime}:00Z`;
      const res = await fetch('/api/viewings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          scheduledAt,
          viewingType,
          notes: viewingNotes,
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }
      if (res.ok) {
        setViewingSuccess(data);
      } else {
        alert(data.error || 'Failed to request viewing');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setViewingSubmitting(false);
    }
  };

  // Submit Enquiry
  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          targetMoveInDate: moveInDate,
          durationMonths,
          message: enquiryMessage,
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }
      if (res.ok) {
        setEnquirySuccess(data);
      } else {
        alert(data.error || 'Failed to send enquiry');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnquirySubmitting(false);
    }
  };

  // Submit Report
  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          reason: reportReason,
          details: reportDetails,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }
      if (res.ok) {
        setReportSuccess(true);
      } else {
        alert(data.error || 'Failed to submit report');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {/* Primary CTA: Schedule Visit */}
      <button
        onClick={() => setShowViewingModal(true)}
        className="btn btn-primary btn-full"
        style={{ padding: '0.85rem 1rem', fontSize: '0.95rem' }}
      >
        <Calendar size={18} />
        <span>Request Viewing / Video Tour</span>
      </button>

      {/* Secondary CTA: Send Message / Enquiry */}
      <button
        onClick={() => setShowEnquiryModal(true)}
        className="btn btn-secondary btn-full"
        style={{ padding: '0.75rem 1rem' }}
      >
        <MessageSquare size={17} />
        <span>Send Enquiry to Host</span>
      </button>

      {/* Report Button */}
      <button
        onClick={() => setShowReportModal(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: '#94a3b8',
          marginTop: '0.5rem',
          cursor: 'pointer'
        }}
      >
        <AlertTriangle size={13} color="#f59e0b" />
        <span>Report inaccurate details or scam</span>
      </button>

      {/* ================================================================ */}
      {/* 1. SCHEDULE VIEWING MODAL */}
      {/* ================================================================ */}
      {showViewingModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => { setShowViewingModal(false); setViewingSuccess(null); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            {viewingSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ background: '#dcfce7', color: '#16a34a', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Viewing Appointment Requested!</h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Your request has been delivered to <strong>{listing.ownerName}</strong>. You can track host confirmation and visit details in your Renter Dashboard.
                </p>
                {viewingSuccess.videoMeetingUrl && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
                    <strong>Generated Video Tour Link:</strong>
                    <div style={{ color: '#2563eb', wordBreak: 'break-all', marginTop: '0.25rem' }}>
                      {viewingSuccess.videoMeetingUrl}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => router.push('/dashboard/renter')}
                  className="btn btn-primary btn-full"
                >
                  Go to Renter Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleViewing}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Schedule a Viewing
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Choose an in-person visit or a remote live video tour with host:
                </p>

                {/* Viewing Type Toggle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setViewingType('in_person')}
                    className={`btn btn-sm ${viewingType === 'in_person' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.65rem' }}
                  >
                    In-Person Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingType('video_tour')}
                    className={`btn btn-sm ${viewingType === 'video_tour' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.65rem' }}
                  >
                    <Video size={15} /> Video Tour (Meet)
                  </button>
                </div>

                {/* Date & Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={e => setScheduledDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <select
                      className="form-select"
                      value={scheduledTime}
                      onChange={e => setScheduledTime(e.target.value)}
                    >
                      <option value="10:00">10:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:30">04:30 PM</option>
                      <option value="18:00">06:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label className="form-label">Notes for Host (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Would like to inspect two-wheeler parking and kitchen water flow"
                    value={viewingNotes}
                    onChange={e => setViewingNotes(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={viewingSubmitting}
                  className="btn btn-primary btn-full"
                  style={{ marginTop: '0.5rem' }}
                >
                  {viewingSubmitting ? 'Requesting...' : 'Confirm Viewing Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 2. SEND ENQUIRY MODAL */}
      {/* ================================================================ */}
      {showEnquiryModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => { setShowEnquiryModal(false); setEnquirySuccess(null); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            {enquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ background: '#dcfce7', color: '#16a34a', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Enquiry Delivered!</h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Your message has been sent directly to <strong>{listing.ownerName}</strong>. You can chat and receive updates in your dashboard.
                </p>
                <button
                  onClick={() => router.push('/dashboard/renter')}
                  className="btn btn-primary btn-full"
                >
                  View Enquiry Thread
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Contact Property Host
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Send your move-in requirements to {listing.ownerName}:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Target Move-in Date</label>
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={e => setMoveInDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lease Duration</label>
                    <select
                      className="form-select"
                      value={durationMonths}
                      onChange={e => setDurationMonths(Number(e.target.value))}
                    >
                      <option value="6">6 Months</option>
                      <option value="11">11 Months (Standard)</option>
                      <option value="24">24 Months</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea
                    rows={4}
                    value={enquiryMessage}
                    onChange={e => setEnquiryMessage(e.target.value)}
                    className="form-textarea"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={enquirySubmitting}
                  className="btn btn-primary btn-full"
                  style={{ marginTop: '0.5rem' }}
                >
                  {enquirySubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 3. REPORT LISTING MODAL */}
      {/* ================================================================ */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => { setShowReportModal(false); setReportSuccess(false); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            {reportSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ background: '#fef3c7', color: '#b45309', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <ShieldCheck size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Report Submitted for Review</h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Thank you for keeping Homiq safe. Our moderation compliance team investigates all reported listings within 24 hours.
                </p>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="btn btn-secondary btn-full"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendReport}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#b91c1c' }}>
                  <AlertTriangle size={20} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Report Listing</h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Help us remove scams, discriminatory conditions, and misleading prices.
                </p>

                <div className="form-group">
                  <label className="form-label">Reason for reporting</label>
                  <select
                    className="form-select"
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                  >
                    <option value="misleading_price">Misleading Price or Hidden Deposit Charges</option>
                    <option value="unavailable_rented">Property already rented out / Unavailable</option>
                    <option value="scam_fake">Suspected Scam, Fraud, or Fake Landlord</option>
                    <option value="discriminatory">Discriminatory or Abusive Restrictions</option>
                    <option value="hygiene_safety">Severe Hygiene or Safety Violation</option>
                    <option value="other">Other Violation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Details / Evidence</label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific details to help our compliance staff verify..."
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    className="form-textarea"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="btn btn-accent btn-full"
                  style={{ marginTop: '0.5rem' }}
                >
                  {reportSubmitting ? 'Submitting...' : 'Submit Report for Moderation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
