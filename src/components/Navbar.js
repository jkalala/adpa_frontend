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

// Google Font import
const fontFamily = "'Roboto', sans-serif";

// Styled Components
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

const NavLogo = styled.img`
  height: 50px;
  width: auto;
  transition: all 0.3s ease;

  @media (min-width: 992px) {
    height: 60px;
  }
`;

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

const NotificationBadge = styled(Badge)`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.6rem;
  padding: 0.25em 0.4em;
`;

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
`;

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [notificationCount] = useState(user ? 3 : 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeNavbar = () => {
    setExpanded(false);
  };

  const handleLogout = () => {
    logout();
    closeNavbar();
    navigate('/login');
  };

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
        <BootstrapNavbar.Brand as={Link} to="/" onClick={closeNavbar}>
          <NavLogo src={logo} alt="ADPA Logo" />
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle onClick={() => setExpanded(!expanded)} />
        
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
          
          <Nav className="me-auto">
            <NavLink as={Link} to="/" onClick={closeNavbar} active={location.pathname === '/'}>
              Home
            </NavLink>
            
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
          </Nav>
          
          <Nav>
            {user ? (
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