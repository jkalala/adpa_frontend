// src/components/ClientSideMap.js
import React, { useState, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';

/**
 * Client-side only map container
 * Prevents SSR issues with Leaflet
 */
const ClientSideMap = ({ center, zoom, children }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [MapContainer, setMapContainer] = useState(null);
  const [TileLayer, setTileLayer] = useState(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      setIsBrowser(true);
      
      // Dynamically import Leaflet and react-leaflet components
      Promise.all([
        import('leaflet'),
        import('react-leaflet')
      ]).then(([L, { MapContainer, TileLayer }]) => {
        // Fix Leaflet marker icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });

        setMapContainer(() => MapContainer);
        setTileLayer(() => TileLayer);
      });
    }
  }, []);

  if (!isBrowser || !MapContainer || !TileLayer) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {children}
    </MapContainer>
  );
};

ClientSideMap.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number,
  children: PropTypes.node
};

ClientSideMap.defaultProps = {
  zoom: 5
};

export default ClientSideMap;