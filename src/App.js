import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
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
import Login from './components/Login';
import PasswordRecovery from './components/PasswordRecovery';
import ForgotPassword from './components/ForgotPassword';
import RequestAccess from './components/Register';
import MemberOnlyPage from './components/MemberOnlyPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PasswordReset from './components/PasswordReset';
import { AuthProvider } from './auth/authProvider';
import ProtectedRoute from './auth/protectedRoute';

function App() {
  // Token validation and axios interceptor setup
  useEffect(() => {
    // Check token validity on app load
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Add your token validation logic here
        // For example: check expiration or verify with backend
        const isExpired = false; // Replace with actual validation
        if (isExpired) {
          localStorage.removeItem('accessToken');
        }
      }
    };

    // Response interceptor for 401 errors
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    checkAuth();

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
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
          <Route path="/password-reset/:token" element={<PasswordReset />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/member-only" element={<MemberOnlyPage />} />
            <Route path="/member-dashboard" element={<MemberDashboard />} />
            <Route path="/members" element={<Members />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;