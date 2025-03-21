import React, { useState } from 'react';

const SurveyForm = () => {
    const [responses, setResponses] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/submit-survey/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ member_id: 1, response_data: responses }),
        });
        const result = await response.json();
        alert(result.status === 'success' ? 'Survey submitted!' : 'Error submitting survey.');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Question 1:
                <input type="text" onChange={(e) => setResponses({ ...responses, q1: e.target.value })} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default SurveyForm;