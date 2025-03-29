import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/ADPA_LOGO_1.png';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import styled from 'styled-components';
import { FiUser, FiChevronDown, FiExternalLink } from 'react-icons/fi';

// Styled Components
const StyledNavbar = styled(BootstrapNavbar)`
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;

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
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  letter-spacing: 0.5px;

  &:hover {
    color: #4cc9f0 !important;
  }

  &.active {
    color: #4cc9f0 !important;
    font-weight: 600;
  }
`;

const MemberPortalButton = styled(Link)`
  background: #1a1a2e;
  border: 2px solid #1a1a2e;
  border-radius: 30px;
  color: white !important;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  margin-left: 1rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  text-decoration: none !important;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.5px;

  &:hover {
    background: #2a2a40;
    color: white !important;
    transform: translateY(-1px);
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const CustomNavDropdown = styled(NavDropdown)`
  .dropdown-toggle {
    color: #1a1a2e !important;
    font-weight: 500;
    padding: 0.75rem 1rem !important;
    margin: 0 0.25rem;
    display: flex;
    align-items: center;
    text-decoration: none !important;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    letter-spacing: 0.5px;

    &:after {
      margin-left: 0.5rem;
    }

    &:hover {
      color: #4cc9f0 !important;
    }
  }

  .dropdown-menu {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 0.5rem 0;
    margin-top: 0.5rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    font-family: 'Poppins', sans-serif;
  }

  .dropdown-item {
    color: #1a1a2e !important;
    padding: 0.5rem 1.5rem !important;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    text-decoration: none !important;
    font-size: 0.9rem;
    letter-spacing: 0.3px;

    &:hover {
      background-color: #f8f9fa !important;
      color: #4cc9f0 !important;
    }

    &.active {
      color: #4cc9f0 !important;
      font-weight: 600;
    }

    svg {
      margin-left: 0.5rem;
      opacity: 0.7;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 991.98px) {
    .dropdown-menu {
      border: none;
      box-shadow: none;
      padding: 0;
      margin: 0;
    }

    .dropdown-item {
      padding: 0.5rem 1rem !important;
    }
  }
`;

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const closeNavbar = () => {
    setExpanded(false);
    setShowAboutDropdown(false);
  };

  const handleAboutDropdown = (e) => {
    // Only toggle on mobile (when navbar is expanded)
    if (expanded) {
      setShowAboutDropdown(!showAboutDropdown);
    }
  };

  return (
    <StyledNavbar 
      expand="lg" 
      expanded={expanded}
      className={scrolled ? 'scrolled' : ''}
      variant="light"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" onClick={closeNavbar}>
          <NavLogo src={logo} alt="ADPA Logo" />
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink 
              as={Link} 
              to="/" 
              onClick={closeNavbar}
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </NavLink>
            
            <CustomNavDropdown
              title={
                <>
                  About <FiChevronDown />
                </>
              }
              id="about-nav-dropdown"
              show={showAboutDropdown}
              onMouseEnter={() => !expanded && setShowAboutDropdown(true)}
              onMouseLeave={() => !expanded && setShowAboutDropdown(false)}
              onClick={handleAboutDropdown}
            >
              <NavDropdown.Item 
                as={Link} 
                to="/about" 
                onClick={closeNavbar}
                className={location.pathname === '/about' ? 'active' : ''}
              >
                About Us
              </NavDropdown.Item>
              
              <NavDropdown.Item 
                as={Link} 
                to="/governance" 
                onClick={closeNavbar}
                className={location.pathname === '/governance' ? 'active' : ''}
              >
                Governance <FiExternalLink />
              </NavDropdown.Item>
              
              <NavDropdown.Item 
                as={Link} 
                to="/executive-directorate" 
                onClick={closeNavbar}
                className={location.pathname === '/executive-directorate' ? 'active' : ''}
              >
                Executive Directorate <FiExternalLink />
              </NavDropdown.Item>
              
              <NavDropdown.Item 
                as={Link} 
                to="/faq" 
                onClick={closeNavbar}
                className={location.pathname === '/faq' ? 'active' : ''}
              >
                FAQ <FiExternalLink />
              </NavDropdown.Item>
              
              <NavDropdown.Item 
                as={Link} 
                to="/career" 
                onClick={closeNavbar}
                className={location.pathname === '/career' ? 'active' : ''}
              >
                Careers <FiExternalLink />
              </NavDropdown.Item>
            </CustomNavDropdown>
            
            <NavLink 
              as={Link} 
              to="/services" 
              onClick={closeNavbar}
              className={location.pathname === '/services' ? 'active' : ''}
            >
              Services
            </NavLink>
            
            <NavLink 
              as={Link} 
              to="/members" 
              onClick={closeNavbar}
              className={location.pathname === '/members' ? 'active' : ''}
            >
              Members
            </NavLink>
            
            <NavLink 
              as={Link} 
              to="/news" 
              onClick={closeNavbar}
              className={location.pathname === '/news' ? 'active' : ''}
            >
              News
            </NavLink>
            
            <NavLink 
              as={Link} 
              to="/gallery" 
              onClick={closeNavbar}
              className={location.pathname === '/gallery' ? 'active' : ''}
            >
              Gallery
            </NavLink>
          </Nav>
          
          <MemberPortalButton to="/login" onClick={closeNavbar}>
            <FiUser /> Member Portal
          </MemberPortalButton>
        </BootstrapNavbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Navbar;