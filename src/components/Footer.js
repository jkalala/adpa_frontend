import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5 py-4">
            <Container>
                <Row>
                    <Col className="text-center">
                        <p className="mb-0">&copy; 2023 ADPA. All rights reserved.</p>
                        <a href="/privacy-policy" className="text-white me-3">Privacy Policy</a>
                        <a href="/terms-of-service" className="text-white">Terms of Service</a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;