'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Building, Users, AlertCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'renter' | 'owner' | 'operator' | 'broker'>('renter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cityPreference, setCityPreference] = useState('Bengaluru');
  const [brokerageRegistrationNo, setBrokerageRegistrationNo] = useState('');
  const [representationType, setRepresentationType] = useState('owner_rep');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
          cityPreference,
          brokerageRegistrationNo: role === 'broker' ? brokerageRegistrationNo : undefined,
          representationType: role === 'broker' ? representationType : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed');
      } else {
        if (role === 'operator') router.push('/dashboard/operator');
        else if (role === 'broker') router.push('/dashboard/broker');
        else if (role === 'owner') router.push('/dashboard/owner');
        else router.push('/dashboard/renter');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="homiq-container" style={{ padding: '3.5rem 1.25rem', maxWidth: '540px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Create Your Homiq Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Select your persona to get a customized accommodation experience
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="card auth-card">
          <form onSubmit={handleRegister}>
            {/* Role Selection Tabs */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>I am joining as a:</label>
              <div className="role-select-grid">
                {[
                  { id: 'renter', label: '1. Renter / Room Seeker' },
                  { id: 'owner', label: '2. Property Owner' },
                  { id: 'operator', label: '3. PG / Hostel Operator' },
                  { id: 'broker', label: '4. RERA Broker' },
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    className={`btn btn-sm ${role === r.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.65rem 0.5rem', fontSize: '0.8125rem' }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

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
              <label className="form-label">Mobile Number (+91 Indian format)</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary City</label>
              <select className="form-select" value={cityPreference} onChange={e => setCityPreference(e.target.value)}>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* Role specific: Broker RERA inputs */}
            {role === 'broker' && (
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">State RERA Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. PRM/KA/RERA/1251/310/AG/..."
                    value={brokerageRegistrationNo}
                    onChange={e => setBrokerageRegistrationNo(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Authorized Mandate Representation</label>
                  <select className="form-select" value={representationType} onChange={e => setRepresentationType(e.target.value)}>
                    <option value="owner_rep">Representing Property Owner</option>
                    <option value="renter_rep">Representing Renter</option>
                    <option value="dual_rep">Dual Representation (Full Disclosure)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password (Min 8 characters)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
              style={{ marginTop: '0.75rem', padding: '0.75rem' }}
            >
              {loading ? 'Creating Profile...' : 'Complete Sign Up'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            Already have an account? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
