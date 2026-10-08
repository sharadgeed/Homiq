'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Users,
  Building, RefreshCw, FileText, Activity, ShieldCheck, Eye
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';
import { formatINR } from '@/lib/api-response';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'reports' | 'verifications' | 'audit' | 'users'>('reports');
  const [data, setData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdminData = () => {
    setLoading(true);
    setAuthError(null);
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(uData => {
        if (uData?.user?.role !== 'admin') {
          setAuthError('Administrator privileges required to view this moderation console.');
          return null;
        }
        setCurrentUser(uData.user);
        return fetch('/api/admin/moderation');
      })
      .then(res => {
        if (!res) return null;
        if (res.status === 403 || res.status === 401) {
          setAuthError('Unauthorized: Administrator privileges required.');
          return null;
        }
        return res.json();
      })
      .then(resData => {
        if (resData) setData(resData);
      })
      .catch(err => {
        console.error(err);
        setAuthError('Failed to load moderation data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleResolveReport = async (reportId: string, status: string) => {
    const notes = prompt('Enter resolution notes for audit trail:');
    if (!notes) return;

    try {
      setActionLoading(reportId);
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESOLVE_REPORT',
          targetId: reportId,
          status,
          notes,
        }),
      });

      if (res.ok) {
        alert('Report resolved.');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyListing = async (listingId: string, verified: boolean) => {
    const notes = prompt('Enter verification notes / reason:');
    try {
      setActionLoading(listingId);
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VERIFY_LISTING',
          targetId: listingId,
          verified,
          notes,
        }),
      });

      if (res.ok) {
        alert(`Listing ${verified ? 'marked verified' : 'unverified'}.`);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateListingStatus = async (listingId: string, status: string) => {
    try {
      setActionLoading(listingId);
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_LISTING_STATUS',
          targetId: listingId,
          status,
        }),
      });

      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
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
              <span className="badge" style={{ background: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}>
                Platform Compliance & Trust Lead
              </span>
              <span className="badge badge-verified">
                {currentUser ? `${currentUser.name} (${currentUser.email})` : 'Authorized Staff'}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Trust, Safety & Moderation Console
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Review flagged listings, triage user reports, approve landlord title verifications, and audit actions.
            </p>
          </div>
        </div>

        {authError && (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', borderColor: '#f87171', background: '#fef2f2', marginBottom: '2rem' }}>
            <ShieldAlert size={36} color="#b91c1c" style={{ margin: '0 auto 0.75rem' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.5rem' }}>Access Denied</h2>
            <p style={{ color: '#7f1d1d', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{authError}</p>
            <Link href="/" className="btn btn-primary btn-sm">Return to Marketplace</Link>
          </div>
        )}

        {/* Operational Metrics Overview */}
        {data?.stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #b91c1c' }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Pending Abuse Reports</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b91c1c', margin: '0.2rem 0' }}>
                {data.stats.pendingReportsCount} Reports
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>Requires triage</div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #044e46' }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Verified Listings</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#044e46', margin: '0.2rem 0' }}>
                {data.stats.verifiedListings} / {data.stats.totalListings}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>Title checked</div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563eb' }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Total User Accounts</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', margin: '0.2rem 0' }}>
                {data.stats.totalUsers} Registered
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>Across 5 roles</div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #d97706' }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Active Search Supply</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309', margin: '0.2rem 0' }}>
                {data.stats.activeListings} Active
              </div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>Available for move-in</div>
            </div>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.75rem' }}>
          <button
            onClick={() => setActiveTab('reports')}
            className={`btn btn-sm ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <ShieldAlert size={16} />
            <span>Abuse Reports Queue ({data?.reports?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('verifications')}
            className={`btn btn-sm ${activeTab === 'verifications' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <ShieldCheck size={16} />
            <span>Listing Verification & Moderation ({data?.listings?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <Activity size={16} />
            <span>Audit Trail Event Logs ({data?.auditLogs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            <Users size={16} />
            <span>Registered Accounts ({data?.users?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: REPORTS QUEUE */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data?.reports?.map((rep: any) => (
              <div key={rep.id} className="card" style={{ padding: '1.5rem', borderLeft: rep.status === 'pending' ? '4px solid #b91c1c' : '4px solid #16a34a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span className="badge" style={{
                      background: rep.status === 'pending' ? '#fee2e2' : '#dcfce7',
                      color: rep.status === 'pending' ? '#b91c1c' : '#15803d',
                      textTransform: 'capitalize'
                    }}>
                      Status: {rep.status}
                    </span>
                    <span className="badge badge-warning" style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}>
                      Reason: {rep.reason.replace('_', ' ')}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.35rem' }}>{rep.listingTitle} ({rep.listingCity})</h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Reported by user: {rep.reporterName} ({rep.reporterEmail}) on {new Date(rep.createdAt).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <Link href={`/listings/${rep.listingId}`} target="_blank" className="btn btn-secondary btn-sm">
                    Inspect Listing <Eye size={13} />
                  </Link>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: '#1e293b', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                  <strong>Report Details:</strong> {rep.details}
                </div>

                {rep.adminNotes && (
                  <div style={{ background: '#f1f5f9', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#334155', marginBottom: '1rem' }}>
                    <strong>Moderation Resolution Notes:</strong> {rep.adminNotes}
                  </div>
                )}

                {rep.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'resolved')}
                      disabled={actionLoading === rep.id}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle2 size={14} /> Resolve & Close Report
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'dismissed')}
                      disabled={actionLoading === rep.id}
                      className="btn btn-secondary btn-sm"
                    >
                      <XCircle size={14} /> Dismiss (Invalid Claim)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: LISTING MODERATION & VERIFICATION */}
        {activeTab === 'verifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data?.listings?.map((l: any) => (
              <div key={l.id} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge" style={{
                      background: l.verifiedListing ? '#dcfce7' : '#fef3c7',
                      color: l.verifiedListing ? '#15803d' : '#b45309'
                    }}>
                      {l.verifiedListing ? 'Verified Title' : 'Pending Verification'}
                    </span>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', textTransform: 'capitalize' }}>
                      Status: {l.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{l.title}</h3>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    Host: {l.ownerName} ({l.ownerRole}) • {l.neighbourhood}, {l.city} • Rent: {formatINR(l.rentAmount)}
                  </div>
                  {l.verificationNotes && (
                    <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.2rem' }}>
                      Notes: {l.verificationNotes}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {l.verifiedListing ? (
                    <button
                      onClick={() => handleVerifyListing(l.id, false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Revoke Verification
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyListing(l.id, true)}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle2 size={14} /> Approve & Verify Title
                    </button>
                  )}

                  {l.status === 'active' ? (
                    <button
                      onClick={() => handleUpdateListingStatus(l.id, 'suspended')}
                      className="btn btn-accent btn-sm"
                      title="Suspend listing from search"
                    >
                      Suspend Listing
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateListingStatus(l.id, 'active')}
                      className="btn btn-secondary btn-sm"
                    >
                      Restore to Active
                    </button>
                  )}

                  <Link href={`/listings/${l.id}`} target="_blank" className="btn btn-secondary btn-sm">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: AUDIT TRAIL LOGS */}
        {activeTab === 'audit' && (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actor</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Target</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Details / Metadata</th>
                </tr>
              </thead>
              <tbody>
                {data?.auditLogs?.map((aud: any) => (
                  <tr key={aud.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                      {new Date(aud.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                      {aud.actorName || 'System'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className="badge" style={{ background: '#e2e8f0', color: '#0f172a', fontFamily: 'monospace' }}>
                        {aud.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {aud.targetType}:{aud.targetId}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#475569', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {aud.metadata || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: USERS OVERVIEW */}
        {activeTab === 'users' && (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Verification</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {data?.users?.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className="badge" style={{ textTransform: 'capitalize', background: '#f1f5f9', color: '#0f172a' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className="badge badge-verified" style={{ textTransform: 'capitalize' }}>
                        {u.verificationStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
