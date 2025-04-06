/**
 * Main Application Component
 * 
 * This component serves as the root of the React application, handling:
 * - Routing configuration for all pages
 * - Authentication state management
 * - Token validation and interception
 * - Protected route setup
 * - Global layout (navbar and footer)
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Component imports organized by category
import Home from './components/Home';
import MemberDashboard from './components/MemberDashboard';
import About from './components/About';
import Services from './components/Services';
import Forms from './components/Forms';
import Members from './components/Members';
import News from './components/News';
import Gallery from './components/Gallery';
import Career from './components/Career';
import Contact from './components/Contact';
import Documents from './components/Documents';
import ExternalLinks from './components/ExternalLinks';

// Authentication-related components
import Login from './components/Login';
import PasswordRecovery from './components/PasswordRecovery';
import ForgotPassword from './components/ForgotPassword';
import RequestAccess from './components/Register';
import MemberOnlyPage from './components/MemberOnlyPage';
import PasswordReset from './components/PasswordReset';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Authentication providers and utilities
import { AuthProvider } from './auth/authProvider';
import ProtectedRoute from './auth/protectedRoute';

function App() {
  /**
   * Authentication and Token Management Effect
   * 
   * This useEffect hook handles:
   * 1. Token validation on initial app load
   * 2. Axios response interceptor for handling 401 unauthorized responses
   * 3. Cleanup of interceptors when component unmounts
   */
  useEffect(() => {
    /**
     * Checks the validity of the stored authentication token
     * - Retrieves token from localStorage
     * - Validates token (placeholder implementation)
     * - Clears invalid/expired tokens
     */
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // TODO: Implement actual token validation logic
        // Example: Check expiration or verify with backend
        const isExpired = false; // Placeholder - replace with real validation
        
        if (isExpired) {
          localStorage.removeItem('accessToken');
          // Optional: Redirect to login or show session expired message
        }
      }
    };

    /**
     * Axios Response Interceptor
     * 
     * Handles 401 Unauthorized responses by:
     * 1. Clearing invalid tokens
     * 2. Redirecting to login page
     * 3. Passing through all other errors
     */
    const interceptor = axios.interceptors.response.use(
      response => response, // Pass through successful responses
      error => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Run initial auth check
    checkAuth();

    // Cleanup function to remove interceptor when component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  return (
    <Router>
      {/* AuthProvider makes authentication state available to all child components */}
      <AuthProvider>
        {/* Global layout components */}
        <Navbar />
        
        {/* Main application routes */}
        <Routes>
          {/* ==================== */}
          {/* Public Routes */}
          {/* ==================== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/register" element={<RequestAccess />} />
          <Route path="/news" element={<News />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/external-links" element={<ExternalLinks />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/members" element={<Members />} />
          
          {/* Password reset with token parameter */}
          <Route path="/password-reset/:token" element={<PasswordReset />} />

          {/* ==================== */}
          {/* Protected Routes */}
          {/* ==================== */}
          {/* Wrapped in ProtectedRoute which checks authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/member-only" element={<MemberOnlyPage />} />
            <Route path="/member-dashboard" element={<MemberDashboard />} />
          </Route>

          {/* ==================== */}
          {/* Fallback Route */}
          {/* ==================== */}
          {/* Handles undefined routes by redirecting to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global footer */}
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;