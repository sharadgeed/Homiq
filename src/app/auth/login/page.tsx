'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, Key, ArrowRight, AlertCircle, Building, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid credentials');
      } else {
        redirectByRole(data.user.role);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (res.ok) {
        redirectByRole(data.user.role);
      } else {
        setErrorMsg(data.error || 'Demo login failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role: string) => {
    switch (role) {
      case 'admin': router.push('/dashboard/admin'); break;
      case 'operator': router.push('/dashboard/operator'); break;
      case 'broker': router.push('/dashboard/broker'); break;
      case 'owner': router.push('/dashboard/owner'); break;
      default: router.push('/dashboard/renter'); break;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="homiq-container" style={{ padding: '3.5rem 1.25rem', maxWidth: '460px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Sign In to Homiq
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Access your transparent accommodation dashboard
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
              style={{ marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            Don't have an account? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create account</Link>
          </div>
        </div>

        {/* 1-Click Demo Accounts Selector (Hidden in strict production builds) */}
        {(process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN === 'true' || process.env.NODE_ENV !== 'production') && (
          <div className="card" style={{ padding: '1.5rem', background: '#f8fafc', border: '1.5px dashed #cbd5e1' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', marginBottom: '0.35rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Preview Role Accounts (Staging / Dev)
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginBottom: '1rem' }}>
              Preloaded with realistic Indian accommodation sample data:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { role: 'renter', label: 'Renter (Aarav Sharma)', desc: 'Search, bookings & checklists' },
                { role: 'owner', label: 'Landlord (Rajesh Venkatesh)', desc: '1-click availability & leads' },
                { role: 'operator', label: 'PG Operator (Priya Nambiar)', desc: 'Bed-level capacity & food plans' },
                { role: 'broker', label: 'RERA Broker (Vikram Kulkarni)', desc: 'Disclosed brokerage & mandates' },
                { role: 'admin', label: 'Admin (Neha Iyer)', desc: 'Moderation, title audit & disputes' },
              ].map(d => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => handleDemoLogin(d.role)}
                  disabled={loading}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>{d.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{d.desc}</div>
                  </div>
                  <ArrowRight size={14} color="var(--primary)" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
