import React from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FaGlobeAfrica, 
  FaGem, 
  FaUsers, 
  FaChartLine, 
  FaHandshake, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaShareAlt 
} from 'react-icons/fa';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const AboutContainer = styled.div`
  padding: 4rem 2rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 3rem auto;
  line-height: 1.7;
  color: #444;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Section = styled.section`
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    border-radius: 2px;
  }
`;

const Subtitle = styled.h3`
  color: #2980b9;
  font-size: 1.4rem;
  margin: 2rem 0 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1.2rem;
  color: #555;
  font-size: 1.05rem;
`;

const List = styled.ul`
  margin: 1.5rem 0;
  padding-left: 2rem;
  list-style-type: none;
`;

const ListItem = styled.li`
  margin-bottom: 0.8rem;
  position: relative;
  padding-left: 1.8rem;
  font-size: 1.05rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 0.6em;
    height: 0.6em;
    background-color: #3498db;
    border-radius: 50%;
    transform: translateY(-50%);
  }
`;

const Highlight = styled.span`
  font-weight: 600;
  color: #2c3e50;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  background-repeat: no-repeat;
  background-size: 100% 40%;
  background-position: 0 90%;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
`;

const ContactInfo = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-top: 3rem;
  border-left: 5px solid #3498db;
  animation: ${pulse} 3s infinite ease-in-out;
`;

const IconWrapper = styled.span`
  color: #3498db;
  font-size: 1.2em;
`;

const CountryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const CountryCard = styled.div`
  background: #f8f9fa;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border-left: 3px solid #3498db;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const Tagline = styled.p`
  font-weight: 700;
  color: #2c3e50;
  margin-top: 1.5rem;
  font-size: 1.2rem;
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

const About = () => {
  return (
    <AboutContainer>
      <Section>
        <SectionTitle>
          <FaGlobeAfrica /> About ADPA
        </SectionTitle>
        <Subtitle><FaGem /> 1. OVERVIEW</Subtitle>
        <Paragraph>
          The <Highlight>African Diamond Producers Association (ADPA)</Highlight> is an intragovernmental organization comprising leading African diamond-producing countries. It represents the interests of African diamond-producing nations and seeks to enhance their influence in the global diamond market.
        </Paragraph>
        <Paragraph>
          Founded on <Highlight>4 November 2006</Highlight> through the Luanda Declaration, ADPA is headquartered in Luanda, Republic of Angola.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle><FaChartLine /> 2. VISION</Subtitle>
        <Paragraph>
          To be a strategic platform for cooperation and coordination that promotes a sustainable and dynamic African diamond industry.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle><FaHandshake /> 3. MISSION</Subtitle>
        <Paragraph>
          To maximize the potential of ADPA Member States and Observers through coordinated cooperation, creating an enabling environment through policy adoption, and technical advancement across the diamond value chain to build sustainable livelihoods of communities.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle><FaUsers /> 4. CORE VALUES</Subtitle>
        <List>
          <ListItem>Accountability</ListItem>
          <ListItem>Collaboration</ListItem>
          <ListItem>Integrity</ListItem>
          <ListItem>Excellency</ListItem>
          <ListItem>Innovation</ListItem>
          <ListItem>Transparency</ListItem>
          <ListItem>Agility</ListItem>
        </List>
      </Section>

      <Section>
        <Subtitle><FaChartLine /> 5. STRATEGIC OBJECTIVES</Subtitle>
        <List>
          <ListItem>To promote cooperation and mutual assistance among Member States on policies and strategies in diamond exploration, mining, cutting, polishing, and trading.</ListItem>
          <ListItem>The adoption of harmonized legal solutions between Member States in areas related to exploration, mining, cutting, and trade in diamonds.</ListItem>
          <ListItem>Development of human resources and promotion of mutual technical assistance.</ListItem>
          <ListItem>Transformation of conflict diamonds into diamonds for peace and sustainable development, in accordance with the Kimberley Process Certification Scheme.</ListItem>
        </List>
      </Section>

      <Section>
        <Subtitle><FaUsers /> 6. MEMBERSHIP</Subtitle>
        <Paragraph>
          The association's membership is classified into two categories: <Highlight>Effective members</Highlight> and <Highlight>Observers</Highlight>.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle><FaGem /> 7. EFFECTIVE MEMBERS</Subtitle>
        <Paragraph>
          Effective members are African diamond-producing countries that have signed or ratified the ADPA Statute and meet the requirements of the Kimberley Process Certification Scheme (KPCS).
        </Paragraph>
        <Paragraph>
          Currently, ADPA has <Highlight>15 effective members</Highlight>:
        </Paragraph>
        <CountryGrid>
          <CountryCard>Republic of Angola</CountryCard>
          <CountryCard>Republic of Cameroon</CountryCard>
          <CountryCard>Central African Republic</CountryCard>
          <CountryCard>Republic of Congo Brazzaville</CountryCard>
          <CountryCard>Democratic Republic of Congo</CountryCard>
          <CountryCard>Republic of Cote d'Ivoire</CountryCard>
          <CountryCard>Republic of Ghana</CountryCard>
          <CountryCard>Republic of Guinea</CountryCard>
          <CountryCard>Republic Liberia</CountryCard>
          <CountryCard>Republic Namibia</CountryCard>
          <CountryCard>Republic of Sierra-Leone</CountryCard>
          <CountryCard>Republic of South Africa</CountryCard>
          <CountryCard>United Republic of Tanzania</CountryCard>
          <CountryCard>Togolese Republic</CountryCard>
          <CountryCard>Republic of Zimbabwe</CountryCard>
        </CountryGrid>
      </Section>

      <Section>
        <Subtitle><FaUsers /> 8. OBSERVERS</Subtitle>
        <Paragraph>
          The following countries can be observers:
        </Paragraph>
        <List>
          <ListItem>All African nations with diamond potential</ListItem>
          <ListItem>Diamond-producing African countries not meeting KPCS requirements</ListItem>
          <ListItem>Non-African countries involved in the diamond value chain</ListItem>
        </List>
        <Paragraph>
          Currently, ADPA has <Highlight>6 Observers</Highlight>:
        </Paragraph>
        <CountryGrid>
          <CountryCard>Republic of Algeria</CountryCard>
          <CountryCard>Republic of Gabon</CountryCard>
          <CountryCard>Republic of Mali</CountryCard>
          <CountryCard>Islamic Republic of Mauritania</CountryCard>
          <CountryCard>Russia Federation</CountryCard>
          <CountryCard>Republic of Mozambique</CountryCard>
        </CountryGrid>
      </Section>

      <Section>
        <Subtitle><FaUsers /> 9. GOVERNANCE STRUCTURE</Subtitle>
        <Paragraph>
          The Association has the following bodies:
        </Paragraph>
        
        <Subtitle>Council of Ministers</Subtitle>
        <List>
          <ListItem>The highest deliberative body composed of Ministers responsible for the mining sector</ListItem>
          <ListItem>The Chairperson is elected for two years</ListItem>
          <ListItem>Current Chairperson (2023-2024): Honorable Winston Chitando, Minister of Mines and Mining Development of Zimbabwe</ListItem>
          <ListItem>Current Vice Chairperson (2023-2024): Honorable Julius Daniel Matta, Minister of Mines and Mineral Resources of Sierra Leone</ListItem>
        </List>
        
        <Subtitle>Committee of Experts</Subtitle>
        <List>
          <ListItem>Consultation body of the Council of Ministers</ListItem>
          <ListItem>Comprises Senior officials from Members and Observers</ListItem>
          <ListItem>Divided into technical advisors and internal auditors</ListItem>
        </List>
        
        <Subtitle>Executive Directorate</Subtitle>
        <Paragraph>
          Responsible for day-to-day management and implements policies set by the Council of Ministers.
        </Paragraph>
      </Section>

      <ContactInfo>
        <Subtitle><FaEnvelope /> Contact Information</Subtitle>
        <Paragraph><IconWrapper><FaEnvelope /></IconWrapper> <Highlight>Email:</Highlight> info@adpadirectorate.org</Paragraph>
        <Paragraph><IconWrapper><FaMapMarkerAlt /></IconWrapper> <Highlight>Address:</Highlight> ADPA Head Quarters, Avenida 1º Congresso do MPLA, Ingombota, Luanda, Edificio CIF 2, 12º Andar</Paragraph>
        <Paragraph><IconWrapper><FaShareAlt /></IconWrapper> <Highlight>Social Media:</Highlight> Facebook | LinkedIn</Paragraph>
        <Tagline>
          <FaGem /> Together Empowering the Brilliance of the African Diamond
        </Tagline>
      </ContactInfo>
    </AboutContainer>
  );
};

export default About;