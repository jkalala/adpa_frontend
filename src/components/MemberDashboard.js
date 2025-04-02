import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authProvider';
import axiosInstance from '../auth/axiosConfig';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';

const MemberDashboard = () => {
    const [memberData, setMemberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                const response = await axiosInstance.get('/api/member/');
                setMemberData(response.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError('You need to be a member to access this page');
                } else {
                    setError('Failed to load member data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMemberData();
    }, []);

    const handleEventRegistration = async (eventId) => {
        try {
            await axiosInstance.post('/api/member/', {
                action: 'register_event',
                event_id: eventId
            });
            setSuccess('Successfully registered for event!');
            // Refresh data
            const response = await axiosInstance.get('/api/member/');
            setMemberData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    {error}
                    {error.includes('member') && (
                        <div className="mt-2">
                            <Button variant="primary" onClick={() => navigate('/')}>
                                Back to Home
                            </Button>
                        </div>
                    )}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            {success && <Alert variant="success">{success}</Alert>}
            
            <Row className="mb-4">
                <Col>
                    <h2>Welcome, {memberData.user.first_name}!</h2>
                    <p className="text-muted">Member since {memberData.member_since}</p>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Your Upcoming Events</Card.Header>
                        <Card.Body>
                            {memberData.event_registrations.length > 0 ? (
                                <div className="list-group">
                                    {memberData.event_registrations.map(reg => (
                                        <div key={reg.event.id} className="list-group-item">
                                            <h5>{reg.event.title}</h5>
                                            <p>
                                                <small>
                                                    {new Date(reg.event.start_date).toLocaleString()} - 
                                                    {new Date(reg.event.end_date).toLocaleString()}
                                                </small>
                                            </p>
                                            <p>{reg.event.location}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>You haven't registered for any upcoming events.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Header>Available Events</Card.Header>
                        <Card.Body>
                            {memberData.upcoming_events.length > 0 ? (
                                <div className="list-group">
                                    {memberData.upcoming_events.map(event => (
                                        <div key={event.id} className="list-group-item">
                                            <h5>{event.title}</h5>
                                            <p>
                                                <small>
                                                    {new Date(event.start_date).toLocaleString()} - 
                                                    {new Date(event.end_date).toLocaleString()}
                                                </small>
                                            </p>
                                            <p>{event.location}</p>
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                onClick={() => handleEventRegistration(event.id)}
                                            >
                                                Register
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No upcoming events available.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MemberDashboard;