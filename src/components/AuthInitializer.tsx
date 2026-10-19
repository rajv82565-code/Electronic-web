'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export default function AuthInitializer() {
  const setUser = useAuthStore(s => s.setUser);
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) setUser({ id: d.user.user_id, name: d.user.name, email: d.user.email, role: d.user.role, phone: d.user.phone });
    }).catch(() => {});
  }, [setUser]);
  return null;
}
