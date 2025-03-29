import React from 'react';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowRight } from 'react-icons/fi';

// Import images
import image1 from '../assets/slideshow/image1.jpg';
import image2 from '../assets/slideshow/image2.jpg';
import image3 from '../assets/slideshow/image3.jpg';
import image4 from '../assets/slideshow/image4.jpg';
import image5 from '../assets/slideshow/image5.jpg';
import diamondImage from '../assets/diamond-brillance.jpg';
import logo from '../assets/ADPA_LOGO.jpg';
import News from './News';

// Styled components
const HeroCarousel = styled(Carousel)`
  .carousel-inner, .carousel-item {
    height: 60vh;
    min-height: 500px;
    
    @media (max-width: 768px) {
      height: 50vh;
      min-height: 400px;
    }
  }
  
  .carousel-item img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    filter: brightness(0.7);
  }
  
  .carousel-caption {
    bottom: 30%;
    text-align: left;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    
    h3 {
      font-size: 2.5rem;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    p {
      font-size: 1.2rem;
      max-width: 600px;
    }
  }
`;

const DiamondSection = styled.div`
  position: relative;
  margin: 4rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(${diamondImage}) center/cover;
    opacity: 0.1;
    z-index: 0;
  }
`;

const DiamondContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  
  h2 {
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1.2rem;
    color: #4a4a4a;
    max-width: 800px;
    margin: 0 auto 2rem;
  }
`;

const DiamondImage = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  
  img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    transition: transform 0.5s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 100%
    );
    pointer-events: none;
    border-radius: 10px;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #1a1a2e;
  border: none;
  padding: 0.75rem 2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    background-color: #2a2a40;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Carousel Section */}
            <HeroCarousel fade interval={5000}>
                <Carousel.Item>
                    <img src={image1} alt="First slide" />
                    <Carousel.Caption>
                        <h3>African Diamond Producers Association</h3>
                        <p>Promoting sustainable diamond mining practices across Africa</p>
                        <PrimaryButton as={Link} to="/about">
                            Learn More <FiArrowRight />
                        </PrimaryButton>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={image2} alt="Second slide" />
                    <Carousel.Caption>
                        <h3>Empowering Local Communities</h3>
                        <p>Ensuring diamond wealth benefits African nations and their people</p>
                        <PrimaryButton as={Link} to="/members">
                            Our Members <FiArrowRight />
                        </PrimaryButton>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={image3} alt="Third slide" />
                    <Carousel.Caption>
                        <h3>Ethical Diamond Trade</h3>
                        <p>Advocating for transparency and fairness in the diamond industry</p>
                        <PrimaryButton as={Link} to="/services">
                            Our Services <FiArrowRight />
                        </PrimaryButton>
                    </Carousel.Caption>
                </Carousel.Item>
            </HeroCarousel>

            {/* Main Content */}
            <Container className="py-5">
                <Row className="justify-content-center mb-5">
                    <Col md={8} className="text-center">
                        {/*<img
                            src={logo}
                            alt="ADPA Logo"
                            className="img-fluid mb-4"
                            style={{ maxWidth: '200px', filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1))' }}
                        />*/}
                        {/*<h1 className="mb-4" style={{ fontWeight: '700', color: '#1a1a2e' }}>
                            Welcome to ADPA
                        </h1>*/}
                    </Col>
                </Row>

                {/* Diamond Brilliance Section */}
                <DiamondSection>
                    <DiamondContent>
                        <h2>Together Empowering the Brilliance of African Diamonds</h2>
                        <p>
                            The African Diamond Producers Association is committed to harnessing the 
                            potential of Africa's diamond resources for the benefit of its people, 
                            while ensuring sustainable and ethical practices throughout the industry.
                        </p>
                        <DiamondImage>
                            <img
                                src={diamondImage}
                                alt="Brilliant African Diamond"
                            />
                        </DiamondImage>
                        <p className="mt-4 font-italic" style={{ color: '#6c757d' }}>
                            "The true brilliance of Africa's diamond heritage"
                        </p>
                    </DiamondContent>
                </DiamondSection>

                {/* News Section */}
                <Row className="my-5">
                    <Col>
                        <h2 className="text-center mb-5" style={{ fontWeight: '700', color: '#1a1a2e' }}>
                            Latest News & Updates
                        </h2>
                        <News />
                    </Col>
                </Row>

                {/* Call to Action */}
                <Row className="justify-content-center mt-5">
                    <Col md={8} className="text-center">
                        <h3 className="mb-4">Explore Our Resources</h3>
                        <PrimaryButton as={Link} to="/documents" size="lg">
                            View Documents <FiArrowRight />
                        </PrimaryButton>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;