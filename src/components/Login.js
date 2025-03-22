import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, FormCheck, Row, Col } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login/', { email, password });
            localStorage.setItem('accessToken', response.data.access);  // Store token
            navigate('/member-only');  // Redirect to member-only page
        } catch (err) {
            setError('Invalid credentials or not a member');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="p-4">
                        <h1 className="text-center mb-4">Sign in</h1>
                        <p className="text-center mb-4">
                            This page is only available to people who have been given access.
                        </p>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FormCheck
                                    type="checkbox"
                                    label="Remember me"
                                />
                            </Form.Group>

                            <div className="d-grid mb-3">
                                <Button type="submit" variant="primary">
                                    Login
                                </Button>
                            </div>

                            <div className="text-center">
                                <a href="/password-recovery">Forgot your password?</a>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;