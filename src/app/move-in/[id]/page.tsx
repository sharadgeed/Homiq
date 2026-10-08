'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Camera, FileText, ArrowLeft, Upload, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import { formatINR } from '@/lib/api-response';

export default function MoveInRecordPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [moveInDate, setMoveInDate] = useState('2026-11-01');
  const [agreedRent, setAgreedRent] = useState(24000);
  const [agreedDeposit, setAgreedDeposit] = useState(60000);
  const [conditionNotes, setConditionNotes] = useState(
    'Both parties inspected apartment fixtures. Minor paint scuff on master bedroom wardrobe pre-existing. Landlord handed over 2 sets of main door keys and 1 set of letterbox keys.'
  );

  // 10-Point Checklist
  const [checklist, setChecklist] = useState({
    mainDoorKeysHandedOver: true,
    cupboardKeysHandedOver: true,
    electricityMeterReading: '4,892 kWh',
    waterSubMeterReading: '124 kL',
    geyserFunctional: true,
    acCoolingOperational: true,
    wallPaintCleanAndFreeOfSeepage: true,
    kitchenChimneyAndGasPipeTested: true,
    bathroomFixturesLeakFree: true,
    powerBackupInverterTested: true,
  });

  // Dated Photos
  const [photos, setPhotos] = useState<Array<{ url: string; caption: string; date: string }>>([
    {
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      caption: 'Living room & switchboard state',
      date: new Date().toISOString().split('T')[0],
    },
    {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      caption: 'Main electricity meter & MCB panel',
      date: new Date().toISOString().split('T')[0],
    },
  ]);

  useEffect(() => {
    fetch(`/api/listings/${listingId}`)
      .then(res => res.json())
      .then(data => {
        if (data.listing) {
          setListing(data.listing);
          setAgreedRent(data.listing.rentAmount);
          setAgreedDeposit(data.listing.depositAmount);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/move-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          moveInDate,
          agreedRent,
          agreedDeposit,
          checklist,
          conditionNotes,
          datedPhotos: photos,
          status: 'agreed_by_both',
        }),
      });

      if (res.ok) {
        alert('Move-in condition record successfully saved and stamped! Mutually accessible in both renter and landlord portals.');
        router.push('/dashboard/renter');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to record move-in condition');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      <main className="homiq-container" style={{ padding: '2.5rem 1.25rem', maxWidth: '840px', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-verified">
              <ShieldCheck size={14} /> Deposit Protection Protocol
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Move-In Inventory & Condition Record
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {listing ? `For: ${listing.title} (${listing.neighbourhood}, ${listing.city})` : 'Document physical condition on keys handover day'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          {/* Agreed Terms */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            1. Agreed Rental Financial Terms
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Move-In Handover Date</label>
              <input
                type="date"
                value={moveInDate}
                onChange={e => setMoveInDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Agreed Rent (₹/mo)</label>
              <input
                type="number"
                value={agreedRent}
                onChange={e => setAgreedRent(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Refundable Security Deposit (₹)</label>
              <input
                type="number"
                value={agreedDeposit}
                onChange={e => setAgreedDeposit(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* 10-Point Inventory Inspection Checklist */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            2. 10-Point Handover Inspection Checklist
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={checklist.mainDoorKeysHandedOver}
                onChange={e => setChecklist({ ...checklist, mainDoorKeysHandedOver: e.target.checked })}
              />
              <span>All Main Door & Grille Keys Handed Over</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={checklist.cupboardKeysHandedOver}
                onChange={e => setChecklist({ ...checklist, cupboardKeysHandedOver: e.target.checked })}
              />
              <span>Cupboards & Wardrobe Keys Functional</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={checklist.geyserFunctional}
                onChange={e => setChecklist({ ...checklist, geyserFunctional: e.target.checked })}
              />
              <span>Geysers / Water Heaters Tested</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={checklist.acCoolingOperational}
                onChange={e => setChecklist({ ...checklist, acCoolingOperational: e.target.checked })}
              />
              <span>Air Conditioners Cooling Operational</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={checklist.wallPaintCleanAndFreeOfSeepage}
                onChange={e => setChecklist({ ...checklist, wallPaintCleanAndFreeOfSeepage: e.target.checked })}
              />
              <span>Wall Paint Clean & Free of Seepage</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={checklist.bathroomFixturesLeakFree}
                onChange={e => setChecklist({ ...checklist, bathroomFixturesLeakFree: e.target.checked })}
              />
              <span>Plumbing, Taps & Flush Leak-Free</span>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Electricity Meter Initial Reading</label>
              <input
                type="text"
                value={checklist.electricityMeterReading}
                onChange={e => setChecklist({ ...checklist, electricityMeterReading: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Water Meter Initial Reading</label>
              <input
                type="text"
                value={checklist.waterSubMeterReading}
                onChange={e => setChecklist({ ...checklist, waterSubMeterReading: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Condition Notes */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Mutually Agreed Existing Defect Notes (Protects Renter)</label>
            <textarea
              rows={3}
              value={conditionNotes}
              onChange={e => setConditionNotes(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Dated Inspection Photos */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            3. Timestamped Handover Photos
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {photos.map((p, idx) => (
              <div key={idx} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <img src={p.url} alt={p.caption} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <div style={{ padding: '0.65rem', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 700 }}>{p.caption}</div>
                  <div style={{ color: '#64748b' }}>Date Stamped: {p.date}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg btn-full"
          >
            {submitting ? 'Saving Condition Record...' : 'Confirm & Save Mutually Agreed Move-In Record'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
