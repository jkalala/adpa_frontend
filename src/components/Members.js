import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FiFlag, FiExternalLink } from 'react-icons/fi';
import styled from 'styled-components';

// Styled components
const MembersContainer = styled(Container)`
  padding: 4rem 0;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h2 {
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;

    &:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: linear-gradient(to right, #4cc9f0, #1a1a2e);
    }
  }

  p {
    color: #6c757d;
    font-size: 1.1rem;
    max-width: 700px;
    margin: 0 auto;
  }
`;

const MemberCard = styled(Card)`
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  margin-bottom: 2rem;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  background: ${props => props.primary ? 'linear-gradient(to right, #1a1a2e, #2a2a40)' : 'linear-gradient(to right, #4a4a5a, #2a2a40)'};
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;

    svg {
      margin-right: 0.75rem;
    }
  }

  .badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const CountryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    transform: translateX(5px);
  }

  img {
    width: 30px;
    height: 20px;
    object-fit: cover;
    border-radius: 3px;
    margin-right: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  span {
    flex: 1;
    font-weight: 500;
    color: #1a1a2e;
  }

  svg {
    color: #6c757d;
  }
`;

const CTASection = styled.div`
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f0ff 100%);
  border-radius: 12px;
  padding: 3rem;
  margin-top: 3rem;
  text-align: center;
  border: 1px solid rgba(76, 201, 240, 0.2);

  h3 {
    color: #1a1a2e;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    color: #6c757d;
    max-width: 600px;
    margin: 0 auto 2rem;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #1a1a2e;
  border: none;
  padding: 0.75rem 2rem;
  font-weight: 600;
  margin: 0 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2a2a40;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: #1a1a2e;
  border: 1px solid #dee2e6;
  padding: 0.75rem 2rem;
  font-weight: 600;
  margin: 0 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    color: #1a1a2e;
    border-color: #dee2e6;
  }
`;

const Members = () => {
  const memberCountries = [
    { name: 'Angola', code: 'ao' },
    { name: 'Cameroon', code: 'cm' },
    { name: 'Central African Republic', code: 'cf' },
    { name: 'Côte d\'Ivoire', code: 'ci' },
    { name: 'Democratic Republic of the Congo', code: 'cd' },
    { name: 'Ghana', code: 'gh' },
    { name: 'Guinea', code: 'gn' },
    { name: 'Liberia', code: 'lr' },
    { name: 'Namibia', code: 'na' },
    { name: 'Republic of the Congo', code: 'cg' },
    { name: 'Sierra Leone', code: 'sl' },
    { name: 'South Africa', code: 'za' },
    { name: 'Tanzania', code: 'tz' },
    { name: 'Togo', code: 'tg' },
    { name: 'Zimbabwe', code: 'zw' }
  ];

  const observerCountries = [
    { name: 'Algeria', code: 'dz' },
    { name: 'Mali', code: 'ml' },
    { name: 'Mauritania', code: 'mr' },
    { name: 'Mozambique', code: 'mz' },
    { name: 'Gabon', code: 'ga' },
    { name: 'Russian Federation', code: 'ru' }
  ];

  return (
    <MembersContainer>
      <SectionHeader>
        <h2>ADPA Membership</h2>
        <p>
          Uniting African diamond-producing nations to foster sustainable development 
          and ethical practices in the diamond industry
        </p>
      </SectionHeader>

      <Row>
        <Col lg={6} className="mb-4 mb-lg-0">
          <MemberCard>
            <CardHeader primary>
              <h3><FiFlag /> Member Countries</h3>
              <span className="badge">{memberCountries.length} Countries</span>
            </CardHeader>
            <Card.Body>
              <p className="text-muted mb-4">
                Effective members are African diamond-producing countries that have 
                ratified the ADPA Statute and comply with the Kimberley Process 
                Certification Scheme requirements.
              </p>
              <div className="country-list">
                {memberCountries.map((country) => (
                  <CountryItem key={country.code}>
                    <img 
                      src={`https://flagcdn.com/32x24/${country.code}.png`} 
                      alt={`${country.name} flag`}
                      loading="lazy"
                    />
                    <span>{country.name}</span>
                    <FiExternalLink />
                  </CountryItem>
                ))}
              </div>
            </Card.Body>
          </MemberCard>
        </Col>

        <Col lg={6}>
          <MemberCard>
            <CardHeader>
              <h3><FiFlag /> Observers</h3>
              <span className="badge">{observerCountries.length} Countries</span>
            </CardHeader>
            <Card.Body>
              <p className="text-muted mb-4">
              <ul>
                <li><strong>Potential African Diamond Producers:</strong> Nations with geological diamond resources aiming for future production.</li>
                <li><strong>Non-Compliant African Producers:</strong> Countries currently producing diamonds but not meeting Kimberley Process standards.</li>
               <li><strong>Global Diamond Value Chain Participants:</strong> Non-African countries and organizations aligned with the Kimberley Process's statutes and regulations.</li>
              </ul>

              </p>
              <h6 className="font-weight-bold mb-3">Current Observers:</h6>
              <div className="country-list">
                {observerCountries.map((country) => (
                  <CountryItem key={country.code}>
                    <img 
                      src={`https://flagcdn.com/32x24/${country.code}.png`} 
                      alt={`${country.name} flag`}
                      loading="lazy"
                    />
                    <span>{country.name}</span>
                    <FiExternalLink />
                  </CountryItem>
                ))}
              </div>
            </Card.Body>
          </MemberCard>
        </Col>
      </Row>

      <CTASection>
        <h3>Join the ADPA Community</h3>
        <p>
          Discover how membership can benefit your country's diamond industry 
          and contribute to sustainable development across Africa.
        </p>
        <div className="button-group">
          <PrimaryButton>Membership Benefits</PrimaryButton>
          <SecondaryButton>Contact Secretariat</SecondaryButton>
        </div>
      </CTASection>
    </MembersContainer>
  );
};

export default Members;