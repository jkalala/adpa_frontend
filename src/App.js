import React from 'react';
import Home from './components/Home';
import SurveyForm from './components/SurveyForm';
import LanguageSelector from './components/LanguageSelector';

function App() {
    return (
        <div>
            <LanguageSelector />
            <Home />
            <SurveyForm />
        </div>
    );
}

export default App;