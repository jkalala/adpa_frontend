import React, { useState, useEffect, Suspense } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons (must be done before any map components render)
const initializeLeaflet = () => {
  const L = require('leaflet');
  
  // Fix for default marker icons
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
  });
  
  return L;
};

// Dynamically import react-leaflet components
const MapContainer = React.lazy(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })));
const TileLayer = React.lazy(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })));
const Marker = React.lazy(() => import('react-leaflet').then(mod => ({ default: mod.Marker })));
const Popup = React.lazy(() => import('react-leaflet').then(mod => ({ default: mod.Popup })));

const MemberMap = ({ country, onCountrySelect }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [L, setL] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  // ADPA member country data
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
  ];

  useEffect(() => {
    // Initialize only in browser environment
    if (typeof window !== 'undefined') {
      setIsBrowser(true);
      setL(initializeLeaflet());
    }
  }, []);

  const getCenter = () => {
    if (!country) return [0, 20]; // Default center (Africa)
    const found = memberCountries.find(c => c.name === country);
    return found ? [found.lat, found.lng] : [0, 20];
  };

  const getZoomLevel = () => country ? 6 : 3;

  const getStatusColor = (status) => status === 'member' ? '#2e7d32' : '#0288d1';

  const handleMapCreated = (map) => {
    // Fix for map sizing issues
    setTimeout(() => {
      map.invalidateSize();
      setMapReady(true);
    }, 0);
  };

  const handleMarkerClick = (countryName) => {
    if (onCountrySelect) {
      onCountrySelect(countryName);
    }
  };

  if (!isBrowser || !L) {
    return (
      <Card>
        <Card.Body className="text-center p-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Initializing map...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="member-map-container">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">ADPA Member States</h5>
        {country && (
          <span className="badge bg-primary">
            Currently viewing: {country}
          </span>
        )}
      </Card.Header>
      <Card.Body style={{ height: '500px', minHeight: '500px' }}>
        <Suspense fallback={
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" variant="secondary" />
          </div>
        }>
          <MapContainer
            center={getCenter()}
            zoom={getZoomLevel()}
            style={{ height: '100%', width: '100%' }}
            whenCreated={handleMapCreated}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {memberCountries.map((countryData) => (
              <Marker
                key={`${countryData.name}-${countryData.status}`}
                position={[countryData.lat, countryData.lng]}
                eventHandlers={{
                  click: () => handleMarkerClick(countryData.name)
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
                      <span className="text-capitalize ms-2">{countryData.status}</span>
                    </div>
                    {onCountrySelect && (
                      <button 
                        className="btn btn-sm btn-outline-primary mt-2 w-100"
                        onClick={() => handleMarkerClick(countryData.name)}
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Suspense>
        {!mapReady && (
          <div className="map-loading-overlay">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

MemberMap.propTypes = {
  country: PropTypes.string,
  onCountrySelect: PropTypes.func
};

export default MemberMap;