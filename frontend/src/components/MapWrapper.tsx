'use client';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./AddressMap'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

export default Map;