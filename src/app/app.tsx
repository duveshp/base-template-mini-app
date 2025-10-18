'use client';

import { useApp } from '~/contexts/AppContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('~/components/Dashboard'), { ssr: false });
const Login = dynamic(() => import('~/components/Login'), { ssr: false });

export default function App() {
  const { state } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (state.user) {
      router.push('/dashboard');
    }
  }, [state.user, router]);

  if (state.user) {
    return <Dashboard />;
  }

  return <Login />;
}
