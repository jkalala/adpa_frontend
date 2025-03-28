import React, {useContext} from 'react';
import styled from 'styled-components';
import { LanguageContext } from '../contexts/LanguageContext';


const LanguageContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;

  button {
    background-color: #28a745;
    &:hover {
      background-color: #218838;
    }
  }
`;


const LanguageSelector = () => {
    //const { setLanguage } = useContext(LanguageContext);

    return (
        <LanguageContainer>
            <button onClick={() => setLanguage('en')}>English</button>
            <button onClick={() => setLanguage('fr')}>Français</button>
            <button onClick={() => setLanguage('pt')}>Português</button>
        </LanguageContainer>
    );
};

export default LanguageSelector;