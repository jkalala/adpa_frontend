import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import styled from 'styled-components';

// Styled component for the Member Portal button
const MemberPortalButton = styled(Button)`
  background-color: transparent;
  border: 2px solid white;
  border-radius: 20px;  // Rounded corners
  color: white;
  font-size: 0.9rem;  // Smaller font size
  padding: 5px 15px;  // Smaller padding
  margin-right: auto;  // Push the button to the rightmost position
  &:hover {
    background-color: #007bff;  // Blue color on hover
    color: white;
    border-color: #007bff;
  }
`;
// Styled component for menu items
const MenuItem = styled(Nav.Link)`
  font-size: 0.9rem;  // Smaller font size for menu items
  padding: 0.5rem 1rem;  // Adjust padding for smaller text
`;

const Navbar = () => {
    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg">
            <Container>
                {/* Member Portal Button */}
                <MemberPortalButton as={Link} to="/login">
                    Member Portal
                </MemberPortalButton>

                <BootstrapNavbar.Brand as={Link} to="/">
                    ADPA
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About ADPA</Nav.Link>
                        <Nav.Link as={Link} to="/services">Services</Nav.Link>
                        <Nav.Link as={Link} to="/forms">Forms</Nav.Link>
                        <Nav.Link as={Link} to="/members">Members</Nav.Link>
                        <Nav.Link as={Link} to="/news">News</Nav.Link>
                        <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                        <Nav.Link as={Link} to="/career">Career</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
                        <Nav.Link as={Link} to="/external-links">External Links</Nav.Link>

                        {/* Hamburger Menu Dropdown */}
                        <NavDropdown title="More" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/governance">ADPA Governance</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/executive-directorate">Executive Directorate</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/faq">FAQ</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;