import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/ADPA_LOGO_1.png';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import styled from 'styled-components';
import { FiUser, FiChevronDown, FiExternalLink } from 'react-icons/fi';

// Import Google Fonts
import './Navbar.css'; // Create this file for font imports

// Styled components
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

    svg {
      margin-left: 0.5rem;
      opacity: 0.7;
      font-size: 0.8rem;
    }
  }
`;

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
          onClick={() => setExpanded(expanded ? false : true)}
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
            
            <NavLink 
              as={Link} 
              to="/about" 
              onClick={closeNavbar}
              className={location.pathname === '/about' ? 'active' : ''}
            >
              About
            </NavLink>
            
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
            
            <CustomNavDropdown
              title={
                <>
                  More <FiChevronDown />
                </>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item 
                as={Link} 
                to="/governance" 
                onClick={closeNavbar}
              >
                ADPA Governance <FiExternalLink />
              </NavDropdown.Item>
              
              <NavDropdown.Item 
                as={Link} 
                to="/executive-directorate" 
                onClick={closeNavbar}
              >
                Executive Directorate <FiExternalLink />
              </NavDropdown.Item>
              
              <NavDropdown.Item 
                as={Link} 
                to="/faq" 
                onClick={closeNavbar}
              >
                FAQ <FiExternalLink />
              </NavDropdown.Item>
              
              <NavDropdown.Item 
                as={Link} 
                to="/gallery" 
                onClick={closeNavbar}
              >
                Gallery <FiExternalLink />
              </NavDropdown.Item>
              
              <NavDropdown.Item 
                as={Link} 
                to="/career" 
                onClick={closeNavbar}
              >
                Career <FiExternalLink />
              </NavDropdown.Item>
            </CustomNavDropdown>
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