import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, FormCheck, Row, Col } from 'react-bootstrap';
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import styled from 'styled-components';

// Styled components for modern look
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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/login/', { email, password });
            localStorage.setItem('accessToken', response.data.access);
            navigate('/member-only');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials or not a member');
        } finally {
            setIsLoading(false);
        }
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
                                {error}
                            </Alert>
                        )}

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