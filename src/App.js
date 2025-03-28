import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Forms from './components/Forms';
import Members from './components/Members';
import News from './components/News';
import Gallery from './components/Gallery';
import Career from './components/Career';
import Contact from './components/Contact';
import Documents from './components/Documents'; // new component 
import ExternalLinks from './components/ExternalLinks';
import Login from './components/Login';
import PasswordRecovery from './components/PasswordRecovery';
import ForgotPassword from './components/ForgotPassword';
import RequestAccess from './components/Register';
import MemberOnly from './components/MemberOnly';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/password-recovery" element={<PasswordRecovery />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/member-only" element={<MemberOnly />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/forms" element={<Forms />} />
                <Route path="/register" element={<RequestAccess />} />
                <Route path="/members" element={<Members />} />
                <Route path="/news" element={<News />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/career" element={<Career />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/external-links" element={<ExternalLinks />} />
                <Route path="/documents" element={<Documents />} />  {/* New route */}
                <Route path="/login" element={<Login />} />  {/* Login route */}
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;