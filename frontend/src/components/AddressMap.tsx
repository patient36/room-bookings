// components/AddressMap.tsx
'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { FaCrosshairs, FaRedo } from 'react-icons/fa';

// Fix default marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Recenter control component
function RecenterControl({ coords }: { coords: [number, number] }) {
  const map = useMap();
  const onClick = () => {
    map.setView(coords, map.getZoom());
  };

  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 right-4 z-[1000] bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      aria-label="Recenter map"
    >
      <FaCrosshairs className="text-gray-700" />
    </button>
  );
}

interface AddressMapProps {
  address: string;
  className?: string;
  zoom?: number;
}

export default function AddressMap({
  address,
  className = 'h-64',
  zoom = 15
}: AddressMapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0); // Track reload attempts
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const mapRef = useRef<any>(null);

  const reloadMap = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setError(null);
  };

  useEffect(() => {
    if (!inView) return;

    const geocodeAddress = async () => {
      try {
        // Clear cache when manually reloading
        if (retryCount > 0) {
          localStorage.removeItem(`geo_${address}`);
        }

        const cacheKey = `geo_${address}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached && retryCount === 0) {
          setCoords(JSON.parse(cached));
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
          {
            headers: {
              'User-Agent': 'YourAppName/1.0 (your@email.com)'
            }
          }
        );

        if (!response.ok) throw new Error('Geocoding failed');

        const data = await response.json();
        if (!data.length) throw new Error('Address not found');

        const newCoords: [number, number] = [
          parseFloat(data[0].lat),
          parseFloat(data[0].lon)
        ];

        localStorage.setItem(cacheKey, JSON.stringify(newCoords));
        setCoords(newCoords);
      } catch (err) {
        console.error('Geocoding error:', err);
        setError('Could not locate address');
        setCoords([0, 0]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(geocodeAddress, 1100);
    return () => clearTimeout(timer);
  }, [address, inView, retryCount]); // Add retryCount to dependencies

  if (!inView) {
    return <div ref={ref} className={`${className} bg-gray-100`} />;
  }

  if (isLoading) {
    return (
      <div ref={ref} className={`${className} bg-gray-100 animate-pulse rounded-lg`} />
    );
  }

  if (error) {
    return (
      <div
        ref={ref}
        className={`${className} flex flex-col items-center justify-center gap-2 text-red-500 rounded-lg bg-gray-50`}
      >
        <p>{error}</p>
        <button
          onClick={reloadMap}
          className="flex items-center z-[1000] gap-2 px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-100 transition-colors"
        >
          <FaRedo /> Reload Map
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className={`${className} rounded-lg overflow-hidden border z-0 border-gray-200 relative`}>
      <MapContainer
        center={coords || [0, 0]}
        zoom={coords ? zoom : 1}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {coords && (
          <>
            <Marker position={coords}>
              <Popup className="text-sm font-medium">{address}</Popup>
            </Marker>
            <RecenterControl coords={coords} />
          </>
        )}
      </MapContainer>
    </div>
  );
}