'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

export default function DemoRoleBar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setCurrentUser(data.user))
      .catch(() => {});
  }, []);

  const switchRole = async (role: string) => {
    try {
      setLoadingRole(role);
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        router.refresh();
        // Redirect to role dashboard if appropriate
        if (role === 'admin') router.push('/dashboard/admin');
        else if (role === 'operator') router.push('/dashboard/operator');
        else if (role === 'broker') router.push('/dashboard/broker');
        else if (role === 'owner') router.push('/dashboard/owner');
        else router.push('/dashboard/renter');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="demo-role-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
        <ShieldCheck size={16} color="#4ade80" />
        <span><strong>Homiq Dev Switcher:</strong> Active role is <span style={{ color: '#f59e0b', textTransform: 'capitalize', fontWeight: 'bold' }}>{currentUser ? `${currentUser.role} (${currentUser.name})` : 'Guest'}</span></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Switch to demo role:</span>
        {[
          { role: 'renter', label: '1. Renter (Aarav)' },
          { role: 'owner', label: '2. Landlord (Rajesh)' },
          { role: 'operator', label: '3. PG Operator (Priya)' },
          { role: 'broker', label: '4. Broker (Vikram)' },
          { role: 'admin', label: '5. Admin (Neha)' },
        ].map(item => (
          <button
            key={item.role}
            onClick={() => switchRole(item.role)}
            disabled={loadingRole !== null}
            className={`demo-role-btn ${currentUser?.role === item.role ? 'active' : ''}`}
            title={`Login instantly as ${item.label}`}
          >
            {loadingRole === item.role ? 'Switching...' : item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
