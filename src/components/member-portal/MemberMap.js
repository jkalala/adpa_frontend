/**
 * MemberMap.js
 * ===========
 * 
 * Interactive map component for ADPA member countries.
 * Uses React-Leaflet with client-side only rendering to avoid SSR issues.
 * Displays member countries as clickable markers with status indicators.
 */

import React, { useState, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

/**
 * ClientSideMap wrapper component to prevent SSR issues
 * Must be defined in a separate file (ClientSideMap.js)
 */
const ClientSideMap = React.lazy(() => import('./ClientSideMap'));

// Lazy-loaded Leaflet components to prevent bundle size issues
const Marker = React.lazy(() => import('react-leaflet').then(mod => ({ default: mod.Marker })));
const Popup = React.lazy(() => import('react-leaflet').then(mod => ({ default: mod.Popup })));

/**
 * ADPA Member Countries Data
 * Contains geographic coordinates and status for each country
 */
const memberCountries = [
  { name: 'Angola', lat: -11.20, lng: 17.87, status: 'member' },
  { name: 'South Africa', lat: -30.56, lng: 22.94, status: 'member' },
  { name: 'Zimbabwe', lat: -19.02, lng: 29.15, status: 'member' },
  { name: 'Namibia', lat: -22.96, lng: 18.49, status: 'member' },
  { name: 'Tanzania', lat: -6.37, lng: 34.89, status: 'member' },
  { name: 'Ghana', lat: 7.95, lng: -1.02, status: 'member' },
  { name: 'Guinea', lat: 9.95, lng: -9.70, status: 'member' },
  { name: 'DRC', lat: -4.04, lng: 21.76, status: 'member' },
  { name: 'Congo', lat: -0.23, lng: 15.83, status: 'member' },
  { name: 'Togo', lat: 8.62, lng: 0.82, status: 'member' },
  { name: 'Central African Republic', lat: 6.61, lng: 20.94, status: 'member' },
  { name: 'Cameroun', lat: 7.37, lng: 12.35, status: 'member' },
  { name: "Cote d'Ivoire", lat: 7.54, lng: -5.55, status: 'member' },
  { name: 'Sierra Leone', lat: 8.46, lng: -11.78, status: 'member' },
  { name: 'Liberia', lat: 6.43, lng: -9.43, status: 'member' },
  { name: 'Gabon', lat: -0.80, lng: 11.61, status: 'observer' },
  { name: 'Algeria', lat: 28.03, lng: 1.66, status: 'observer' },
  { name: 'Mali', lat: 17.57, lng: -4.00, status: 'observer' },
  { name: 'Mozambique', lat: -18.67, lng: 35.53, status: 'observer' },
  { name: 'Russia', lat: 61.52, lng: 105.32, status: 'observer' }

  // ... other member countries ...
];

const MemberMap = ({ country, onCountrySelect }) => {
  // Track if component is mounted (client-side)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag when component mounts
    setIsClient(true);
    
    // Fix Leaflet marker icons (must be done client-side)
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    }
  }, []);

  /**
   * Calculates map center based on selected country
   * @returns {[number, number]} [latitude, longitude] coordinates
   */
  const getCenter = () => {
    if (!country) return [0, 20]; // Default Africa view
    
    const found = memberCountries.find(c => c.name === country);
    return found ? [found.lat, found.lng] : [0, 20];
  };

  /**
   * Determines appropriate zoom level
   * @returns {number} Zoom level (3 for continent, 6 for country)
   */
  const getZoomLevel = () => country ? 6 : 3;

  /**
   * Gets color based on membership status
   * @param {string} status - 'member' or 'observer'
   * @returns {string} CSS color value
   */
  const getStatusColor = (status) => 
    status === 'member' ? '#2e7d32' : '#0288d1';

  // Don't render on server
  if (!isClient) {
    return (
      <Card className="member-map-container">
        <Card.Body style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>Loading map...</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="member-map-container">
      {/* Map Header */}
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">ADPA Member States</h5>
        
        {country && (
          <span className="badge bg-primary">
            Currently viewing: {country}
          </span>
        )}
      </Card.Header>

      {/* Map Container */}
      <Card.Body style={{ height: '500px', minHeight: '500px', padding: 0 }}>
        <Suspense fallback={
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            Loading map components...
          </div>
        }>
          <ClientSideMap center={getCenter()} zoom={getZoomLevel()}>
            <Suspense fallback={null}>
              {memberCountries.map((countryData) => (
                <Marker
                  key={`${countryData.name}-${countryData.status}`}
                  position={[countryData.lat, countryData.lng]}
                  eventHandlers={{
                    click: () => onCountrySelect?.(countryData.name)
                  }}
                >
                  <Popup>
                    <div className="map-popup-content">
                      <h6>{countryData.name}</h6>
                      
                      <div className="d-flex align-items-center mt-2">
                        <span 
                          className="status-indicator"
                          style={{ backgroundColor: getStatusColor(countryData.status) }}
                        />
                        <span className="text-capitalize ms-2">
                          {countryData.status}
                        </span>
                      </div>
                      
                      {onCountrySelect && (
                        <button 
                          className="btn btn-sm btn-outline-primary mt-2 w-100"
                          onClick={() => onCountrySelect(countryData.name)}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </Suspense>
          </ClientSideMap>
        </Suspense>
      </Card.Body>
    </Card>
  );
};

MemberMap.propTypes = {
  country: PropTypes.string,
  onCountrySelect: PropTypes.func
};

MemberMap.defaultProps = {
  country: null,
  onCountrySelect: null
};

export default MemberMap;