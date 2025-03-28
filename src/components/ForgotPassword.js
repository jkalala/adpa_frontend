import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled components for consistent styling
const AuthCard = styled(Card)`
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto;
`;

const AuthButton = styled(Button)`
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

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Replace with your actual API endpoint
            await axios.post('http://localhost:8000/api/password-reset/', { email });
            setSuccess('Password reset link sent to your email!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100">
                <Col md={8} lg={6} xl={5} className="mx-auto">
                    <AuthCard className="p-4 p-md-5">
                        <div className="text-center mb-4">
                            <Link to="/login" className="text-decoration-none d-inline-flex align-items-center mb-3">
                                <FiArrowLeft className="me-2" /> Back to login
                            </Link>
                            <h2 className="fw-bold mb-3">Reset Password</h2>
                            <p className="text-muted">
                                Enter your email and we'll send you a link to reset your password
                            </p>
                        </div>

                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                        {success && <Alert variant="success" className="text-center">{success}</Alert>}

                        <Form onSubmit={handleSubmit}>
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

                            <div className="d-grid mb-3">
                                <AuthButton type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    Send Reset Link
                                </AuthButton>
                            </div>

                            <div className="text-center mt-4">
                                <p className="small text-muted">
                                    Remember your password?{' '}
                                    <Link to="/login" className="text-decoration-none fw-bold">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </Form>
                    </AuthCard>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;