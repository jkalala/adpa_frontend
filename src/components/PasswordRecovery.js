import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8000/api/auth/password-recovery/', 
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    validateStatus: (status) => status < 500
                }
            );

            if (response.status === 200) {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login', { 
                        state: { 
                            message: 'Password recovery email sent successfully' 
                        } 
                    });
                }, 3000);
            } else if (response.data?.error) {
                setError(response.data.error);
            } else {
                setError('Unexpected response from server');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.error || 
                       err.response.data?.message || 
                       `Server error: ${err.response.status}`);
            } else if (err.request) {
                setError('No response from server. Please check your connection.');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card className="p-4" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="text-center mb-4">Password Recovery</h2>
                
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                {success && (
                    <Alert variant="success" className="text-center">
                        If an account exists with {email}, you'll receive a recovery link shortly.
                        <br />
                        Redirecting to login page...
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading || success}
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100"
                        disabled={isLoading || success}
                    >
                        {isLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Processing...
                            </>
                        ) : success ? 'Email Sent!' : 'Send Recovery Email'}
                    </Button>
                </Form>

                <div className="mt-3 text-center">
                    Remember your password?{' '}
                    <Button 
                        variant="link" 
                        onClick={() => navigate('/login')}
                        disabled={isLoading}
                    >
                        Login here
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default PasswordRecovery;