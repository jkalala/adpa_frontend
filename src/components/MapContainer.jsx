// src/components/MapContainer.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Client-side only components to prevent SSR issues
 * with Leaflet that requires window object
 */
const DynamicMapContainer = ({ children, ...props }) => {
  const [MapComponents, setMapComponents] = useState(null);

  useEffect(() => {
    // Dynamically import on client side only
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      require('leaflet/dist/leaflet.css');
      
      // Fix Leaflet marker icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
        iconUrl: require('leaflet/dist/images/marker-icon.png').default,
        shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
      });

      // Import react-leaflet components
      Promise.all([
        import('react-leaflet').then(mod => mod.MapContainer),
        import('react-leaflet').then(mod => mod.TileLayer),
        import('react-leaflet').then(mod => mod.Marker),
        import('react-leaflet').then(mod => mod.Popup),
        import('react-leaflet').then(mod => mod.useMap),
      ]).then(([
        MapContainer, 
        TileLayer, 
        Marker, 
        Popup, 
        useMap
      ]) => {
        setMapComponents({
          MapContainer,
          TileLayer,
          Marker,
          Popup,
          useMap
        });
      });
    }
  }, []);

  if (!MapComponents) {
    return <div>Loading map components...</div>;
  }

  return (
    <MapComponents.MapContainer {...props}>
      {React.Children.map(children, child => {
        return React.cloneElement(child, { components: MapComponents });
      })}
    </MapComponents.MapContainer>
  );
};

/**
 * MapController handles geolocation functionality
 */
const MapController = ({ setPosition, onError, components }) => {
  const { useMap } = components || {};
  const map = useMap?.();

  useEffect(() => {
    if (!map || !navigator.geolocation) {
      onError?.('Geolocation not supported');
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      const newPosition = [latitude, longitude];
      setPosition(newPosition);
      map.flyTo(newPosition, 15);
    };

    const handleError = (error) => {
      onError?.(`Geolocation error: ${error.message}`);
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, setPosition, onError]);

  return null;
};

/**
 * Main Map Component
 */
const ReactLeafletMap = ({ 
  countries = [], 
  center = { lat: 51.505, lng: -0.09 }, 
  zoom = 13 
}) => {
  const [currentPosition, setCurrentPosition] = useState([center.lat, center.lng]);
  const [error, setError] = useState(null);

  return (
    <div style={{ 
      height: '100vh',
      width: '100%',
      minHeight: '400px',
      position: 'relative'
    }}>
      {error && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          padding: '10px',
          background: 'rgba(255, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}

      <DynamicMapContainer
        center={currentPosition}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        {({ components }) => (
          <>
            <components.TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <components.Marker position={currentPosition}>
              <components.Popup>
                <div>
                  <strong>Your Location</strong>
                  <div>Lat: {currentPosition[0].toFixed(4)}</div>
                  <div>Lng: {currentPosition[1].toFixed(4)}</div>
                </div>
              </components.Popup>
            </components.Marker>

            {countries.map((country) => (
              <components.Marker
                key={`${country.name}-${country.lat}-${country.lng}`}
                position={[country.lat, country.lng]}
              >
                <components.Popup>
                  <strong>{country.name}</strong>
                  <div>Status: {country.status}</div>
                </components.Popup>
              </components.Marker>
            ))}

            <MapController 
              setPosition={setCurrentPosition}
              onError={setError}
              components={components}
            />
          </>
        )}
      </DynamicMapContainer>
    </div>
  );
};

// Prop type validation
ReactLeafletMap.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired
    })
  ),
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  zoom: PropTypes.number
};

ReactLeafletMap.defaultProps = {
  countries: [],
  center: { lat: 51.505, lng: -0.09 },
  zoom: 13
};

export default ReactLeafletMap;