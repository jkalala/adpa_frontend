/**
 * Modern Member Portal Component
 * 
 * A sleek, minimalist member portal with:
 * - Card-based dashboard with glassmorphism effects
 * - Intuitive navigation with visual indicators
 * - Interactive data visualizations
 * - Dark/light mode toggle with smooth transitions
 * - Enhanced visual feedback and animations
 * - Fully responsive design
 */

import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Tab, Nav, Alert, Spinner,
  Button, Dropdown, Modal, Badge, Table, ListGroup
} from 'react-bootstrap';
import { 
  FiActivity, FiDollarSign, FiUsers, FiCalendar,
  FiFileText, FiBarChart2, FiGlobe, FiSettings,
  FiDownload, FiLogOut, FiUser, FiAlertCircle, FiMoon, FiSun,
  FiHome, FiGrid, FiFolder, FiBook, FiClock, FiMenu, FiX
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CountryStatus from  './member-portal/CountryStatus';
import FinancialReports from './member-portal/FinancialReports';
import DocumentRepository from'./member-portal/DocumentRepository';
import CalendarEvents from './member-portal/CalendarEvents';
import './MemberPortal.css'; // Custom CSS for modern styling

// ==============================================
// MODERN COMPONENTS
// ==============================================

/**
 * GlassCard Component
 * Displays content in a glassmorphism card with hover effects
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 */
const GlassCard = ({ children, className = '' }) => (
  <Card className={`glass-card ${className}`}>
    <Card.Body>
      {children}
    </Card.Body>
  </Card>
);

/**
 * StatCard Component
 * Displays a statistic with icon and trend indicator
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Statistic value
 * @param {ReactNode} props.icon - Icon component
 * @param {string} props.trend - Trend indicator (up/down)
 * @param {string} props.trendValue - Trend value
 * @param {string} props.color - Accent color
 */
const StatCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => (
  <GlassCard className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: `var(--${color}-light)` }}>
      {React.cloneElement(icon, { className: `text-${color}` })}
    </div>
    <div className="stat-content">
      <h6 className="stat-title">{title}</h6>
      <h3 className="stat-value">{value}</h3>
      {trend && (
        <div className={`stat-trend ${trend}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </div>
      )}
    </div>
  </GlassCard>
);

/**
 * NavCard Component
 * Interactive navigation card with hover effects
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {ReactNode} props.icon - Icon component
 * @param {string} props.color - Accent color
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.active - Active state
 */
const NavCard = ({ title, icon, color = 'primary', onClick, active }) => (
  <div 
    className={`nav-card ${active ? 'active' : ''}`} 
    onClick={onClick}
    style={{ 
      borderLeft: active ? `4px solid var(--${color})` : 'none',
      backgroundColor: active ? `var(--${color}-light)` : 'transparent'
    }}
  >
    <div className="nav-card-icon" style={{ color: `var(--${color})` }}>
      {icon}
    </div>
    <div className="nav-card-title">{title}</div>
  </div>
);

/**
 * DataTable Component
 * Modern table with hover effects and responsive design
 * @param {Object} props - Component props
 * @param {Array} props.data - Table data
 * @param {Array} props.columns - Column definitions
 */
const DataTable = ({ data, columns }) => (
  <div className="table-responsive">
    <Table hover className="data-table">
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
   * Toggle mobile menu
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
   * Dashboard Component
   * Modern dashboard with stat cards and activity feed
   */
  const Dashboard = ({ data }) => (
    <div className="dashboard-container">
      <h2 className="page-title">Dashboard</h2>
      
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <StatCard 
            title="Membership Status" 
            value={data?.membershipStatus || 'N/A'} 
            icon={<FiUser size={24} />}
            trend="up"
            trendValue="Active"
            color={data?.membershipStatus === 'active' ? 'success' : 'warning'}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            title="Active Projects" 
            value={data?.projects?.length || 0} 
            icon={<FiActivity size={24} />}
            trend="up"
            trendValue="+2 this month"
            color="info"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            title="Documents" 
            value={data?.documents?.length || 0} 
            icon={<FiFileText size={24} />}
            trend="up"
            trendValue="+5 this week"
            color="primary"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            title="Upcoming Events" 
            value={data?.events?.length || 0} 
            icon={<FiCalendar size={24} />}
            trend="up"
            trendValue="Next: 3 days"
            color="secondary"
          />
        </Col>
      </Row>
      
      <Row className="g-4">
        <Col lg={8}>
          <GlassCard className="activity-card">
            <h4 className="card-title">Recent Activity</h4>
            <ListGroup variant="flush" className="activity-list">
              {data?.activities?.slice(0, 5).map((activity, index) => (
                <ListGroup.Item key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'document' && <FiFileText />}
                    {activity.type === 'project' && <FiActivity />}
                    {activity.type === 'event' && <FiCalendar />}
                    {activity.type === 'financial' && <FiDollarSign />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </ListGroup.Item>
              ))}
              {(!data?.activities || data.activities.length === 0) && (
                <ListGroup.Item className="text-center text-muted">
                  No recent activity
                </ListGroup.Item>
              )}
            </ListGroup>
          </GlassCard>
        </Col>
        <Col lg={4}>
          <GlassCard className="quick-actions-card">
            <h4 className="card-title">Quick Actions</h4>
            <div className="quick-actions">
              <Button variant="outline-primary" className="quick-action-btn">
                <FiDownload className="me-2" /> Download Report
              </Button>
              <Button variant="outline-primary" className="quick-action-btn">
                <FiCalendar className="me-2" /> Schedule Meeting
              </Button>
              <Button variant="outline-primary" className="quick-action-btn">
                <FiFileText className="me-2" /> Upload Document
              </Button>
            </div>
          </GlassCard>
        </Col>
      </Row>
    </div>
  );

  /**
   * ProjectsTable Component
   * Enhanced projects table with interactive features
   */
  const ProjectsTable = ({ projects, country }) => {
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
      <div className="projects-container">
        <h2 className="page-title">Projects in {country || 'Your Country'}</h2>
        <GlassCard>
          {projects?.length > 0 ? (
            <DataTable data={projects} columns={columns} />
          ) : (
            <Alert variant="info" className="mt-3">
              No projects found
            </Alert>
          )}
        </GlassCard>
      </div>
    );
  };

  // ==============================================
  // RENDER FUNCTIONS
  // ==============================================

  /**
   * Render Portal Header
   * Modern header with dark mode toggle and user menu
   */
  const renderHeader = () => (
    <header className="portal-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <div className="brand">
          <FiGlobe className="brand-icon" />
          <span className="brand-name">ADPA Portal</span>
        </div>
      </div>
      
      <div className="header-right">
        <Button 
          variant="link" 
          className="theme-toggle"
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
          
          <Dropdown.Menu className="user-dropdown">
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
    </header>
  );

  /**
   * Render Navigation
   * Modern navigation with visual indicators
   */
  const renderNavigation = () => (
    <nav className={`portal-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="nav-header">
        <h3 className="nav-title">Menu</h3>
      </div>
      
      <div className="nav-items">
        <NavCard 
          title="Dashboard" 
          icon={<FiHome size={20} />} 
          color="primary"
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        />
        <NavCard 
          title="Financials" 
          icon={<FiDollarSign size={20} />} 
          color="success"
          active={activeTab === 'financial'}
          onClick={() => setActiveTab('financial')}
        />
        <NavCard 
          title="Membership" 
          icon={<FiUsers size={20} />} 
          color="info"
          active={activeTab === 'membership'}
          onClick={() => setActiveTab('membership')}
        />
        <NavCard 
          title="Projects" 
          icon={<FiGrid size={20} />} 
          color="warning"
          active={activeTab === 'projects'}
          onClick={() => setActiveTab('projects')}
        />
        <NavCard 
          title="Documents" 
          icon={<FiFolder size={20} />} 
          color="secondary"
          active={activeTab === 'documents'}
          onClick={() => setActiveTab('documents')}
        />
        <NavCard 
          title="Calendar" 
          icon={<FiClock size={20} />} 
          color="danger"
          active={activeTab === 'calendar'}
          onClick={() => setActiveTab('calendar')}
        />
      </div>
    </nav>
  );

  // ==============================================
  // MAIN RENDER
  // ==============================================

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
        <p className="loading-text">Loading your portal experience...</p>
      </div>
    );
  }

  if (error && !memberData) {
    return (
      <div className="error-container">
        <GlassCard className="error-card">
          <div className="error-icon">
            <FiAlertCircle size={48} />
          </div>
          <h3>Portal Unavailable</h3>
          <p>{error}</p>
          <Button 
            variant="primary" 
            className="mt-3"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className={`member-portal ${darkMode ? 'dark' : 'light'}`}>
      {renderHeader()}
      {renderNavigation()}
      
      <main className="portal-content">
        <Container fluid>
          <Tab.Container activeKey={activeTab}>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <Dashboard data={memberData} />
              </Tab.Pane>
              
              <Tab.Pane eventKey="financial">
                <div className="section-container">
                  <h2 className="page-title">Financial Reports</h2>
                  <GlassCard>
                    <FinancialReports 
                      country={memberData?.country} 
                      fiscalYear={memberData?.fiscalYear}
                    />
                  </GlassCard>
                </div>
              </Tab.Pane>
              
              <Tab.Pane eventKey="membership">
                <div className="section-container">
                  <h2 className="page-title">Membership Status</h2>
                  <GlassCard>
                    <CountryStatus status={memberData?.membershipStatus} />
                  </GlassCard>
                </div>
              </Tab.Pane>
              
              <Tab.Pane eventKey="projects">
                <ProjectsTable 
                  projects={memberData?.projects} 
                  country={memberData?.country}
                />
              </Tab.Pane>
              
              <Tab.Pane eventKey="documents">
                <div className="section-container">
                  <h2 className="page-title">Document Repository</h2>
                  <GlassCard>
                    <DocumentRepository 
                      accessLevel={memberData?.accessLevel}
                    />
                  </GlassCard>
                </div>
              </Tab.Pane>
              
              <Tab.Pane eventKey="calendar">
                <div className="section-container">
                  <h2 className="page-title">Calendar Events</h2>
                  <GlassCard>
                    <CalendarEvents 
                      country={memberData?.country} 
                      region={memberData?.region}
                    />
                  </GlassCard>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </main>

      {/* Session Modal */}
      <Modal 
        show={showSessionModal} 
        onHide={() => setShowSessionModal(false)} 
        centered
        className="session-modal"
      >
        <Modal.Body className="text-center p-4">
          <div className="session-icon">
            <FiAlertCircle size={48} />
          </div>
          <h3>Session Expired</h3>
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