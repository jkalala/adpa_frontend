import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types'; // Added PropTypes import
import 'leaflet/dist/leaflet.css';

/**
 * Default icon configuration for Leaflet markers
 * 
 * Fixes the common issue where Leaflet markers don't appear properly in React applications.
 * Uses Webpack's require to ensure proper path resolution for marker images.
 */
const DefaultIcon = L.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
  iconSize: [25, 41],        // Size of the icon in pixels [width, height]
  iconAnchor: [12, 41],      // The point of the icon that will correspond to marker's location
  popupAnchor: [1, -34],     // The point from which popups will "open" relative to the iconAnchor
  shadowSize: [41, 41]       // Size of the shadow image
});

// Set this icon as the default for all markers
L.Marker.prototype.options.icon = DefaultIcon;

/**
 * ReactLeafletMap Component
 * 
 * A reusable map component that displays countries as markers with popups.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.countries - Array of country objects to display as markers
 * @param {Object} props.center - Initial map center coordinates {lat: number, lng: number}
 * @param {number} props.zoom - Initial zoom level
 * 
 * @example
 * <ReactLeafletMap
 *   countries={countriesData}
 *   center={{ lat: 51.505, lng: -0.09 }}
 *   zoom={5}
 * />
 */
const ReactLeafletMap = ({ countries, center, zoom }) => {
  /**
   * Effect hook for managing Leaflet CSS
   * 
   * Ensures Leaflet CSS is properly loaded, even if the direct import fails.
   * This is a fallback mechanism that creates a link element in the document head.
   */
  useEffect(() => {
    // Check if Leaflet CSS is already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      link.integrity = 'sha384-SMf/6S4iL7Z5+5y5g5v5g5g5g5g5';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Cleanup function to remove the link when component unmounts
    return () => {
      const link = document.querySelector('link[href*="leaflet.css"]');
      if (link) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    /**
     * MapContainer is the root component from react-leaflet that creates the map instance
     * 
     * @param center - The initial center of the map [lat, lng]
     * @param zoom - The initial zoom level
     * @param style - CSS styles for the map container
     */
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      {/**
       * TileLayer provides the base map tiles from OpenStreetMap
       * 
       * @param url - Template URL for the map tiles
       * @param attribution - Required attribution for OpenStreetMap
       */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/**
       * Render markers for each country in the countries array
       * 
       * Each marker has a popup with country information
       */}
      {countries.map((country, index) => (
        <Marker
          key={`${country.name}-${index}`}  // Unique key for React reconciliation
          position={[country.lat, country.lng]}  // Marker position [lat, lng]
        >
          {/**
           * Popup that appears when marker is clicked
           */}
          <Popup>
            <strong>{country.name}</strong><br />
            Status: {country.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// Prop type validation
ReactLeafletMap.propTypes = {
  /**
   * Array of country objects to display on the map
   * Each country should have: name, lat, lng, and status properties
   */
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired
    })
  ).isRequired,

  /**
   * Initial center coordinates of the map
   */
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired,

  /**
   * Initial zoom level of the map (0-18 typically)
   */
  zoom: PropTypes.number.isRequired
};

export default ReactLeafletMap;