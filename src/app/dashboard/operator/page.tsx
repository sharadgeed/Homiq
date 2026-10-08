'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2, Users, Bed, PlusCircle, CheckCircle2, Utensils,
  Wrench, ShieldCheck, RefreshCw, AlertCircle, Edit3
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import { formatINR } from '@/lib/api-response';

export default function OperatorDashboard() {
  const [operatorListing, setOperatorListing] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick edit room state
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [occupiedBedsVal, setOccupiedBedsVal] = useState<number>(0);

  const fetchOperatorData = () => {
    setLoading(true);
    fetch('/api/listings/lst_hsr_coliving_pg')
      .then(res => res.json())
      .then(data => {
        if (data.listing) {
          setOperatorListing(data.listing);
          setRooms(data.listing.rooms || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOperatorData();
  }, []);

  const totalCapacity = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
  const totalOccupied = rooms.reduce((acc, r) => acc + (r.occupiedBeds || 0), 0);
  const totalVacant = totalCapacity - totalOccupied;
  const occupancyPercent = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      <main className="homiq-container" style={{ padding: '2.5rem 1.25rem', flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge" style={{ background: '#fef3c7', color: '#b45309', fontWeight: 700 }}>
                Co-Living & PG Operator Console
              </span>
              <span className="badge badge-verified">FSSAI & Trade License Verified</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Room & Bed Inventory Manager
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Priya Nambiar • Operating "Serene Heights Co-Living & PG", HSR Layout Sector 2.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/listings/new" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Add Co-Living Property
            </Link>
          </div>
        </div>

        {/* Occupancy & Live Capacity Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #044e46' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Total Bed Capacity</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0.2rem 0' }}>
              {totalCapacity} Beds
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>Across 4 configured rooms</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563eb' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Current Occupancy Rate</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', margin: '0.2rem 0' }}>
              {occupancyPercent}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>{totalOccupied} Active residents</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16a34a' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Vacant Available Beds</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a', margin: '0.2rem 0' }}>
              {totalVacant} Beds
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>Listed as vacant on search</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #d97706' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Food & Meal Plans</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309', margin: '0.2rem 0' }}>
              3 Meals / Day
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309' }}>North & South Indian menu</div>
          </div>
        </div>

        {/* Room-Level Inventory Grid */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Room-by-Room Inventory Allocation</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Track occupancy per room, attached washrooms, AC options, and bed pricing.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rooms.map(rm => (
              <div
                key={rm.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                      {rm.roomNumber}
                    </span>
                    <span className="badge" style={{
                      background: rm.status === 'available' ? '#dcfce7' : '#fee2e2',
                      color: rm.status === 'available' ? '#15803d' : '#b91c1c',
                      textTransform: 'capitalize'
                    }}>
                      {rm.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Type: <strong style={{ textTransform: 'capitalize' }}>{rm.roomType.replace('_', ' ')}</strong> • Capacity: <strong>{rm.capacity} Beds</strong> ({rm.occupiedBeds} occupied, {rm.capacity - rm.occupiedBeds} vacant)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {rm.attachedBathroom ? '✓ Attached Washroom' : 'Common Washroom'} • {rm.acAvailable ? '✓ Inverter AC' : 'Non-AC'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatINR(rm.rentPerBed)}
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>/bed</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Deposit: {formatINR(rm.depositPerBed)}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Updated room ${rm.roomNumber} live status.`);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Update Beds
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Plans & Services Configuration */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={20} color="var(--primary)" />
            <span>Food & Services Configuration</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Transparent dining and housekeeping packages displayed to prospective residents.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>Weekly Food Menu</div>
              <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
                Breakfast: Poha, Idli-Vada, Parathas.<br />
                Lunch/Dinner: Rice, Dal, Chapati, Paneer / Chicken curry on Wed & Sun.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>Housekeeping & Wi-Fi</div>
              <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
                Daily room sweeping & mopping. Bed linen washed weekly. 300 Mbps Airtel Fiber per floor.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>Resident House Rules</div>
              <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
                Biometric entry. Visitors allowed in lounge until 9:00 PM. Rooftop smoking gazebo.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
