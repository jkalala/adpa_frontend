import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 2rem auto;

  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  button {
    display: block;
    width: 100%;
    margin-top: 1rem;
  }
`;

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
        <FormContainer onSubmit={handleSubmit}>
            <label>
                Question 1:
                <input type="text" onChange={(e) => setResponses({ ...responses, q1: e.target.value })} />
            </label>
            <button type="submit">Submit</button>
        </FormContainer>
    );
};

export default SurveyForm;