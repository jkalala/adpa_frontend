import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, FormCheck, Row, Col } from 'react-bootstrap';
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';

// ========== STYLED COMPONENTS ==========
const LoginCard = styled(Card)`
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const LoginButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
  }
`;

const GoogleButton = styled(Button)`
  background: white;
  color: #5f6368;
  border: 1px solid #dadce0;
  padding: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const FormIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
`;

const PasswordToggle = styled.span`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #6c757d;

  &::before, &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #dee2e6;
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

// Create axios instance with interceptors
const createApiClient = () => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  });

  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiClient();

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [state, setState] = useState({
        error: '',
        showPassword: false,
        isLoading: false,
        recaptchaValue: null,
        recaptchaError: false,
        recaptchaReady: false,
    });
    const recaptchaRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setState(prev => ({ ...prev, showPassword: !prev.showPassword }));
    }, []);

    useEffect(() => {
        const loadRecaptcha = () => {
            if (window.grecaptcha) {
                setState(prev => ({ ...prev, recaptchaReady: true }));
                return;
            }

            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                if (window.grecaptcha) {
                    setState(prev => ({ ...prev, recaptchaReady: true }));
                } else {
                    console.error('reCAPTCHA not available after script load');
                    setState(prev => ({ ...prev, error: 'Security verification failed to load' }));
                }
            };
            
            script.onerror = () => {
                console.error('Failed to load reCAPTCHA script');
                setState(prev => ({ ...prev, error: 'Failed to load security verification' }));
            };
            
            document.body.appendChild(script);
            return () => document.body.removeChild(script);
        };

        loadRecaptcha();
    }, []);

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        
        if (!state.recaptchaValue && process.env.NODE_ENV === 'production') {
            setState(prev => ({ ...prev, recaptchaError: true }));
            return;
        }

        setState(prev => ({ ...prev, isLoading: true, error: '' }));
        
        try {
            const response = await api.post('/api/auth/login/', { 
                email: formData.email, 
                password: formData.password,
                recaptcha_token: state.recaptchaValue 
            });

            const { access: accessToken, refresh: refreshToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            
            navigate(location.state?.from?.pathname || '/member-only', { replace: true });

        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err.response?.data?.detail || 
                      err.response?.data?.message || 
                      'Login failed. Please try again.'
            }));
            
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [formData.email, formData.password, state.recaptchaValue, navigate, location]);

    const handleGoogleLogin = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: '' }));

        try {
            if (!window.google) {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
                throw new Error('Google authentication service loading...');
            }

            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'email profile openid',
                callback: async (response) => {
                    if (response.error) {
                        throw new Error(response.error);
                    }

                    try {
                        const res = await api.post('/api/auth/google/', {
                            id_token: response.credential
                        });
                        
                        localStorage.setItem('accessToken', res.data.access);
                        localStorage.setItem('refreshToken', res.data.refresh);
                        navigate('/member-only', { replace: true });
                    } catch (err) {
                        throw new Error(err.response?.data?.error || 'Authentication failed');
                    }
                }
            });
            
            client.requestAccessToken();
        } catch (error) {
            setState(prev => ({ ...prev, error: error.message }));
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [navigate]);

    const handleRecaptchaChange = useCallback((value) => {
        setState(prev => ({ 
            ...prev, 
            recaptchaValue: value,
            recaptchaError: false 
        }));
    }, []);

    const renderRecaptcha = useCallback(() => {
        if (!state.recaptchaReady) {
            return (
                <div className="text-muted small p-3 border rounded">
                    Loading security verification...
                </div>
            );
        }

        const sitekey = process.env.NODE_ENV === 'development' 
            ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
            : process.env.REACT_APP_RECAPTCHA_SITE_KEY;

        if (!sitekey) {
            return (
                <div className="text-danger small">
                    reCAPTCHA configuration error
                </div>
            );
        }

        return (
            <div 
                className="g-recaptcha" 
                data-sitekey={sitekey}
                ref={recaptchaRef}
                onChange={handleRecaptchaChange}
            />
        );
    }, [state.recaptchaReady, handleRecaptchaChange]);

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5} xl={4}>
                    <LoginCard className="p-4 p-md-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold mb-3" style={{ color: '#343a40' }}>Welcome Back</h2>
                            <p className="text-muted">
                                Sign in to access your exclusive content
                            </p>
                        </div>

                        {state.error && (
                            <Alert variant="danger" className="text-center">
                                <FiAlertCircle className="me-2" />
                                {state.error}
                            </Alert>
                        )}

                        <div className="d-grid mb-3">
                            <GoogleButton 
                                onClick={handleGoogleLogin} 
                                disabled={state.isLoading}
                            >
                                {state.isLoading ? (
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                ) : (
                                    <>
                                        <FcGoogle size={20} />
                                        Sign in with Google
                                    </>
                                )}
                            </GoogleButton>
                        </div>

                        <Divider>
                            <span className="small">OR</span>
                        </Divider>

                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-4 position-relative">
                                <Form.Label className="small text-uppercase text-muted mb-2">
                                    Email Address
                                </Form.Label>
                                <div className="position-relative">
                                    <FormIcon><FiMail /></FormIcon>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{ paddingLeft: '40px', height: '48px' }}
                                        className="rounded-pill border-0 bg-light"
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4 position-relative">
                                <Form.Label className="small text-uppercase text-muted mb-2">
                                    Password
                                </Form.Label>
                                <div className="position-relative">
                                    <FormIcon><FiLock /></FormIcon>
                                    <Form.Control
                                        type={state.showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        style={{ paddingLeft: '40px', height: '48px' }}
                                        className="rounded-pill border-0 bg-light"
                                    />
                                    <PasswordToggle onClick={togglePasswordVisibility}>
                                        {state.showPassword ? <FiEyeOff /> : <FiEye />}
                                    </PasswordToggle>
                                </div>
                            </Form.Group>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <FormCheck
                                    type="checkbox"
                                    label="Remember me"
                                    className="small"
                                />
                                <a href="/password-recovery" className="small text-decoration-none">
                                    Forgot password?
                                </a>
                            </div>

                            <div className="mb-3">
                                {renderRecaptcha()}
                                {state.recaptchaError && (
                                    <div className="text-danger small mt-2">
                                        Please complete the security verification
                                    </div>
                                )}
                            </div>

                            <div className="d-grid mb-3">
                                <LoginButton 
                                    type="submit" 
                                    disabled={state.isLoading || (!state.recaptchaValue && process.env.NODE_ENV === 'production')}
                                >
                                    {state.isLoading ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
        </Container>
    );
};

export default React.memo(Login);