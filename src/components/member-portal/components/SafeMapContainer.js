// src/components/SafeMapContainer.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Client-side only components
let Leaflet;
let MapContainer, TileLayer, Marker, Popup;

if (typeof window !== 'undefined') {
  Leaflet = require('leaflet');
  require('leaflet/dist/leaflet.css');
  ({ MapContainer, TileLayer, Marker, Popup } = require('react-leaflet'));
}

const SafeMapContainer = ({ center, zoom, children }) => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Configure Leaflet icons
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
      setMapReady(true);
    }
  }, []);

  if (!mapReady || typeof window === 'undefined') {
    return <div className="map-loading">Loading map...</div>;
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

SafeMapContainer.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
  children: PropTypes.node
};

SafeMapContainer.defaultProps = {
  zoom: 13
};

export default SafeMapContainer;