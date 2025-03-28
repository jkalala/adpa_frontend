import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { FiMail, FiUser, FiBriefcase, FiFileText, FiArrowRight } from 'react-icons/fi';
import styled from 'styled-components';

// Styled components
const RequestAccessContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const RequestAccessCard = styled(Card)`
  border: none;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(26, 26, 46, 0.1);
  max-width: 700px;
  margin: 0 auto;
  overflow: hidden;
  border-top: 4px solid #1a1a2e;
`;

const FormHeader = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #1a1a2e;
  color: white;
  
  h2 {
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0;
  }
`;

const FormBody = styled.div`
  padding: 2rem;
`;

const StyledFormControl = styled(Form.Control)`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #4cc9f0;
    box-shadow: 0 0 0 0.25rem rgba(76, 201, 240, 0.25);
  }
`;

const StyledTextArea = styled(StyledFormControl)`
  min-height: 120px;
`;

const PrimaryButton = styled(Button)`
  background-color: #1a1a2e;
  border: none;
  padding: 0.75rem 2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  
  &:hover {
    background-color: #2a2a40;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

const FormIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
`;

const FormGroupWithIcon = styled(Form.Group)`
  position: relative;
  
  ${Form.Label} {
    padding-left: 35px;
  }
  
  ${StyledFormControl} {
    padding-left: 45px;
  }
`;

const SuccessCard = styled(RequestAccessCard)`
  text-align: center;
  padding: 3rem;
  
  h2 {
    color: #1a1a2e;
    margin-bottom: 1.5rem;
  }
  
  p {
    color: #6c757d;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
`;

const RequestAccess = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    organization: '',
    position: '',
    purpose: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('/api/access-request/', formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <RequestAccessContainer>
        <SuccessCard>
          <h2>Request Submitted Successfully</h2>
          <p>
            Thank you for your interest in ADPA! We've received your access request and will review it shortly.
            You'll receive an email notification once your request has been processed.
          </p>
          <PrimaryButton onClick={() => setSuccess(false)}>
            Submit Another Request <FiArrowRight />
          </PrimaryButton>
        </SuccessCard>
      </RequestAccessContainer>
    );
  }

  return (
    <RequestAccessContainer>
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <RequestAccessCard>
            <FormHeader>
              <h2>Member Portal Access Request</h2>
              <p>Complete this form to request access to ADPA's exclusive member resources</p>
            </FormHeader>
            
            <FormBody>
              {error && <Alert variant="danger" className="text-center">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <FormGroupWithIcon className="mb-4">
                  <Form.Label>Email Address</Form.Label>
                  <FiMail className="position-absolute" size={20} />
                  <StyledFormControl
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </FormGroupWithIcon>

                <Row className="mb-4">
                  <Col md={6} className="mb-3 mb-md-0">
                    <FormGroupWithIcon>
                      <Form.Label>First Name</Form.Label>
                      <FiUser className="position-absolute" size={20} />
                      <StyledFormControl
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </FormGroupWithIcon>
                  </Col>
                  <Col md={6}>
                    <FormGroupWithIcon>
                      <Form.Label>Last Name</Form.Label>
                      <FiUser className="position-absolute" size={20} />
                      <StyledFormControl
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                    </FormGroupWithIcon>
                  </Col>
                </Row>

                <FormGroupWithIcon className="mb-4">
                  <Form.Label>Organization</Form.Label>
                  <FiBriefcase className="position-absolute" size={20} />
                  <StyledFormControl
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                  />
                </FormGroupWithIcon>

                <FormGroupWithIcon className="mb-4">
                  <Form.Label>Position</Form.Label>
                  <FiBriefcase className="position-absolute" size={20} />
                  <StyledFormControl
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </FormGroupWithIcon>

                <FormGroupWithIcon className="mb-4">
                  <Form.Label>Purpose of Access</Form.Label>
                  <FiFileText className="position-absolute" size={20} />
                  <StyledTextArea
                    as="textarea"
                    rows={4}
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    placeholder="Please describe why you need access to the member portal..."
                  />
                </FormGroupWithIcon>

                <div className="d-grid mt-4">
                  <PrimaryButton 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Request <FiArrowRight />
                      </>
                    )}
                  </PrimaryButton>
                </div>
              </Form>
            </FormBody>
          </RequestAccessCard>
        </Col>
      </Row>
    </RequestAccessContainer>
  );
};

export default RequestAccess;