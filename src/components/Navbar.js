/**
 * ADPA Navigation Bar Component
 * 
 * This component provides the main navigation for the ADPA application with:
 * - Responsive design for all screen sizes
 * - Authentication-aware menu items
 * - Notification indicators
 * - Smooth animations and transitions
 * 
 * Features:
 * - Mobile-friendly collapsible menu
 * - User dropdown with profile options
 * - Active link highlighting
 * - Member-specific dashboard access
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/ADPA_LOGO_1.png';
import { 
  Navbar as BootstrapNavbar, 
  Nav, 
  Container, 
  NavDropdown,
  DropdownToggle,
  DropdownMenu,
  Badge,
  Spinner
} from 'react-bootstrap';
import styled from 'styled-components';
import { FiUser, FiChevronDown, FiExternalLink, FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../auth/authProvider';

// Google Font import for consistent typography
const fontFamily = "'Roboto', sans-serif";

// =============================================
// STYLED COMPONENTS
// =============================================

/**
 * Custom styled navbar with shadow and responsive padding
 */
const StyledNavbar = styled(BootstrapNavbar)`
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  font-family: ${fontFamily};
  font-size: 0.9rem;

  @media (min-width: 992px) {
    padding: 1rem 0;
  }
`;

/**
 * Logo image with responsive sizing
 */
const NavLogo = styled.img`
  height: 60px;
  width: auto;
  transition: all 0.3s ease;

  @media (min-width: 992px) {
    height: 80px;
  }
`;

/**
 * Navigation link styling with hover and active states
 */
const NavLink = styled(Nav.Link)`
  color: #1a1a2e !important;
  font-weight: 500;
  padding: 0.75rem 1rem !important;
  margin: 0 0.25rem;
  position: relative;
  transition: all 0.2s ease;
  text-decoration: none !important;
  font-family: ${fontFamily};
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  text-transform: capitalize;

  &:hover {
    color: #4cc9f0 !important;
  }

  &.active {
    color: #4cc9f0 !important;
    font-weight: 600;
  }
`;

/**
 * Notification badge styling for alerts
 */
const NotificationBadge = styled(Badge)`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.6rem;
  padding: 0.25em 0.4em;
`;

/**
 * Member portal button with hover effects
 */
const MemberPortalButton = styled(Link)`
  background: white !important;
  color: #1a1a2e !important;
  border: 1px solid #1a1a2e !important;
  border-radius: 4px !important;
  padding: 0.5rem 1.5rem !important;
  font-family: ${fontFamily};
  font-size: 0.9rem;
  text-decoration: none !important;
  transition: all 0.3s ease;
  margin-left: 1rem;
  font-weight: 700;
  text-transform: capitalize;

  &:hover {
    background: #4cc9f0 !important;
    color: white !important;
    border-color: #4cc9f0 !important;
    transform: translateY(-1px);
  }
`;

/**
 * Custom user dropdown toggle without caret
 */
const UserDropdownToggle = styled(DropdownToggle)`
  display: flex;
  align-items: center;
  background: none !important;
  border: none !important;
  color: #1a1a2e !important;
  font-weight: 500;
  padding: 0.75rem 1rem !important;
  margin: 0 0.25rem;
  font-family: ${fontFamily};
  font-size: 0.9rem;
  text-transform: capitalize;

  &:after {
    display: none;
  }

  &:hover {
    color: #4cc9f0 !important;
  }
`;

/**
 * Styled dropdown menu with consistent theming
 */
const StyledDropdownMenu = styled(DropdownMenu)`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  font-family: ${fontFamily};
  
  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1.5rem;
    color: #1a1a2e;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    text-transform: capitalize;
    
    &:hover {
      background-color: #f8f9fa;
      color: #4cc9f0;
    }
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  @media (max-width: 991.98px) {
    border: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
  }
`;

/**
 * Custom nav dropdown with removed caret indicator
 */
const CustomNavDropdown = styled(NavDropdown)`
  .dropdown-toggle {
    &:after {
      display: none !important;
    }
  }

  .dropdown-menu {
    font-family: ${fontFamily};
    font-size: 0.9rem;
    text-transform: capitalize;
  }
  
  /* Ensure the dropdown toggle has the same styling as NavLink */
  .nav-link {
    color: #1a1a2e !important;
    font-weight: 500;
    padding: 0.75rem 1rem !important;
    margin: 0 0.25rem;
    position: relative;
    transition: all 0.2s ease;
    text-decoration: none !important;
    font-family: ${fontFamily};
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    
    &:hover {
      color: #4cc9f0 !important;
    }
    
    &.active {
      color: #4cc9f0 !important;
      font-weight: 600;
    }
  }
`;

/**
 * Styled navigation container for better alignment
 */
const NavContainer = styled(Nav)`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 991.98px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// =============================================
// MAIN COMPONENT
// =============================================

const Navbar = () => {
  // Component state
  const [expanded, setExpanded] = useState(false); // Controls mobile menu toggle
  const [scrolled, setScrolled] = useState(false); // Tracks scroll position for styling
  const location = useLocation(); // Current route location
  const { user, isLoading, logout } = useAuth(); // Authentication context
  const navigate = useNavigate(); // Navigation function
  
  // TODO: Replace with real notification count from API
  const [notificationCount] = useState(user ? 3 : 0);

  /**
   * Effect to handle scroll events for navbar styling
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Closes the mobile navigation menu
   */
  const closeNavbar = () => {
    setExpanded(false);
  };

  /**
   * Handles user logout flow
   */
  const handleLogout = () => {
    logout();
    closeNavbar();
    navigate('/login');
  };

  // Show loading spinner while auth state is being checked
  if (isLoading) {
    return (
      <div style={{ height: '56px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  return (
    <StyledNavbar expand="lg" expanded={expanded} className={scrolled ? 'scrolled' : ''}>
      <Container>
        {/* Brand/Logo */}
        <BootstrapNavbar.Brand as={Link} to="/" onClick={closeNavbar}>
          <NavLogo src={logo} alt="ADPA Logo" />
        </BootstrapNavbar.Brand>
        
        {/* Mobile Toggle Button */}
        <BootstrapNavbar.Toggle onClick={() => setExpanded(!expanded)} />
        
        {/* Collapsible Menu Content */}
        <BootstrapNavbar.Collapse id="navbar-collapse">
          {/* Mobile-only Dashboard link for members */}
          {user?.is_member && expanded && (
            <Nav className="d-lg-none mb-3">
              <NavLink 
                as={Link} 
                to="/member-dashboard" 
                onClick={closeNavbar}
                className="d-flex align-items-center"
              >
                Dashboard
                {notificationCount > 0 && (
                  <NotificationBadge bg="danger" pill>
                    {notificationCount}
                  </NotificationBadge>
                )}
              </NavLink>
            </Nav>
          )}
          
          {/* Main Navigation Links */}
          <NavContainer className="me-auto">
            <NavLink as={Link} to="/" onClick={closeNavbar} active={location.pathname === '/'}>
              Home
            </NavLink>
            
            {/* About Dropdown */}
            <CustomNavDropdown
              title={
                <span className="d-flex align-items-center">
                  About <FiChevronDown className="ms-1" />
                </span>
              }
              id="about-dropdown"
              className="d-flex align-items-center"
            >
              <NavDropdown.Item as={Link} to="/about" onClick={closeNavbar}>
                About us
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/governance" onClick={closeNavbar}>
                Governance <FiExternalLink className="ms-1" />
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/executive-directorate" onClick={closeNavbar}>
                Executive directorate <FiExternalLink className="ms-1" />
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/faq" onClick={closeNavbar}>
                FAQ <FiExternalLink className="ms-1" />
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/career" onClick={closeNavbar}>
                Careers <FiExternalLink className="ms-1" />
              </NavDropdown.Item>
            </CustomNavDropdown>
            
            <NavLink as={Link} to="/services" onClick={closeNavbar} active={location.pathname === '/services'}>
              Services
            </NavLink>
            
            <NavLink as={Link} to="/members" onClick={closeNavbar} active={location.pathname === '/members'}>
              Members
            </NavLink>
            
            {/* Desktop Dashboard link for members */}
            {user?.is_member && (
              <NavLink 
                as={Link} 
                to="/member-dashboard" 
                onClick={closeNavbar}
                className="position-relative d-none d-lg-block"
                active={location.pathname === '/member-dashboard'}
              >
                Dashboard
                {notificationCount > 0 && (
                  <NotificationBadge bg="danger" pill>
                    {notificationCount}
                  </NotificationBadge>
                )}
              </NavLink>
            )}
            
            <NavLink as={Link} to="/news" onClick={closeNavbar} active={location.pathname === '/news'}>
              News
            </NavLink>
            
            <NavLink as={Link} to="/gallery" onClick={closeNavbar} active={location.pathname === '/gallery'}>
              Gallery
            </NavLink>
          </NavContainer>
          
          {/* User Section */}
          <Nav>
            {user ? (
              /* Authenticated User Dropdown */
              <NavDropdown
                title={
                  <UserDropdownToggle as="div">
                    <div className="position-relative">
                      <FiUser />
                      {notificationCount > 0 && (
                        <NotificationBadge bg="danger" pill>
                          {notificationCount}
                        </NotificationBadge>
                      )}
                    </div>
                    <span className="ms-2">{user.first_name || 'Account'}</span>
                    <FiChevronDown className="ms-1" />
                  </UserDropdownToggle>
                }
                id="user-dropdown"
                align="end"
                menuVariant="light"
                drop={expanded ? 'down' : 'start'}
              >
                <StyledDropdownMenu>
                  <NavDropdown.Item as={Link} to="/member-dashboard" onClick={closeNavbar}>
                    <FiUser /> Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/notifications" onClick={closeNavbar}>
                    <FiBell /> Notifications
                    {notificationCount > 0 && (
                      <Badge bg="danger" pill className="ms-2">
                        {notificationCount}
                      </Badge>
                    )}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile" onClick={closeNavbar}>
                    <FiUser /> My profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </NavDropdown.Item>
                </StyledDropdownMenu>
              </NavDropdown>
            ) : (
              /* Login Button for Guests */
              <MemberPortalButton to="/login" onClick={closeNavbar}>
                <FiUser className="me-1" /> Member portal
              </MemberPortalButton>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Navbar;