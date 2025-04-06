import React, { useState, useEffect } from 'react';
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
// Ensure all these imports are pointing to the correct files
import MemberMap from './member-portal/MemberMap';
import FinancialReports from './member-portal/FinancialReports';
import ProjectsTable from './member-portal/ProjectsTable';
import CountryStatus from './member-portal/CountryStatus';
import DashboardMetrics from './member-portal/DashboardMetrics';
import DocumentRepository from './member-portal/DocumentRepository';
import CalendarEvents from './member-portal/CalendarEvents';
import './member-portal/styles/MemberOnlyPage.css';

// Create axios instance with base config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
});

const MemberOnlyPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Add request interceptor to include token
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  // Add response interceptor to handle 401 errors
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        setShowSessionModal(true);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await api.get('/api/member/data');
        setMemberData(response.data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  const handleApiError = (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          setError('Your session has expired. Please login again.');
          break;
        case 403:
          setError('You do not have permission to access this resource.');
          break;
        case 500:
          setError('Server error. Please try again later.');
          break;
        default:
          setError(err.response.data?.message || 'An error occurred');
      }
    } else if (err.request) {
      setError('Network error. Please check your connection.');
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/login', { replace: true });
    }
  };

  const handleSessionContinue = () => {
    setShowSessionModal(false);
    navigate('/login', { state: { from: location.pathname } });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading your member portal...</span>
      </div>
    );
  }

  if (error && !memberData) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="d-flex align-items-center">
          <FiAlertCircle className="me-2" size={24} />
          <div>
            <h5>Error Loading Member Portal</h5>
            <p className="mb-0">{error}</p>
            {error.includes('session') && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="mt-2"
                onClick={handleLogout}
              >
                Return to Login
              </Button>
            )}
          </div>
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
    <>
      <Container fluid className="member-portal-container">
        {renderPortalHeader()}

        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
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
                  <MemberMap country={memberData?.country} />
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
                  {/* Analytics components would go here */}
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      {/* Session Expired Modal */}
      <Modal show={showSessionModal} onHide={() => setShowSessionModal(false)} centered>
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
          <Button variant="primary" onClick={handleSessionContinue}>
            Return to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MemberOnlyPage;