/**
 * Modern Member Portal Component
 * 
 * A sleek, interactive member portal with:
 * - Animated sidebar navigation
 * - Card-based dashboard with hover effects
 * - Interactive data tables
 * - Dark/light mode toggle
 * - Enhanced visual feedback
 * - Responsive design improvements
 */

import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Tab, Nav, Alert, Spinner,
  Button, Dropdown, Modal, Badge, Table, ListGroup
} from 'react-bootstrap';
import { 
  FiActivity, FiDollarSign, FiUsers, FiCalendar,
  FiFileText, FiBarChart2, FiGlobe, FiSettings,
  FiDownload, FiLogOut, FiUser, FiAlertCircle, FiMoon, FiSun
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CalendarEvents from './CalendarEvents';
import DocumentRepository from './DocumentRepository';
import CountryStatus from './CountryStatus';
import FinancialReports from './FinancialReports';
import './MemberPortal.css'; // Custom CSS for modern styling


// ==============================================
// MODERN COMPONENTS
// ==============================================

/**
 * AnimatedMetricCard Component
 * Displays a metric with hover animation
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Metric value
 * @param {ReactNode} props.icon - Icon component
 * @param {string} props.color - Background color variant
 */
const AnimatedMetricCard = ({ title, value, icon, color = 'primary' }) => (
  <Col md={4} className="mb-4">
    <Card className={`metric-card hover-effect bg-${color}-light`}>
      <Card.Body className="d-flex align-items-center">
        <div className={`metric-icon bg-${color}`}>
          {React.cloneElement(icon, { className: 'text-white' })}
        </div>
        <div className="ms-3">
          <h6 className="metric-title">{title}</h6>
          <h3 className="metric-value">{value}</h3>
        </div>
      </Card.Body>
    </Card>
  </Col>
);

/**
 * InteractiveTable Component
 * Enhanced table with hover effects and responsive design
 * @param {Object} props - Component props
 * @param {Array} props.data - Table data
 * @param {Array} props.columns - Column definitions
 */
const InteractiveTable = ({ data, columns }) => (
  <div className="table-responsive">
    <Table hover className="interactive-table">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td key={colIndex}>
                {col.accessor(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

// ==============================================
// MAIN COMPONENT
// ==============================================

const MemberOnlyPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // API configuration
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    timeout: 10000,
  });

  // ==============================================
  // EVENT HANDLERS
  // ==============================================

  /**
   * Handle API errors
   * @param {Error} err - The error object
   */
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

  /**
   * Handle logout functionality
   * Clears authentication token and redirects to login
   */
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

  /**
   * Handle session continuation
   * Redirects to login page when session expires
   */
  const handleSessionContinue = () => {
    setShowSessionModal(false);
    navigate('/login', { state: { from: location.pathname } });
  };

  // ==============================================
  // UI HANDLERS
  // ==============================================

  /**
   * Toggle dark/light mode
   */
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  /**
   * Toggle sidebar collapse state
   */
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // ==============================================
  // DATA FETCHING & AUTHENTICATION
  // ==============================================

  useEffect(() => {
    // Authentication interceptors
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
          setShowSessionModal(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

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

  // ==============================================
  // ENHANCED COMPONENTS
  // ==============================================

  /**
   * ModernDashboard Component
   * Enhanced dashboard with animated cards
   */
  const ModernDashboard = ({ data }) => (
    <div>
      <h4 className="section-title">Dashboard Overview</h4>
      <Row>
        <AnimatedMetricCard 
          title="Membership Status" 
          value={data?.membershipStatus || 'N/A'} 
          icon={<FiUser size={24} />}
          color={data?.membershipStatus === 'active' ? 'success' : 'warning'}
        />
        <AnimatedMetricCard 
          title="Active Projects" 
          value={data?.projects?.length || 0} 
          icon={<FiActivity size={24} />}
          color="info"
        />
        <AnimatedMetricCard 
          title="Documents" 
          value={data?.documents?.length || 0} 
          icon={<FiFileText size={24} />}
          color="primary"
        />
      </Row>
    </div>
  );

  /**
   * ModernProjectsTable Component
   * Enhanced projects table with interactive features
   */
  const ModernProjectsTable = ({ projects, country }) => {
    const columns = [
      { header: 'Name', accessor: item => item.name },
      { 
        header: 'Status', 
        accessor: item => (
          <Badge pill bg={item.status === 'completed' ? 'success' : 'warning'}>
            {item.status}
          </Badge>
        )
      },
      { header: 'Date', accessor: item => item.date },
      { 
        header: 'Actions', 
        accessor: () => (
          <Button variant="outline-primary" size="sm">
            Details
          </Button>
        )
      }
    ];

    return (
      <div>
        <h4 className="section-title">Projects in {country || 'Your Country'}</h4>
        {projects?.length > 0 ? (
          <InteractiveTable data={projects} columns={columns} />
        ) : (
          <Alert variant="info" className="mt-3">
            No projects found
          </Alert>
        )}
      </div>
    );
  };

  // ==============================================
  // RENDER FUNCTIONS
  // ==============================================

  /**
   * Render Modern Portal Header
   * Enhanced header with dark mode toggle
   */
  const renderPortalHeader = () => (
    <div className="modern-header">
      <div className="header-content">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <span className="hamburger"></span>
        </button>
        
        <div className="brand">
          <FiGlobe className="brand-icon" />
          <span className="brand-name">ADPA Portal</span>
        </div>
        
        <div className="header-actions">
          <Button 
            variant="link" 
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </Button>
          
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="user-menu">
              <div className="user-avatar">
                <FiUser />
              </div>
              <span className="user-name">{memberData?.userName || 'My Account'}</span>
            </Dropdown.Toggle>
            
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate('/profile')}>
                <FiSettings className="me-2" /> Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <FiLogOut className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );

  /**
   * Render Modern Sidebar
   * Collapsible sidebar with animated icons
   */
  const renderSidebar = () => (
    <div className={`modern-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <Nav variant="pills" className="flex-column">
        {[
          { key: 'dashboard', icon: <FiActivity />, label: 'Dashboard' },
          { key: 'financial', icon: <FiDollarSign />, label: 'Financials' },
          { key: 'membership', icon: <FiUsers />, label: 'Membership' },
          { key: 'projects', icon: <FiFileText />, label: 'Projects' },
          { key: 'documents', icon: <FiFileText />, label: 'Documents' },
          { key: 'calendar', icon: <FiCalendar />, label: 'Calendar' }
        ].map(item => (
          <Nav.Item key={item.key}>
            <Nav.Link 
              eventKey={item.key}
              active={activeTab === item.key}
              onClick={() => setActiveTab(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );

  // ==============================================
  // MAIN RENDER
  // ==============================================

  if (loading) {
    return (
      <div className="loading-screen">
        <Spinner animation="border" variant="primary" />
        <p className="loading-text">Loading your portal experience...</p>
      </div>
    );
  }

  if (error && !memberData) {
    return (
      <div className="error-container">
        <Alert variant="danger" className="error-alert">
          <FiAlertCircle size={24} className="me-3" />
          <div>
            <h4>Portal Unavailable</h4>
            <p>{error}</p>
            <Button 
              variant="outline-primary" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`member-portal ${darkMode ? 'dark' : 'light'}`}>
      {renderPortalHeader()}
      {renderSidebar()}
      
      <main className="portal-content">
        <Container fluid>
          <Tab.Container activeKey={activeTab}>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <ModernDashboard data={memberData} />
              </Tab.Pane>
              
              <Tab.Pane eventKey="financial">
                <FinancialReports 
                  country={memberData?.country} 
                  fiscalYear={memberData?.fiscalYear}
                />
              </Tab.Pane>
              
              <Tab.Pane eventKey="membership">
                <CountryStatus status={memberData?.membershipStatus} />
              </Tab.Pane>
              
              <Tab.Pane eventKey="projects">
                <ModernProjectsTable 
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
            </Tab.Content>
          </Tab.Container>
        </Container>
      </main>

      {/* Modern Session Modal */}
      <Modal 
        show={showSessionModal} 
        onHide={() => setShowSessionModal(false)} 
        centered
        className="session-modal"
      >
        <Modal.Body className="text-center p-4">
          <FiAlertCircle size={48} className="text-danger mb-3" />
          <h4>Session Expired</h4>
          <p className="mb-4">Your session has ended. Please log in again to continue.</p>
          <Button 
            variant="primary" 
            className="w-100"
            onClick={handleSessionContinue}
          >
            Return to Login
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MemberOnlyPage;