import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Alert } from 'react-bootstrap';

const MemberOnly = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/api/member-only/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessage(response.data.message);
            } catch (err) {
                setError('Unauthorized');
            }
        };
        fetchData();
    }, []);

    return (
        <Container className="mt-5">
            <h2>Member Only Area</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
        </Container>
    );
};

export default MemberOnly;