import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, 
  Table, Alert, Spinner, Form, Modal, Tabs, Tab,
  InputGroup, FormControl
} from 'react-bootstrap';
import { 
  FiCreditCard, FiDownload, FiPlus, FiTrash2, 
  FiCheckCircle, FiAlertCircle, FiSearch, FiFilter,
  FiDollarSign, FiCalendar, FiFileText, FiLock, FiInfo
} from 'react-icons/fi';
import axios from 'axios';

const PaymentProcessing = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeTab, setActiveTab] = useState('history');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

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
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/payments/data');
        setPaymentData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching payment data:', err);
        setError('Failed to load payment information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const handleAddCard = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call for adding card
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update payment data with new card
      setPaymentData(prev => ({
        ...prev,
        paymentMethods: [
          ...(prev.paymentMethods || []),
          {
            id: Date.now().toString(),
            type: 'credit',
            last4: newCard.cardNumber.slice(-4),
            expiryDate: newCard.expiryDate,
            isDefault: prev.paymentMethods.length === 0
          }
        ]
      }));
      
      setShowAddCardModal(false);
      setNewCard({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      });
    } catch (err) {
      console.error('Error adding card:', err);
      setError('Failed to add payment method. Please try again.');
    }
  };

  const handleRemoveCard = async (cardId) => {
    try {
      // Simulate API call for removing card
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update payment data by removing the card
      setPaymentData(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter(card => card.id !== cardId)
      }));
    } catch (err) {
      console.error('Error removing card:', err);
      setError('Failed to remove payment method. Please try again.');
    }
  };

  const handleSetDefaultCard = async (cardId) => {
    try {
      // Simulate API call for setting default card
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update payment data by setting the default card
      setPaymentData(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map(card => ({
          ...card,
          isDefault: card.id === cardId
        }))
      }));
    } catch (err) {
      console.error('Error setting default card:', err);
      setError('Failed to set default payment method. Please try again.');
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = (invoice) => {
    // Simulate downloading invoice
    window.open(`/api/payments/invoice/${invoice.id}/download`, '_blank');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'failed':
        return <Badge bg="danger">Failed</Badge>;
      case 'refunded':
        return <Badge bg="info">Refunded</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const filteredPayments = paymentData?.paymentHistory
    ? paymentData.paymentHistory.filter(payment => {
        const matchesSearch = 
          payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = 
          filterStatus === 'all' || payment.status === filterStatus;
        
        return matchesSearch && matchesFilter;
      })
    : [];

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading payment information...</p>
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

  return (
    <Container fluid className="p-0">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="history" title="Payment History">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Payment History</h4>
                <Button variant="outline-primary" size="sm">
                  <FiDownload className="me-2" />
                  Export
                </Button>
              </div>
              
              <Row className="mb-4">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FiSearch />
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Search payments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FiFilter />
                    </InputGroup.Text>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
              </Row>
              
              {filteredPayments.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.date}</td>
                        <td>{payment.description}</td>
                        <td>${payment.amount.toFixed(2)}</td>
                        <td>{getStatusBadge(payment.status)}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleViewInvoice(payment)}
                          >
                            <FiFileText className="me-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(payment)}
                          >
                            <FiDownload className="me-1" />
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  <FiInfo className="me-2" />
                  No payment history found.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="methods" title="Payment Methods">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Payment Methods</h4>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowAddCardModal(true)}
                >
                  <FiPlus className="me-2" />
                  Add Payment Method
                </Button>
              </div>
              
              {paymentData?.paymentMethods && paymentData.paymentMethods.length > 0 ? (
                <div className="payment-methods">
                  {paymentData.paymentMethods.map((method) => (
                    <Card key={method.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center">
                              <FiCreditCard className="me-2" size={24} />
                              <div>
                                <h6 className="mb-0">
                                  {method.type === 'credit' ? 'Credit Card' : 'Bank Account'} 
                                  {method.isDefault && (
                                    <Badge bg="primary" className="ms-2">Default</Badge>
                                  )}
                                </h6>
                                <p className="text-muted mb-0">
                                  **** **** **** {method.last4}
                                </p>
                                <small className="text-muted">
                                  Expires: {method.expiryDate}
                                </small>
                              </div>
                            </div>
                          </div>
                          <div>
                            {!method.isDefault && (
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleSetDefaultCard(method.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleRemoveCard(method.id)}
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert variant="info">
                  <FiInfo className="me-2" />
                  No payment methods added yet.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="invoices" title="Invoices">
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-4">Invoices</h4>
              
              {paymentData?.invoices && paymentData.invoices.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData.invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>{invoice.number}</td>
                        <td>{invoice.date}</td>
                        <td>${invoice.amount.toFixed(2)}</td>
                        <td>{getStatusBadge(invoice.status)}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <FiFileText className="me-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <FiDownload className="me-1" />
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  <FiInfo className="me-2" />
                  No invoices available.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Add Card Modal */}
      <Modal show={showAddCardModal} onHide={() => setShowAddCardModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCard}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                maxLength="19"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                value={newCard.cardName}
                onChange={(e) => setNewCard({...newCard, cardName: e.target.value})}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    value={newCard.expiryDate}
                    onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                    maxLength="5"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                    maxLength="4"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowAddCardModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Card
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Invoice Modal */}
      <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Invoice Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInvoice && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Invoice Information</h5>
                  <p><strong>Invoice #:</strong> {selectedInvoice.number || selectedInvoice.id}</p>
                  <p><strong>Date:</strong> {selectedInvoice.date}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedInvoice.status)}</p>
                </Col>
                <Col md={6} className="text-md-end">
                  <h5>Payment Details</h5>
                  <p><strong>Amount:</strong> ${selectedInvoice.amount.toFixed(2)}</p>
                  <p><strong>Payment Method:</strong> **** **** **** {selectedInvoice.paymentMethod?.last4 || '1234'}</p>
                  <p><strong>Transaction ID:</strong> {selectedInvoice.transactionId || 'N/A'}</p>
                </Col>
              </Row>
              
              <h5 className="mb-3">Items</h5>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                      <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Subtotal</strong></td>
                    <td>${selectedInvoice.subtotal?.toFixed(2) || (selectedInvoice.amount * 0.9).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Tax</strong></td>
                    <td>${selectedInvoice.tax?.toFixed(2) || (selectedInvoice.amount * 0.1).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total</strong></td>
                    <td><strong>${selectedInvoice.amount.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </Table>
              
              <div className="d-flex justify-content-end mt-4">
                <Button 
                  variant="primary"
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                >
                  <FiDownload className="me-2" />
                  Download Invoice
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PaymentProcessing; 