'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyLogin } from '@/services/client/clientServices';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return;

    const login = async () => {
      try {
        await verifyLogin(token);
        localStorage.setItem('user', 'true');
        router.push('/');
      } catch (err) {
        console.error('Login error:', err);
      }
    };

    login();
  }, [searchParams]);

  return <p>Logging you in...</p>;
}
