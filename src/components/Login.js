import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, FormCheck, Row, Col } from 'react-bootstrap';
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';
import ReCAPTCHA from "react-google-recaptcha";

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

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
});

// Configure axios interceptors
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const [recaptchaError, setRecaptchaError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!recaptchaValue && process.env.NODE_ENV === 'production') {
            setRecaptchaError(true);
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const response = await api.post('/api/auth/login/', { 
                email, 
                password,
                recaptcha_token: recaptchaValue 
            });

            const { access: accessToken, refresh: refreshToken } = response.data;

            if (!accessToken) {
                throw new Error('No access token received');
            }

            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            
            // Set axios defaults
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            // Force state update before navigation
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Redirect to either the original path or /member-only
            const redirectPath = location.state?.from?.pathname || '/member-only';
            navigate(redirectPath, { replace: true });

        } catch (err) {
            console.error('Login error:', err);
            setError(
                err.response?.data?.detail || 
                err.response?.data?.message || 
                'Login failed. Please try again.'
            );
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            setError('');

            if (!window.google) {
                throw new Error('Google authentication service not available');
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
                        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                        navigate('/member-only', { replace: true });
                    } catch (err) {
                        throw new Error(err.response?.data?.error || 'Authentication failed');
                    }
                }
            });
            
            client.requestAccessToken();
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const onRecaptchaChange = (value) => {
        setRecaptchaValue(value);
        setRecaptchaError(false);
    };

    const renderRecaptcha = () => {
        const sitekey = process.env.NODE_ENV === 'development' 
            ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Test key
            : process.env.REACT_APP_RECAPTCHA_SITE_KEY;

        if (!sitekey) {
            console.error('reCAPTCHA site key is missing');
            return (
                <Alert variant="warning" className="text-center small">
                    Security verification is currently unavailable
                </Alert>
            );
        }

        return (
            <>
                <ReCAPTCHA
                    sitekey={sitekey}
                    onChange={onRecaptchaChange}
                />
                {recaptchaError && (
                    <div className="text-danger small mt-1">
                        Please verify you're not a robot
                    </div>
                )}
            </>
        );
    };

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

                        {error && (
                            <Alert variant="danger" className="text-center">
                                <FiAlertCircle className="me-2" />
                                {error}
                            </Alert>
                        )}

                        <div className="d-grid mb-3">
                            <GoogleButton 
                                onClick={handleGoogleLogin} 
                                disabled={isLoading}
                            >
                                {isLoading ? (
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
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ paddingLeft: '40px', height: '48px' }}
                                        className="rounded-pill border-0 bg-light"
                                    />
                                    <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
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
                            </div>

                            <div className="d-grid mb-3">
                                <LoginButton type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <FiLogIn className="me-2" />
                                    )}
                                    Sign In
                                </LoginButton>
                            </div>

                            <div className="text-center mt-4">
                                <p className="small text-muted">
                                    Don't have an account?{' '}
                                    <a href="/register" className="text-decoration-none fw-bold">
                                        Request access
                                    </a>
                                </p>
                            </div>
                        </Form>
                    </LoginCard>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;