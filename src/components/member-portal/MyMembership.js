import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, 
  Table, Alert, Spinner, Form, Modal, ProgressBar
} from 'react-bootstrap';
import { 
  FiUser, FiCalendar, FiCreditCard, FiDownload, 
  FiRefreshCw, FiCheckCircle, FiAlertCircle, FiInfo
} from 'react-icons/fi';
import axios from 'axios';

const MyMembership = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [membershipData, setMembershipData] = useState(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalPlan, setRenewalPlan] = useState('annual');
  const [renewalProcessing, setRenewalProcessing] = useState(false);
  const [renewalSuccess, setRenewalSuccess] = useState(false);

  // API configuration
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    timeout: 10000,
  });

  useEffect(() => {
    // Authentication interceptor
    const requestInterceptor = api.interceptors.request.use(config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/membership/details');
        setMembershipData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching membership data:', err);
        setError('Failed to load membership information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipData();
  }, []);

  const handleRenewalSubmit = async (e) => {
    e.preventDefault();
    setRenewalProcessing(true);
    
    try {
      // Simulate API call for renewal
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update membership data with new expiration date
      setMembershipData(prev => ({
        ...prev,
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        renewalHistory: [
          ...(prev.renewalHistory || []),
          {
            date: new Date().toISOString().split('T')[0],
            plan: renewalPlan,
            amount: renewalPlan === 'annual' ? 299 : 29.99
          }
        ]
      }));
      
      setRenewalSuccess(true);
      setTimeout(() => {
        setShowRenewalModal(false);
        setRenewalSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error processing renewal:', err);
      setError('Failed to process renewal. Please try again or contact support.');
    } finally {
      setRenewalProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'expired':
        return <Badge bg="danger">Expired</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const calculateDaysRemaining = (expirationDate) => {
    if (!expirationDate) return 0;
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpirationProgress = (daysRemaining) => {
    if (daysRemaining <= 0) return 0;
    if (daysRemaining > 365) return 100;
    return Math.round((daysRemaining / 365) * 100);
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading membership information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <FiAlertCircle className="me-2" />
        {error}
      </Alert>
    );
  }

  const daysRemaining = calculateDaysRemaining(membershipData?.expirationDate);
  const expirationProgress = getExpirationProgress(daysRemaining);

  return (
    <Container fluid className="p-0">
      {/* Membership Status Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h4 className="mb-3">Membership Status</h4>
              <div className="d-flex align-items-center mb-2">
                <div className="me-3">
                  {getStatusBadge(membershipData?.status)}
                </div>
                <div>
                  <strong>Member ID:</strong> {membershipData?.memberId || 'N/A'}
                </div>
              </div>
              <div className="mb-2">
                <strong>Member Since:</strong> {membershipData?.joinDate || 'N/A'}
              </div>
              <div className="mb-2">
                <strong>Expiration Date:</strong> {membershipData?.expirationDate || 'N/A'}
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Membership Validity</small>
                  <small>{daysRemaining} days remaining</small>
                </div>
                <ProgressBar 
                  now={expirationProgress} 
                  variant={daysRemaining < 30 ? 'danger' : daysRemaining < 90 ? 'warning' : 'success'} 
                />
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button 
                variant="primary" 
                className="mb-2 w-100 w-md-auto"
                onClick={() => setShowRenewalModal(true)}
              >
                <FiRefreshCw className="me-2" />
                Renew Membership
              </Button>
              <Button 
                variant="outline-secondary" 
                className="w-100 w-md-auto"
                onClick={() => window.open('/api/membership/card', '_blank')}
              >
                <FiDownload className="me-2" />
                Download Card
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Membership Benefits */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="mb-3">Membership Benefits</h4>
          <Row>
            <Col md={6}>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <FiCheckCircle className="text-success me-2" />
                  Access to Member Directory
                </li>
                <li className="mb-2">
                  <FiCheckCircle className="text-success me-2" />
                  Event Calendar Access
                </li>
                <li className="mb-2">
                  <FiCheckCircle className="text-success me-2" />
                  Resource Library
                </li>
                <li className="mb-2">
                  <FiCheckCircle className="text-success me-2" />
                  Discussion Forums
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <FiCheckCircle className="text-success me-2" />
                  Document Repository
                </li>
                <li className="mb-2">
                  <FiCheckCircle className="text-success me-2" />
                  Payment Processing
                </li>
                <li className="mb-2">
                  <FiCheckCircle className="text-success me-2" />
                  Member Support
                </li>
                <li className="mb-2">
                  <FiCheckCircle className="text-success me-2" />
                  Newsletter Subscription
                </li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Renewal History */}
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-3">Renewal History</h4>
          {membershipData?.renewalHistory && membershipData.renewalHistory.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {membershipData.renewalHistory.map((renewal, index) => (
                  <tr key={index}>
                    <td>{renewal.date}</td>
                    <td>{renewal.plan === 'annual' ? 'Annual' : 'Monthly'}</td>
                    <td>${renewal.amount.toFixed(2)}</td>
                    <td><Badge bg="success">Completed</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">
              <FiInfo className="me-2" />
              No renewal history available.
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Renewal Modal */}
      <Modal show={showRenewalModal} onHide={() => setShowRenewalModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Renew Membership</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renewalSuccess ? (
            <div className="text-center p-4">
              <FiCheckCircle size={48} className="text-success mb-3" />
              <h4>Renewal Successful!</h4>
              <p>Your membership has been renewed successfully.</p>
            </div>
          ) : (
            <Form onSubmit={handleRenewalSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Select Renewal Plan</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    id="annual-plan"
                    name="renewalPlan"
                    label="Annual ($299/year)"
                    checked={renewalPlan === 'annual'}
                    onChange={() => setRenewalPlan('annual')}
                    className="p-3 border rounded flex-grow-1"
                  />
                  <Form.Check
                    type="radio"
                    id="monthly-plan"
                    name="renewalPlan"
                    label="Monthly ($29.99/month)"
                    checked={renewalPlan === 'monthly'}
                    onChange={() => setRenewalPlan('monthly')}
                    className="p-3 border rounded flex-grow-1"
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select defaultValue="">
                  <option value="" disabled>Select payment method</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank">Bank Transfer</option>
                </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Total:</strong> ${renewalPlan === 'annual' ? '299.00' : '29.99'}
                </div>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={renewalProcessing}
                >
                  {renewalProcessing ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard className="me-2" />
                      Complete Payment
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyMembership; 