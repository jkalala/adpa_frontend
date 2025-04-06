// src/components/MapContainer.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ErrorBoundary from './ErrorBoundary';

// Fix default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
  // Verify React hooks are available
  if (typeof React.useState !== 'function') {
    throw new Error('React hooks not available');
  }

  const [map, setMap] = useState(null);
  const [position] = useState([51.505, -0.09]);

  useEffect(() => {
    if (map) {
      // Map initialization logic here
    }
    return () => {
      if (map) map.remove();
    };
  }, [map]);

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '400px' }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>Default Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

// Wrap with ErrorBoundary
export default function MapContainerComponent() {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div>Loading map...</div>}>
        <MapComponent />
      </React.Suspense>
    </ErrorBoundary>
  );
}