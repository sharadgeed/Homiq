'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Scale, Check, X, ShieldCheck, MapPin, IndianRupee, ArrowLeft, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import { formatINR } from '@/lib/api-response';

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids');

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default to comparison of top listings if none specified
    const ids = idsParam || 'lst_koramangala_1bhk,lst_hsr_coliving_pg,lst_indiranagar_2bhk';

    fetch(`/api/compare?ids=${ids}`)
      .then(res => res.json())
      .then(data => setListings(data.listings || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [idsParam]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      <main className="homiq-container" style={{ padding: '2.5rem 1.25rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Scale size={24} color="var(--primary)" />
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Side-by-Side Accommodation Matrix
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Compare total upfront move-in costs, recurring monthly expenses, rules, and amenities across your shortlisted homes.
            </p>
          </div>

          <Link href="/search" className="btn btn-outline btn-sm">
            <ArrowLeft size={15} /> Find More Homes
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Comparing listings data...
          </div>
        ) : listings.length < 2 ? (
          <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <Scale size={32} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Select at least 2 listings to compare</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Browse the search catalogue and click "Compare" on homes you want to inspect side-by-side.
            </p>
            <Link href="/search" className="btn btn-primary">
              Browse Listings
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78125rem', color: '#64748b', marginBottom: '0.5rem' }}>
              <span>👉 Swipe horizontally on mobile to view all comparison columns</span>
            </div>
            <div className="card" style={{ overflowX: 'auto', border: '1.5px solid var(--border-light)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '780px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1.25rem 1rem', textAlign: 'left', width: '220px', color: '#475569', fontWeight: 700 }}>
                    Parameters
                  </th>
                  {listings.map(item => (
                    <th key={item.id} style={{ padding: '1.25rem 1rem', textAlign: 'left', minWidth: '220px', verticalAlign: 'top' }}>
                      <div style={{ height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem', background: '#cbd5e1' }}>
                        <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <Link href={`/listings/${item.id}`} style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                        {item.title}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                        {item.neighbourhood}, {item.city}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* 1. Monthly Rent */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, background: '#f8fafc' }}>
                    Monthly Rent
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatINR(item.rentAmount)} / mo
                    </td>
                  ))}
                </tr>

                {/* 2. Refundable Security Deposit */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, background: '#f8fafc' }}>
                    Refundable Deposit
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem', fontWeight: 700 }}>
                      {formatINR(item.depositAmount)}
                    </td>
                  ))}
                </tr>

                {/* 3. Upfront Move-In Total (Key Differentiator) */}
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f0fdf4' }}>
                  <td style={{ padding: '1rem', fontWeight: 800, color: '#044e46' }}>
                    Est. Total Upfront Move-In Cost
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem', fontWeight: 800, color: '#044e46', fontSize: '1.1rem' }}>
                      {formatINR(item.costs.totalUpfrontCost)}
                    </td>
                  ))}
                </tr>

                {/* 4. Est Total Monthly Recurring */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, background: '#f8fafc' }}>
                    Est. Total Monthly Recurring
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                      {formatINR(item.costs.monthlyRecurringCost)} / mo
                    </td>
                  ))}
                </tr>

                {/* 5. Brokerage Fee */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, background: '#f8fafc' }}>
                    Brokerage Fee
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem' }}>
                      {item.brokerageAmount === 0 ? (
                        <span className="badge badge-zero-brokerage">Zero Brokerage</span>
                      ) : (
                        <span style={{ fontWeight: 600 }}>{formatINR(item.brokerageAmount)}</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 6. Accommodation & Configuration */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, background: '#f8fafc' }}>
                    Property / Rooms
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem', textTransform: 'capitalize' }}>
                      {item.propertyType} • {item.totalBedrooms > 0 ? `${item.totalBedrooms} BHK` : 'Room'} ({item.furnishing.replace('_', ' ')})
                    </td>
                  ))}
                </tr>

                {/* 7. Food / Meal Plans */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, background: '#f8fafc' }}>
                    Food / Dining
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem' }}>
                      {item.foodIncluded ? (
                        <span style={{ color: '#15803d', fontWeight: 600 }}>
                          ✓ Meals Included ({item.foodType.replace('_', ' ')})
                        </span>
                      ) : (
                        <span style={{ color: '#64748b' }}>Independent Kitchen / No Meals</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 8. Availability Confirmation Date */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, background: '#f8fafc' }}>
                    Availability Freshness
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem' }}>
                      <span className="badge badge-fresh">
                        Confirmed: {item.availabilityConfirmedAt ? new Date(item.availabilityConfirmedAt).toLocaleDateString('en-IN') : 'Recent'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 9. Representative Identity */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, background: '#f8fafc' }}>
                    Representation
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem', textTransform: 'capitalize' }}>
                      {item.managerType.replace('_', ' ')} • {item.verifiedListing ? 'Verified Title' : 'Standard'}
                    </td>
                  ))}
                </tr>

                {/* 10. Key Amenities Checklist */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, background: '#f8fafc' }}>
                    Key Amenities
                  </td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                        {item.amenities.slice(0, 5).map((am: string, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Check size={12} color="var(--primary)" />
                            <span style={{ textTransform: 'capitalize' }}>{am.replace(/_/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 11. Actions row */}
                <tr>
                  <td style={{ padding: '1.25rem 1rem', background: '#f8fafc' }}></td>
                  {listings.map(item => (
                    <td key={item.id} style={{ padding: '1.25rem 1rem' }}>
                      <Link href={`/listings/${item.id}`} className="btn btn-primary btn-sm btn-full">
                        View Details & Book Tour
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading comparison...
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
