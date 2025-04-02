import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MemberOnlyPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <h1>Member Only Area</h1>
            <p>Welcome to the exclusive member content!</p>
            <button 
                onClick={() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate('/login');
                }}
                className="btn btn-danger"
            >
                Logout
            </button>
        </div>
    );
};

export default MemberOnlyPage;