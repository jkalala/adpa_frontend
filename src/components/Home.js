/**
 * Home Page Component
 * 
 * This is the main landing page for the African Diamond Producers Association (ADPA) website.
 * It features:
 * - A hero carousel with promotional slides
 * - A diamond brilliance showcase section
 * - Latest news updates
 * - Call-to-action sections
 * - Modern features like parallax scrolling, statistics counters, and animated timeline
 * 
 * The component uses styled-components for custom styling and React Bootstrap for layout components.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Carousel, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowRight, FiArrowUp, FiUsers, FiAward, FiGlobe, FiTrendingUp } from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import image assets
import image1 from '../assets/slideshow/image1.jpg';
import image2 from '../assets/slideshow/image2.jpg';
import image3 from '../assets/slideshow/image3.jpg';
import image4 from '../assets/slideshow/image4.jpg';
import image5 from '../assets/slideshow/image5.jpg';
import diamondImage from '../assets/diamond-brillance.jpg';
import logo from '../assets/ADPA_LOGO.jpg';
import News from './News';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

/**
 * Styled Components
 * 
 * These provide custom styling for various page elements while keeping the JSX clean.
 * Each styled component includes responsive design considerations.
 */

// Custom styled carousel for the hero section
const HeroCarousel = styled(Carousel)`
  .carousel-inner, .carousel-item {
    height: 80vh;
    min-height: 600px;
    
    @media (max-width: 768px) {
      height: 60vh;
      min-height: 400px;
    }
  }
  
  .carousel-item img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    filter: brightness(0.7);  // Darken images for better text visibility
  }
  
  .carousel-caption {
    bottom: 30%;
    text-align: left;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.5);  // Semi-transparent background
    border-radius: 10px;
    animation: ${fadeIn} 1s ease-out;
    
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

// Styled section for the diamond brilliance showcase
const DiamondSection = styled.div`
  position: relative;
  margin: 4rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  // Subtle diamond pattern background
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

// Content container for the diamond section
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

// Styled container for the diamond image with hover effects
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
  
  // Gradient overlay for visual enhancement
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

// Custom styled primary button with hover animations
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
  
  // Icon animation on hover
  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

// Statistics section
const StatsSection = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #2a2a40 100%);
  color: white;
  padding: 4rem 0;
  margin: 4rem 0;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ffd700;
  }
  
  .number {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

// Timeline section
const TimelineSection = styled.div`
  position: relative;
  padding: 4rem 0;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, #1a1a2e, #2a2a40);
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 3rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .timeline-content {
    position: relative;
    width: calc(50% - 30px);
    padding: 1.5rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 768px) {
      width: calc(100% - 60px);
      margin-left: 60px;
    }
    
    &:before {
      content: '';
      position: absolute;
      top: 20px;
      width: 20px;
      height: 20px;
      background: #1a1a2e;
      border-radius: 50%;
      
      @media (max-width: 768px) {
        left: -40px;
      }
    }
    
    &:after {
      content: '';
      position: absolute;
      top: 20px;
      width: 0;
      height: 0;
      border-style: solid;
      
      @media (max-width: 768px) {
        left: -10px;
        border-width: 10px 10px 10px 0;
        border-color: transparent white transparent transparent;
      }
    }
  }
  
  &:nth-child(odd) .timeline-content {
    margin-left: auto;
    
    &:before {
      left: -40px;
    }
    
    &:after {
      left: -10px;
      border-width: 10px 10px 10px 0;
      border-color: transparent white transparent transparent;
    }
  }
  
  &:nth-child(even) .timeline-content {
    margin-left: 0;
    
    &:before {
      right: -40px;
    }
    
    &:after {
      right: -10px;
      border-width: 10px 0 10px 10px;
      border-color: transparent transparent transparent white;
    }
  }
  
  .year {
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }
  
  .title {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .description {
    color: #6c757d;
  }
`;

// Testimonials section
const TestimonialsSection = styled.div`
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  margin: 4rem 0;
`;

const TestimonialCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .card-body {
    padding: 2rem;
  }
  
  .quote {
    font-size: 1.1rem;
    font-style: italic;
    margin-bottom: 1.5rem;
  }
  
  .author {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .position {
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

// Partners section
const PartnersSection = styled.div`
  padding: 4rem 0;
  text-align: center;
`;

const PartnerLogo = styled.div`
  padding: 1.5rem;
  margin: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  img {
    max-width: 100%;
    max-height: 80px;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
    
    &:hover {
      filter: grayscale(0%);
    }
  }
`;

// Floating action button
const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #1a1a2e;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  
  &:hover {
    background: #2a2a40;
  }
`;

/**
 * Home Component
 * 
 * The main page layout containing all sections:
 * 1. Hero carousel
 * 2. Diamond brilliance showcase
 * 3. Statistics section
 * 4. Timeline section
 * 5. News section
 * 6. Testimonials section
 * 7. Partners section
 * 8. Call-to-action
 */
const Home = () => {
    // State for statistics counters
    const [stats, setStats] = useState({
        members: 0,
        countries: 0,
        production: 0,
        growth: 0
    });
    
    // State for floating button visibility
    const [showFloatingButton, setShowFloatingButton] = useState(false);
    
    // Reference for scroll position
    const { scrollY } = useScroll();
    
    // Parallax effect for hero section
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    
    // Update floating button visibility based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingButton(window.scrollY > 500);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Animate statistics counters
    useEffect(() => {
        const targetStats = {
            members: 21,
            countries: 20,
            production: 60,
            growth: 25
        };
        
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        
        const interval = setInterval(() => {
            currentStep++;
            
            if (currentStep >= steps) {
                clearInterval(interval);
                setStats(targetStats);
                return;
            }
            
            const progress = currentStep / steps;
            
            setStats({
                members: Math.floor(progress * targetStats.members),
                countries: Math.floor(progress * targetStats.countries),
                production: Math.floor(progress * targetStats.production),
                growth: Math.floor(progress * targetStats.growth)
            });
        }, stepDuration);
        
        return () => clearInterval(interval);
    }, []);
    
    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    return (
        <div className="home-page">
            {/* 
              * Hero Carousel Section 
              * Features auto-rotating slides with promotional content
              * Each slide has an image, heading, description, and call-to-action button
              */}
            <motion.div style={{ y: heroY }}>
                <HeroCarousel fade interval={5000}>
                    {/* Slide 1: Association Overview */}
                    <Carousel.Item>
                        <img src={image1} alt="African diamond mine" />
                        <Carousel.Caption>
                            <h3>African Diamond Producers Association</h3>
                            <p>Promoting sustainable diamond mining practices across Africa</p>
                            <PrimaryButton as={Link} to="/about">
                                Learn More <FiArrowRight />
                            </PrimaryButton>
                        </Carousel.Caption>
                    </Carousel.Item>
                    
                    {/* Slide 2: Community Impact */}
                    <Carousel.Item>
                        <img src={image2} alt="African community" />
                        <Carousel.Caption>
                            <h3>Empowering Local Communities</h3>
                            <p>Ensuring diamond wealth benefits African nations and their people</p>
                            <PrimaryButton as={Link} to="/members">
                                Our Members <FiArrowRight />
                            </PrimaryButton>
                        </Carousel.Caption>
                    </Carousel.Item>
                    
                    {/* Slide 3: Ethical Practices */}
                    <Carousel.Item>
                        <img src={image3} alt="Ethical diamond certification" />
                        <Carousel.Caption>
                            <h3>Ethical Diamond Trade</h3>
                            <p>Advocating for transparency and fairness in the diamond industry</p>
                            <PrimaryButton as={Link} to="/services">
                                Our Services <FiArrowRight />
                            </PrimaryButton>
                        </Carousel.Caption>
                    </Carousel.Item>
                </HeroCarousel>
            </motion.div>

            {/* Main Content Container */}
            <Container className="py-5">
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

                {/* Statistics Section */}
                <StatsSection>
                    <Container>
                        <Row>
                            <Col md={3} sm={6}>
                                <StatCard>
                                    <div className="icon">
                                        <FiUsers />
                                    </div>
                                    <div className="number">{stats.members}</div>
                                    <div className="label">Member Countries</div>
                                </StatCard>
                            </Col>
                            <Col md={3} sm={6}>
                                <StatCard>
                                    <div className="icon">
                                        <FiGlobe />
                                    </div>
                                    <div className="number">{stats.countries}</div>
                                    <div className="label">African Nations</div>
                                </StatCard>
                            </Col>
                            <Col md={3} sm={6}>
                                <StatCard>
                                    <div className="icon">
                                        <FiAward />
                                    </div>
                                    <div className="number">{stats.production}%</div>
                                    <div className="label">Global Production</div>
                                </StatCard>
                            </Col>
                            <Col md={3} sm={6}>
                                <StatCard>
                                    <div className="icon">
                                        <FiTrendingUp />
                                    </div>
                                    <div className="number">{stats.growth}%</div>
                                    <div className="label">Annual Growth</div>
                                </StatCard>
                            </Col>
                        </Row>
                    </Container>
                </StatsSection>

                {/* Timeline Section */}
                <TimelineSection>
                    <Container>
                        <h2 className="text-center mb-5" style={{ fontWeight: '700', color: '#1a1a2e' }}>
                            Our Journey
                        </h2>
                        <TimelineItem>
                            <div className="timeline-content">
                                <div className="year">2006</div>
                                <div className="title">ADPA Founded</div>
                                <div className="description">
                                    The African Diamond Producers Association was established to promote cooperation among African diamond-producing countries.
                                </div>
                            </div>
                        </TimelineItem>
                        <TimelineItem>
                            <div className="timeline-content">
                                <div className="year">2011</div>
                                <div className="title">Joinet the Kimberley Process as Obsever</div>
                                <div className="description">
                                    ADPA succesfully became an observer of the KP at the Washington Plenary in 2011.
                                </div>
                            </div>
                        </TimelineItem>
                        <TimelineItem>
                            <div className="timeline-content">
                                <div className="year">2015</div>
                                <div className="title">Partnership with KPCS</div>
                                <div className="description">
                                    Formalized partnership with the Kimberley Process Certification Scheme to enhance diamond traceability.
                                </div>
                            </div>
                        </TimelineItem>
                        <TimelineItem>
                            <div className="timeline-content">
                                <div className="year">2020</div>
                                <div className="title">Sustainability Initiative</div>
                                <div className="description">
                                    Launched the African Diamond Sustainability Initiative to promote responsible mining practices.
                                </div>
                            </div>
                        </TimelineItem>
                    </Container>
                </TimelineSection>

                {/* News Section - Displays latest updates */}
                <Row className="my-5">
                    <Col>
                        <h2 className="text-center mb-5" style={{ fontWeight: '700', color: '#1a1a2e' }}>
                            Latest News & Updates
                        </h2>
                        <News />  {/* News component handles its own data fetching */}
                    </Col>
                </Row>

                {/* Testimonials Section */}
                <TestimonialsSection>
                    <Container>
                        <h2 className="text-center mb-5" style={{ fontWeight: '700', color: '#1a1a2e' }}>
                            What Our Members Say
                        </h2>
                        <Row>
                            <Col md={4}>
                                <TestimonialCard>
                                    <Card.Body>
                                        <div className="quote">
                                            "ADPA has been instrumental in helping our country develop sustainable diamond mining practices that benefit our communities."
                                        </div>
                                        <div className="author">John Doe</div>
                                        <div className="position">Minister of Mining, Botswana</div>
                                    </Card.Body>
                                </TestimonialCard>
                            </Col>
                            <Col md={4}>
                                <TestimonialCard>
                                    <Card.Body>
                                        <div className="quote">
                                            "The collaborative approach of ADPA has strengthened our position in the global diamond market and improved our export capabilities."
                                        </div>
                                        <div className="author">Jane Smith</div>
                                        <div className="position">Director, Diamond Board, South Africa</div>
                                    </Card.Body>
                                </TestimonialCard>
                            </Col>
                            <Col md={4}>
                                <TestimonialCard>
                                    <Card.Body>
                                        <div className="quote">
                                            "Through ADPA's initiatives, we've seen significant improvements in our diamond mining sector and increased benefits for local communities."
                                        </div>
                                        <div className="author">Michael Johnson</div>
                                        <div className="position">CEO, Mining Authority, Namibia</div>
                                    </Card.Body>
                                </TestimonialCard>
                            </Col>
                        </Row>
                    </Container>
                </TestimonialsSection>

                {/* Partners Section */}
                <PartnersSection>
                    <Container>
                        <h2 className="text-center mb-5" style={{ fontWeight: '700', color: '#1a1a2e' }}>
                            Our Partners
                        </h2>
                        <Row className="justify-content-center">
                            <Col md={2} sm={4} xs={6}>
                                <PartnerLogo>
                                    <img src={logo} alt="Partner 1" />
                                </PartnerLogo>
                            </Col>
                            <Col md={2} sm={4} xs={6}>
                                <PartnerLogo>
                                    <img src={logo} alt="Partner 2" />
                                </PartnerLogo>
                            </Col>
                            <Col md={2} sm={4} xs={6}>
                                <PartnerLogo>
                                    <img src={logo} alt="Partner 3" />
                                </PartnerLogo>
                            </Col>
                            <Col md={2} sm={4} xs={6}>
                                <PartnerLogo>
                                    <img src={logo} alt="Partner 4" />
                                </PartnerLogo>
                            </Col>
                            <Col md={2} sm={4} xs={6}>
                                <PartnerLogo>
                                    <img src={logo} alt="Partner 5" />
                                </PartnerLogo>
                            </Col>
                            <Col md={2} sm={4} xs={6}>
                                <PartnerLogo>
                                    <img src={logo} alt="Partner 6" />
                                </PartnerLogo>
                            </Col>
                        </Row>
                    </Container>
                </PartnersSection>

                {/* Call to Action Section */}
                <Row className="justify-content-center mt-5">
                    <Col md={8} className="text-center">
                        <h3 className="mb-4">Explore Our Resources</h3>
                        <PrimaryButton as={Link} to="/documents" size="lg">
                            View Documents <FiArrowRight />
                        </PrimaryButton>
                    </Col>
                </Row>
            </Container>
            
            {/* Floating Action Button */}
            {showFloatingButton && (
                <FloatingButton
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <FiArrowUp />
                </FloatingButton>
            )}
        </div>
    );
};

export default Home;