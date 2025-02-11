'use client'

import dynamic from 'next/dynamic';

const AppRouter = dynamic(() => import('./router'), { ssr: false });

export default function App() {
  return <AppRouter />;
}