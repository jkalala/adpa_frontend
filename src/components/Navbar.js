import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/ADPA_LOGO.jpg';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import styled from 'styled-components';

// Styled component for the Member Portal button
const MemberPortalButton = styled(Button)`
  background-color: transparent;
  border: 2px solid white;
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
  padding: 4px 12px;
  margin-left: auto;
  &:hover {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
`;

const Navbar = () => {
    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">
                    <img
                        src={logo}
                        alt="ADPA Logo"
                        style={{ 
                            height: '50px',
                            width: 'auto',
                            maxWidth: '200px'
                        }}
                    />
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/services">Services</Nav.Link>
                        <Nav.Link as={Link} to="/forms">Forms</Nav.Link>
                        <Nav.Link as={Link} to="/members">Members</Nav.Link>
                        <Nav.Link as={Link} to="/news">News</Nav.Link>
                        <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                        <Nav.Link as={Link} to="/career">Career</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contacts</Nav.Link>
                        <Nav.Link as={Link} to="/external-links">Links</Nav.Link>

                        <NavDropdown title="More" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/governance">ADPA Governance</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/executive-directorate">Executive Directorate</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/faq">FAQ</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <MemberPortalButton as={Link} to="/login">
                        Member Portal
                    </MemberPortalButton>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;