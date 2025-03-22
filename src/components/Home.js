import React from 'react';
import { Container, Row, Col, Carousel,Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import SurveyForm from './SurveyForm';
//import logo from '../assets/adpa-logo.png';

// Import images for the carousel (replace with your own images)
import image1 from '../assets/slideshow/image1.jpg';
import image2 from '../assets/slideshow/image2.jpg';
import image3 from '../assets/slideshow/image3.jpg';
import image4 from '../assets/slideshow/image4.jpg';
import image5 from '../assets/slideshow/image5.jpg';
import News from './News';

const Home = () => {
    return (
        <Container fluid className="p-0">
            {/* Carousel Section (1/3 of the page) */}
            <Row className="vh-33">  {/* 1/3 of the viewport height */}
                <Col className="p-0">
                    <Carousel fade interval={3000}>  {/* Change image every 3 seconds */}
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={image1}
                                alt="First slide"
                                style={{ height: '33vh', objectFit: 'cover' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={image2}
                                alt="Second slide"
                                style={{ height: '33vh', objectFit: 'cover' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={image3}
                                alt="Third slide"
                                style={{ height: '33vh', objectFit: 'cover' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={image4}
                                alt="Fourth slide"
                                style={{ height: '33vh', objectFit: 'cover' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={image5}
                                alt="Fifth slide"
                                style={{ height: '33vh', objectFit: 'cover' }}
                            />
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>

            {/* Rest of the Homepage Content */}
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        {/*<img
                            src={logo}
                            alt="ADPA Logo"
                            className="img-fluid mb-4"
                            style={{ maxWidth: '200px' }}
                        /> */}
                        <div className="d-flex justify-content-end mb-4">
                        <LanguageSelector />
                        </div>
                        <h1 className="mb-3">Welcome to ADPA</h1>
                        <p className="lead">
                            Together Empowering the Brilliance of African Diamonds
                        </p>
                        
                        <News />
                        {/*<SurveyForm /> */}

                        {/* Documents Button */}
                        <Link to="/documents">
                            <Button variant="primary" className="mt-4">
                                Documents
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default Home;