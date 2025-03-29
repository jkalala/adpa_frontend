import React from 'react';
import styled from 'styled-components';
import structure from '../assets/SDS_structure.jpg';
import material from '../assets/SDS_issues.jpg';
import cycle from '../assets/SDS_cycle.jpg';

const ServicesContainer = styled.div`
  padding: 3rem 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  max-width: 1000px;
  margin: 3rem auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ServiceHeader = styled.h2`
  color: #1a1a2e;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    border-radius: 2px;
  }
`;

const ServiceDescription = styled.div`
  color: #4b5563;
  line-height: 1.7;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #1a1a2e;
`;

const SectionTitle = styled.h3`
  color: #1a1a2e;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #3498db;
    margin-right: 0.75rem;
  }
`;

const ServiceImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin: 1rem 0 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: scale(1.01);
  }
`;

const ImageCaption = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -1.5rem;
  margin-bottom: 2rem;
  font-style: italic;
`;

const Services = () => {
    return (
        <ServicesContainer>
            <ServiceHeader>ADPA Sustainable Diamond Standard (SDS)</ServiceHeader>
            
            <ServiceDescription>
                <p>The SDS is a government-supported initiative of mining nations and companies that provides:</p>
                <ul>
                    <li>A common standard for responsible diamond mining recognized at the KP level</li>
                    <li>Alignment with international standards including the KP "Declaration on Supporting Principles for Responsible Diamond Sourcing"</li>
                    <li>Framework to improve environmental, social and governance performance of diamond mining</li>
                    <li>Two compliance options: self-declaration (basic) and third-party assurance (advanced)</li>
                    <li>"Sustainable Diamond" logo for audited entities</li>
                    <li>Integration with CIBJO Blue Book standards and "Good Delivery" standards</li>
                </ul>
            </ServiceDescription>

            <SectionTitle>SDS Structure</SectionTitle>
            <ServiceImage 
                src={structure} 
                alt="Sustainable Diamond Standard Structure" 
                loading="lazy"
            />
            <ImageCaption>Organizational structure of the Sustainable Diamond Standard</ImageCaption>

            <SectionTitle>Material Issues for Standard Setting</SectionTitle>
            <ServiceImage 
                src={material} 
                alt="Material Issues for Standard Setting" 
                loading="lazy"
            />
            <ImageCaption>Key material considerations in the standard development process</ImageCaption>

            <SectionTitle>Certification Cycle</SectionTitle>
            <ServiceImage 
                src={cycle} 
                alt="Sustainable Diamond Certification Cycle" 
                loading="lazy"
            />
            <ImageCaption>Process flow for achieving and maintaining SDS certification</ImageCaption>
        </ServicesContainer>
    );
};

export default Services;