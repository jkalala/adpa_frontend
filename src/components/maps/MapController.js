/**
 * MapController Component
 * 
 * A controller component for react-leaflet maps that handles geolocation functionality.
 * Manages map centering, zooming to user location, and provides callbacks for location events.
 */

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import PropTypes from 'prop-types';

/**
 * Location data object interface
 * @typedef {Object} LocationData
 * @property {[number, number]} position - Latitude and longitude array
 * @property {number} accuracy - Accuracy of the position in meters
 * @property {number} timestamp - When the position was acquired (ms since epoch)
 */

/**
 * MapController Component
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.setPosition - Callback to update parent component's position state
 * @param {Function} [props.onLocationFound] - Callback when user location is successfully acquired
 * @param {Function} [props.onLocationError] - Callback when location acquisition fails
 * @param {number} [props.zoomLevel=15] - Map zoom level when centering on user location
 * @param {boolean} [props.enableHighAccuracy=true] - Whether to request high accuracy positioning
 * @param {number} [props.timeout=10000] - Maximum time (ms) to wait for location before timing out
 */
const MapController = ({ 
  setPosition,
  onLocationFound,
  onLocationError,
  zoomLevel = 15,
  enableHighAccuracy = true,
  timeout = 10000
}) => {
  // Get the map instance from react-leaflet context
  const map = useMap();

  // Main effect hook for geolocation functionality
  useEffect(() => {
    // First check if geolocation API is available
    if (!navigator.geolocation) {
      const error = new Error('Geolocation is not supported by your browser');
      console.warn(error.message);
      
      // Notify parent component if error callback provided
      onLocationError?.(error);
      return;
    }

    /**
     * Success handler for geolocation API
     * @param {GeolocationPosition} position - Geolocation position object
     */
    const handleSuccess = (position) => {
      // Extract coordinates from position
      const { latitude, longitude, accuracy } = position.coords;
      const newPosition = [latitude, longitude];
      
      // Update parent component's position state
      setPosition(newPosition);
      
      // Smoothly animate map to new position
      map.flyTo(newPosition, zoomLevel);
      
      // If provided, call location found callback with detailed data
      onLocationFound?.({
        position: newPosition,
        accuracy,
        timestamp: position.timestamp
      });
    };

    /**
     * Error handler for geolocation API
     * @param {GeolocationPositionError} error - Geolocation error object
     */
    const handleError = (error) => {
      console.warn(`Geolocation error (${error.code}): ${error.message}`);
      
      // Notify parent component if error callback provided
      onLocationError?.(error);
    };

    // Geolocation API options
    const options = {
      enableHighAccuracy,  // Whether to use GPS if available
      timeout,            // Maximum time to wait for location
      maximumAge: 0       // Don't use cached positions
    };

    // Start watching position with the geolocation API
    // Returns a watch ID that can be used to stop watching
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // Cleanup function - runs when component unmounts
    return () => {
      // Stop watching the position to prevent memory leaks
      navigator.geolocation.clearWatch(watchId);
    };
    
    // Dependency array - effect will re-run if any of these change
  }, [map, setPosition, onLocationFound, onLocationError, zoomLevel, enableHighAccuracy, timeout]);

  // This component doesn't render any DOM elements
  return null;
};

// Prop type validation
MapController.propTypes = {
  /** Required function to update position state in parent component */
  setPosition: PropTypes.func.isRequired,
  
  /** Optional callback when location is successfully found */
  onLocationFound: PropTypes.func,
  
  /** Optional callback when location error occurs */
  onLocationError: PropTypes.func,
  
  /** Zoom level when centering on location (default: 15) */
  zoomLevel: PropTypes.number,
  
  /** Whether to use high accuracy mode (default: true) */
  enableHighAccuracy: PropTypes.bool,
  
  /** Timeout for geolocation request in milliseconds (default: 10000) */
  timeout: PropTypes.number
};

export default MapController;