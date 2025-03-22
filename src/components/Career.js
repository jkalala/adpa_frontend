import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;

  h2 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  p {
    color: #555;
  }
`;

const Career = () => {
    return (
        <AboutContainer>
            <h2>About Careers in ADPA</h2>
            <p>Learn more about the African Diamond Producers Association and our mission.</p>
        </AboutContainer>
    );
};

export default Career;