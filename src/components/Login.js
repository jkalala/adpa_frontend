/**
 * Login Component
 * 
 * This component handles user authentication including:
 * - Email/password login
 * - Google OAuth login
 * - reCAPTCHA verification
 * - CSRF protection
 * - Token management
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, FormCheck, Row, Col } from 'react-bootstrap';
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import styled, { keyframes } from 'styled-components';

/* ========== ANIMATIONS ========== */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`;

/* ========== STYLED COMPONENTS ========== */

/**
 * Main container with background and styling
 */
const LoginContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
  animation: ${fadeIn} 0.8s ease-out;
`;

/**
 * Styled card component for the login form with glassmorphism effect
 */
const LoginCard = styled(Card)`
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

/**
 * Header section with logo and title
 */
const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  
  h2 {
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #4cc9f0, #4361ee);
      border-radius: 2px;
    }
  }
  
  p {
    color: #6c757d;
    font-size: 1rem;
  }
`;

/**
 * Logo container with animation
 */
const LogoContainer = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4cc9f0, #4361ee);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 5px 15px rgba(76, 201, 240, 0.3);
  animation: ${pulse} 2s infinite ease-in-out;
  
  svg {
    color: white;
    font-size: 2.5rem;
  }
`;

/**
 * Styled login button with gradient background
 */
const LoginButton = styled(Button)`
  background: linear-gradient(135deg, #4cc9f0, #4361ee);
  border: none;
  padding: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.3);

  &:hover {
    background: linear-gradient(135deg, #3ab8df, #3250d4);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 201, 240, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #a8d9e9, #8a9ee9);
    transform: none;
    box-shadow: none;
  }
`;

/**
 * Styled Google login button
 */
const GoogleButton = styled(Button)`
  background: white;
  color: #5f6368;
  border: 1px solid #dadce0;
  padding: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 50px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #f8f9fa;
    transform: none;
    box-shadow: none;
  }
`;

/**
 * Icon container for form inputs
 */
const FormIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #4cc9f0;
  z-index: 1;
`;

/**
 * Password visibility toggle
 */
const PasswordToggle = styled.span`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
  z-index: 1;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4cc9f0;
  }
`;

/**
 * Divider with "OR" text between login options
 */
const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #6c757d;

  &::before, &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

/**
 * Form label with styling
 */
const FormLabel = styled(Form.Label)`
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

/**
 * Form control with custom styling
 */
const StyledFormControl = styled(Form.Control)`
  border-radius: 50px;
  padding: 0.75rem 1.25rem 0.75rem 40px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  height: 48px;
  
  &:focus {
    border-color: #4cc9f0;
    box-shadow: 0 0 0 0.25rem rgba(76, 201, 240, 0.25);
  }
`;

/**
 * Remember me checkbox with custom styling
 */
const StyledFormCheck = styled(FormCheck)`
  .form-check-input {
    border-radius: 4px;
    border-color: #4cc9f0;
    
    &:checked {
      background-color: #4cc9f0;
      border-color: #4cc9f0;
    }
    
    &:focus {
      box-shadow: 0 0 0 0.25rem rgba(76, 201, 240, 0.25);
    }
  }
  
  .form-check-label {
    font-size: 0.9rem;
    color: #6c757d;
  }
`;

/**
 * Forgot password link with styling
 */
const ForgotPasswordLink = styled.a`
  font-size: 0.9rem;
  color: #4cc9f0;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: #3ab8df;
    text-decoration: underline;
  }
`;

/**
 * Alert with custom styling
 */
const StyledAlert = styled(Alert)`
  border-radius: 12px;
  border: none;
  background-color: #f8d7da;
  color: #842029;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #dc3545;
  }
`;

/**
 * reCAPTCHA container with styling
 */
const RecaptchaContainer = styled.div`
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  padding: 0.5rem;
`;

/**
 * reCAPTCHA error message
 */
const RecaptchaError = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    font-size: 0.9rem;
  }
`;

/**
 * Loading spinner container
 */
const SpinnerContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  
  .spinner-border {
    width: 1rem;
    height: 1rem;
    border-width: 0.15em;
  }
`;

/* ========== AXIOS CLIENT CONFIGURATION ========== */

/**
 * Creates an axios instance with:
 * - Base URL configuration
 * - CSRF token handling
 * - Request/response interceptors
 * - Token refresh logic
 */
const createApiClient = () => {
  // Create axios instance with default config
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    withCredentials: true, // Required for cookies/sessions
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // Identifies AJAX requests
    }
  });

  // CSRF Token Management
  let csrfToken = null;

  /**
   * Fetches CSRF token from server
   */
  const fetchCSRFToken = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/api/auth/csrf/`,
        { withCredentials: true }
      );
      csrfToken = response.data.csrfToken;
      return csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      throw error;
    }
  };

  // Request interceptor - runs before each request
  instance.interceptors.request.use(async (config) => {
    // Add CSRF token for mutating requests (POST, PUT, PATCH, DELETE)
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      if (!csrfToken) {
        try {
          await fetchCSRFToken();
        } catch (error) {
          console.error('Could not get CSRF token', error);
          return Promise.reject(error);
        }
      }
      config.headers['X-CSRFToken'] = csrfToken;
    }

    // Add authorization header if access token exists
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Response interceptor - handles responses and errors
  instance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
      const originalRequest = error.config;
      
      // Handle CSRF token failures (403 errors)
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Refresh CSRF token and retry
          await fetchCSRFToken();
          originalRequest.headers['X-CSRFToken'] = csrfToken;
          return instance(originalRequest);
        } catch (csrfError) {
          return Promise.reject(new Error('Session expired. Please refresh the page.'));
        }
      }

      // Handle expired access tokens (401 errors)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('No refresh token available');
          
          // Request new access token using refresh token
          const refreshResponse = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/api/auth/token/refresh/`,
            { refresh: refreshToken },
            { withCredentials: true }
          );
          
          // Store new tokens and retry original request
          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          return instance(originalRequest);
        } catch (refreshError) {
          // Clear tokens and redirect to login if refresh fails
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  // Initialize CSRF token when API client is created
  fetchCSRFToken().catch(console.warn);

  return instance;
};

// Create API client instance
const api = createApiClient();

/* ========== MAIN LOGIN COMPONENT ========== */

const Login = () => {
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    // Component state
    const [state, setState] = useState({
        error: '',              // Error message to display
        showPassword: false,    // Password visibility toggle
        isLoading: false,       // Loading state
        recaptchaValue: null,   // reCAPTCHA response token
        recaptchaError: false,  // reCAPTCHA validation error
        recaptchaReady: false,  // reCAPTCHA script loaded state
    });
    
    // Refs and hooks
    const [recaptchaWidgetId, setRecaptchaWidgetId] = useState(null);
    const recaptchaRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Handles form input changes
     */
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    /**
     * Toggles password visibility
     */
    const togglePasswordVisibility = useCallback(() => {
        setState(prev => ({ ...prev, showPassword: !prev.showPassword }));
    }, []);

    /**
     * Handles reCAPTCHA verification
     */
    const handleRecaptchaChange = useCallback((value) => {
        setState(prev => ({ 
            ...prev, 
            recaptchaValue: value,
            recaptchaError: false 
        }));
    }, []);

    /**
     * Resets reCAPTCHA widget
     */
    const resetRecaptcha = useCallback(() => {
        if (window.grecaptcha && recaptchaWidgetId !== null) {
            window.grecaptcha.reset(recaptchaWidgetId);
        }
    }, [recaptchaWidgetId]);

    /**
     * Callback when reCAPTCHA script loads
     */
    const onRecaptchaLoad = useCallback(() => {
        if (window.grecaptcha) {
            setState(prev => ({ ...prev, recaptchaReady: true }));
        }
    }, []);

    /**
     * Load reCAPTCHA script on component mount
     */
    useEffect(() => {
        const loadRecaptcha = () => {
            // Skip if already loaded
            if (window.grecaptcha) {
                onRecaptchaLoad();
                return;
            }

            // Create script element
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCallback&render=explicit`;
            script.async = true;
            script.defer = true;
            script.id = 'recaptcha-script';

            // Set callback for when script loads
            window.onRecaptchaLoadCallback = onRecaptchaLoad;

            // Handle script loading errors
            script.onerror = () => {
                setState(prev => ({ 
                    ...prev, 
                    error: 'Failed to load security verification',
                    recaptchaReady: false
                }));
            };

            // Add to document
            document.body.appendChild(script);
            
            // Cleanup function
            return () => {
                const scriptElement = document.getElementById('recaptcha-script');
                if (scriptElement) {
                    document.body.removeChild(scriptElement);
                }
                delete window.onRecaptchaLoadCallback;
                if (window.grecaptcha && recaptchaWidgetId !== null) {
                    window.grecaptcha.reset(recaptchaWidgetId);
                }
            };
        };

        loadRecaptcha();
    }, [onRecaptchaLoad, recaptchaWidgetId]);

    /**
     * Handles email/password form submission
     */
    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        
        // Validate reCAPTCHA in production
        if (!state.recaptchaValue && process.env.NODE_ENV === 'production') {
            setState(prev => ({ ...prev, recaptchaError: true }));
            return;
        }

        // Set loading state
        setState(prev => ({ ...prev, isLoading: true, error: '' }));
        
        try {
            // Make login request
            const response = await api.post('/api/auth/login/', { 
                email: formData.email, 
                password: formData.password,
                recaptcha_token: state.recaptchaValue 
            });

            // Store tokens and update auth header
            const { access: accessToken, refresh: refreshToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            // Redirect to protected route or default
            navigate(location.state?.from?.pathname || '/member-only', { replace: true });

        } catch (err) {
            // Handle different error scenarios
            let errorMessage = 'Login failed. Please try again.';
            
            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = 'Invalid email or password';
                } else if (err.response.status === 403) {
                    errorMessage = 'Authentication failed. Please refresh the page and try again.';
                } else if (err.response.data?.detail) {
                    errorMessage = err.response.data.detail;
                }
            } else if (err.message.includes('Network Error')) {
                errorMessage = 'Cannot connect to server. Please check your connection.';
            } else if (err.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please try again.';
            }
            
            // Update state with error
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isLoading: false
            }));
            
            // Reset reCAPTCHA on error
            resetRecaptcha();
        }
    }, [formData.email, formData.password, state.recaptchaValue, navigate, location, resetRecaptcha]);

    /**
     * Handles Google OAuth login
     */
    const handleGoogleLogin = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: '' }));

        try {
            // Load Google OAuth script if not already loaded
            if (!window.google) {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
                throw new Error('Google authentication service loading...');
            }

            // Initialize Google OAuth client
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'email profile openid',
                callback: async (response) => {
                    if (response.error) {
                        throw new Error(response.error);
                    }

                    try {
                        // Send Google token to backend for verification
                        const res = await api.post('/api/auth/google/', {
                            id_token: response.credential
                        });
                        
                        // Store tokens and update auth header
                        localStorage.setItem('accessToken', res.data.access);
                        localStorage.setItem('refreshToken', res.data.refresh);
                        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                        
                        // Redirect to protected route
                        navigate('/member-only', { replace: true });
                    } catch (err) {
                        throw new Error(err.response?.data?.error || 'Authentication failed');
                    }
                }
            });
            
            // Trigger Google OAuth flow
            client.requestAccessToken();
        } catch (error) {
            setState(prev => ({ ...prev, error: error.message }));
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [navigate]);

    /**
     * Renders reCAPTCHA widget
     */
    const renderRecaptcha = useCallback(() => {
        // Show loading state if reCAPTCHA isn't ready
        if (!state.recaptchaReady) {
            return (
                <div className="text-muted small p-3 border rounded">
                    Loading security verification...
                </div>
            );
        }

        // Use test key in development, real key in production
        const sitekey = process.env.NODE_ENV === 'development' 
            ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Test key
            : process.env.REACT_APP_RECAPTCHA_SITE_KEY;

        // Show error if key is missing
        if (!sitekey) {
            return (
                <div className="text-danger small">
                    reCAPTCHA configuration error
                </div>
            );
        }

        // Render reCAPTCHA widget
        return (
            <div 
                className="g-recaptcha" 
                ref={(el) => {
                    if (el && window.grecaptcha && !recaptchaRef.current) {
                        const widgetId = window.grecaptcha.render(el, {
                            sitekey: sitekey,
                            callback: handleRecaptchaChange,
                            'expired-callback': resetRecaptcha,
                            'error-callback': resetRecaptcha
                        });
                        setRecaptchaWidgetId(widgetId);
                        recaptchaRef.current = el;
                    }
                }}
            />
        );
    }, [state.recaptchaReady, handleRecaptchaChange, resetRecaptcha]);

    // Render login form
    return (
        <LoginContainer>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5} xl={4}>
                    <LoginCard className="p-4 p-md-5">
                        {/* Header section with logo */}
                        <LoginHeader>
                            <LogoContainer>
                                <FiUser />
                            </LogoContainer>
                            <h2>Welcome Back</h2>
                            <p>Sign in to access your exclusive content</p>
                        </LoginHeader>

                        {/* Error display */}
                        {state.error && (
                            <StyledAlert variant="danger">
                                <FiAlertCircle />
                                {state.error}
                            </StyledAlert>
                        )}

                        {/* Google login button */}
                        <div className="d-grid mb-3">
                            <GoogleButton 
                                onClick={handleGoogleLogin} 
                                disabled={state.isLoading}
                            >
                                {state.isLoading ? (
                                    <SpinnerContainer>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    </SpinnerContainer>
                                ) : (
                                    <>
                                        <FcGoogle size={20} />
                                        Sign in with Google
                                    </>
                                )}
                            </GoogleButton>
                        </div>

                        {/* Divider */}
                        <Divider>
                            <span className="small">OR</span>
                        </Divider>

                        {/* Email/password form */}
                        <Form onSubmit={handleLogin}>
                            {/* Email input */}
                            <Form.Group className="mb-4 position-relative">
                                <FormLabel>Email Address</FormLabel>
                                <div className="position-relative">
                                    <FormIcon><FiMail /></FormIcon>
                                    <StyledFormControl
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            {/* Password input */}
                            <Form.Group className="mb-4 position-relative">
                                <FormLabel>Password</FormLabel>
                                <div className="position-relative">
                                    <FormIcon><FiLock /></FormIcon>
                                    <StyledFormControl
                                        type={state.showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <PasswordToggle onClick={togglePasswordVisibility}>
                                        {state.showPassword ? <FiEyeOff /> : <FiEye />}
                                    </PasswordToggle>
                                </div>
                            </Form.Group>

                            {/* Remember me and forgot password */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <StyledFormCheck
                                    type="checkbox"
                                    label="Remember me"
                                />
                                <ForgotPasswordLink href="/password-recovery">
                                    Forgot password?
                                </ForgotPasswordLink>
                            </div>

                            {/* reCAPTCHA */}
                            <RecaptchaContainer>
                                {renderRecaptcha()}
                                {state.recaptchaError && (
                                    <RecaptchaError>
                                        <FiAlertCircle />
                                        Please complete the security verification
                                    </RecaptchaError>
                                )}
                            </RecaptchaContainer>

                            {/* Submit button */}
                            <div className="d-grid mb-3">
                                <LoginButton 
                                    type="submit" 
                                    disabled={state.isLoading || (!state.recaptchaValue && process.env.NODE_ENV === 'production')}
                                >
                                    {state.isLoading ? (
                                        <SpinnerContainer>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </SpinnerContainer>
                                    ) : (
                                        <FiLogIn className="me-2" />
                                    )}
                                    Sign In
                                </LoginButton>
                            </div>
                        </Form>
                    </LoginCard>
                </Col>
            </Row>
        </LoginContainer>
    );
};

export default React.memo(Login);