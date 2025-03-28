import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { FiMail, FiUser, FiBriefcase, FiFileText } from 'react-icons/fi';
import styled from 'styled-components';

const RequestAccessCard = styled(Card)`
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;
`;

const RequestAccess = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    organization: '',
    position: '',
    purpose: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('/api/access-request/', formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <RequestAccessCard className="p-5 text-center">
          <h2 className="mb-4">Request Submitted</h2>
          <p className="mb-4">
            Thank you for your interest! We've received your access request and will review it shortly.
            You'll receive an email with our decision.
          </p>
          <Button variant="primary" onClick={() => setSuccess(false)}>
            Submit Another Request
          </Button>
        </RequestAccessCard>
      </Container>
    );
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={8} lg={6} xl={5} className="mx-auto">
          <RequestAccessCard className="p-4 p-md-5">
            <h2 className="text-center mb-4">Request Access</h2>
            <p className="text-center text-muted mb-4">
              Please fill out this form to request access to our member portal.
            </p>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Organization</Form.Label>
                <Form.Control
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Purpose of Access</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  placeholder="Please describe why you need access..."
                />
              </Form.Group>

              <div className="d-grid">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner as="span" animation="border" size="sm" />
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </Form>
          </RequestAccessCard>
        </Col>
      </Row>
    </Container>
  );
};

export default RequestAccess;