/**
 * SafeMap Component
 * ================
 * 
 * Client-side only map container that safely initializes Leaflet
 */

import React, { useState, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';

// Leaflet reference (client-side only)
let Leaflet;

const SafeMap = ({ center, zoom, children }) => {
  const [isClient, setIsClient] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Initialize on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      initializeLeaflet();
    }
  }, []);

  /**
   * Initializes Leaflet and fixes icon paths
   */
  const initializeLeaflet = () => {
    Leaflet = require('leaflet');
    require('leaflet/dist/leaflet.css');
    
    // Fix for Webpack icon paths
    delete Leaflet.Icon.Default.prototype._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  };

  // Lazy-loaded Leaflet components
  const LazyMapContainer = React.lazy(() => 
    import('react-leaflet').then(mod => ({ default: mod.MapContainer }))
  );
  const LazyTileLayer = React.lazy(() => 
    import('react-leaflet').then(mod => ({ default: mod.TileLayer }))
  );

  // Show loading state if not in browser environment
  if (!isClient) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Suspense fallback={
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="secondary" />
        </div>
      }>
        <LazyMapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(map) => {
            setTimeout(() => {
              map.invalidateSize();
              setMapReady(true);
            }, 0);
          }}
        >
          <LazyTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {children}
        </LazyMapContainer>
      </Suspense>
      
      {/* Loading overlay while map initializes */}
      {!mapReady && (
        <div className="map-loading-overlay">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </div>
  );
};

SafeMap.propTypes = {
  /** Center coordinates of the map [lat, lng] */
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  /** Initial zoom level */
  zoom: PropTypes.number,
  /** Child components (markers, etc) */
  children: PropTypes.node
};

SafeMap.defaultProps = {
  zoom: 5
};

export default SafeMap;