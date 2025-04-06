import React, { useState, useEffect, Suspense } from 'react';
import { 
  Container, Row, Col, Card, Tab, Nav, Alert, Spinner,
  Button, Dropdown, Modal
} from 'react-bootstrap';
import { 
  FiActivity, FiDollarSign, FiMap, FiUsers, FiCalendar,
  FiFileText, FiBarChart2, FiGlobe, FiSettings,
  FiDownload, FiLogOut, FiUser, FiAlertCircle
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Lazy load components to prevent initialization issues
const MemberMap = React.lazy(() => import('./MemberMap'));
const FinancialReports = React.lazy(() => import('./FinancialReports'));
const ProjectsTable = React.lazy(() => import('./ProjectsTable'));
const CountryStatus = React.lazy(() => import('./CountryStatus'));
const DashboardMetrics = React.lazy(() => import('./DashboardMetrics'));
const DocumentRepository = React.lazy(() => import('./DocumentRepository'));
const CalendarEvents = React.lazy(() => import('./CalendarEvents'));

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
});

const MemberOnlyPage = () => {
  const [state, setState] = useState({
    activeTab: 'dashboard',
    loading: true,
    error: null,
    memberData: null,
    showSessionModal: false
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Configure axios interceptors
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          setState(prev => ({ ...prev, showSessionModal: true }));
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Fetch member data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/member/data');
        setState(prev => ({
          ...prev,
          memberData: response.data,
          loading: false
        }));
      } catch (err) {
        handleApiError(err);
      }
    };

    fetchData();
  }, []);

  const handleApiError = (err) => {
    let errorMsg = 'An unexpected error occurred';
    
    if (err.response) {
      switch (err.response.status) {
        case 401: errorMsg = 'Your session has expired'; break;
        case 403: errorMsg = 'Permission denied'; break;
        case 500: errorMsg = 'Server error'; break;
        default: errorMsg = err.response.data?.message || errorMsg;
      }
    } else if (err.request) {
      errorMsg = 'Network error';
    }

    setState(prev => ({
      ...prev,
      error: errorMsg,
      loading: false
    }));
  };

  const handleTabSelect = (tab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/login', { replace: true });
    }
  };

  const { loading, error, memberData, showSessionModal, activeTab } = state;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading portal...</span>
      </div>
    );
  }

  if (error && !memberData) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <FiAlertCircle className="me-2" />
          {error}
          {error.includes('session') && (
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="mt-2 d-block"
              onClick={handleLogout}
            >
              Return to Login
            </Button>
          )}
        </Alert>
      </Container>
    );
  }

  const renderPortalHeader = () => (
    <Row>
      <Col lg={12} className="portal-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="portal-title">
              <FiGlobe className="me-2" />
              ADPA Member Portal
            </h2>
            <p className="portal-subtitle">
              Welcome back, {memberData?.country || 'Member'}
              {memberData?.membershipStatus && (
                <span className={`badge ms-2 ${memberData.membershipStatus === 'active' ? 'bg-success' : 'bg-warning'}`}>
                  {memberData.membershipStatus}
                </span>
              )}
            </p>
          </div>
          
          <Dropdown>
            <Dropdown.Toggle variant="link" id="dropdown-user" className="user-dropdown">
              <FiUser className="me-2" />
              {memberData?.userName || 'My Account'}
            </Dropdown.Toggle>
            
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => navigate('/profile')}>
                <FiSettings className="me-2" />
                Profile Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <FiLogOut className="me-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Col>
    </Row>
  );

  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    }>
      <Container fluid className="member-portal-container">
        {renderPortalHeader()}

        <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
          <Row>
            <Col lg={3} className="portal-sidebar">
              <Card className="sidebar-card">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="dashboard">
                      <FiActivity className="me-2" />
                      Dashboard
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="financial">
                      <FiDollarSign className="me-2" />
                      Financial Reports
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="membership">
                      <FiUsers className="me-2" />
                      Membership Status
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="projects">
                      <FiMap className="me-2" />
                      Implemented Projects
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="documents">
                      <FiFileText className="me-2" />
                      Document Repository
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="calendar">
                      <FiCalendar className="me-2" />
                      Events Calendar
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="analytics">
                      <FiBarChart2 className="me-2" />
                      Data Analytics
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card>

              <Card className="quick-actions mt-3">
                <Card.Header>
                  <h5>Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="mb-2 w-100"
                    onClick={() => navigate('/documents/certificate')}
                  >
                    <FiDownload className="me-2" />
                    Download Certificate
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="w-100"
                    onClick={() => navigate('/profile')}
                  >
                    <FiSettings className="me-2" />
                    Update Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={9} className="portal-content">
              <Tab.Content>
                <Tab.Pane eventKey="dashboard">
                  <DashboardMetrics data={memberData} />
                </Tab.Pane>
                <Tab.Pane eventKey="financial">
                  <FinancialReports 
                    country={memberData?.country} 
                    fiscalYear={memberData?.fiscalYear}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="membership">
                  <CountryStatus status={memberData?.membershipStatus} />
                  {memberData?.country && (
                    <MemberMap country={memberData.country} />
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="projects">
                  <ProjectsTable 
                    projects={memberData?.projects} 
                    country={memberData?.country}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="documents">
                  <DocumentRepository 
                    accessLevel={memberData?.accessLevel}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="calendar">
                  <CalendarEvents 
                    country={memberData?.country} 
                    region={memberData?.region}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="analytics">
                  <h4>Regional Analytics</h4>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

        <Modal show={showSessionModal} onHide={() => setState(prev => ({ ...prev, showSessionModal: false }))} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FiAlertCircle className="me-2 text-danger" />
              Session Expired
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Your session has expired due to inactivity. Please login again to continue.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Return to Login
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Suspense>
  );
};

export default MemberOnlyPage;