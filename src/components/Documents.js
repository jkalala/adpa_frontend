import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, ListGroup, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';
import { FiDownload, FiFilter, FiX } from 'react-icons/fi';

// Styled Components
const StyledContainer = styled(Container)`
  padding: 3rem 0;
  font-family: 'Poppins', sans-serif;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: #1a1a2e;
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 2.5rem;
  }

  p {
    color: #6c757d;
    font-size: 1.2rem;
  }
`;

const FilterCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  border-left: 4px solid #1a1a2e;

  .card-body {
    padding: 1.5rem;
  }

  h5 {
    color: #1a1a2e;
    font-weight: 600;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const DocumentCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .card-body {
    padding: 1.5rem;
  }
`;

const DocumentItem = styled(ListGroup.Item)`
  padding: 1.5rem;
  border-left: none;
  border-right: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
  }

  &:first-of-type {
    border-top: none;
  }
`;

const CategoryBadge = styled.span`
  background-color: rgba(26, 26, 46, 0.1);
  color: #1a1a2e;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.75rem;
`;

const DownloadButton = styled(Button)`
  background: white;
  color: #1a1a2e;
  border: 2px solid #1a1a2e;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #1a1a2e;
    color: white;
    transform: translateY(-2px);
  }
`;

const ClearButton = styled(Button)`
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

const StyledFormControl = styled(Form.Control)`
  border-radius: 50px;
  padding: 0.75rem 1.25rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:focus {
    border-color: #1a1a2e;
    box-shadow: 0 0 0 0.25rem rgba(26, 26, 46, 0.25);
  }
`;

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('');
    const [country, setCountry] = useState('');

    const API_BASE_URL = 'http://localhost:1337';
    const API_URL = `${API_BASE_URL}/api`;

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`${API_URL}/adpadocuments?populate=*`);
                
                if (!response?.data?.data) {
                    throw new Error('Invalid API response structure');
                }

                const formattedDocs = response.data.data.map(doc => ({
                    id: doc.id,
                    documentId: doc.documentId,
                    name: doc.name,
                    category: doc.category,
                    year: doc.year,
                    country: doc.country,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                    file: doc.file ? `${API_BASE_URL}${doc.file.url}` : null
                }));
                
                setDocuments(formattedDocs);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.response?.data?.error?.message || err.message || 'Failed to load documents');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const categories = [...new Set(documents.map(doc => doc.category).filter(Boolean))];
    const years = [...new Set(documents.map(doc => doc.year).filter(Boolean))].sort((a, b) => b - a);
    const countries = [...new Set(documents.map(doc => doc.country).filter(Boolean))].sort();

    const filteredDocuments = documents.filter(doc => {
        return (
            doc.name?.toLowerCase().includes(search.toLowerCase()) &&
            (category === '' || doc.category === category) &&
            (year === '' || doc.year === year) &&
            (country === '' || doc.country === country)
        );
    });

    if (loading) {
        return (
            <StyledContainer className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading documents...</p>
            </StyledContainer>
        );
    }

    if (error) {
        return (
            <StyledContainer className="text-center py-5">
                <Alert variant="danger" className="mb-4">
                    Error loading documents: {error}
                </Alert>
                <Button 
                    variant="primary" 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2"
                >
                    Retry
                </Button>
            </StyledContainer>
        );
    }

    return (
        <StyledContainer>
            <PageHeader>
                <h1>ADPA Documents Repository</h1>
                <p>Access official publications and resources</p>
            </PageHeader>

            <Row>
                <Col md={3}>
                    <FilterCard>
                        <Card.Body>
                            <h5><FiFilter /> Filters</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Search Documents</Form.Label>
                                    <StyledFormControl
                                        type="search"
                                        placeholder="Enter keywords..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <StyledFormControl
                                        as="select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat, index) => (
                                            <option key={`filter-cat-${index}`} value={cat}>{cat}</option>
                                        ))}
                                    </StyledFormControl>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Year</Form.Label>
                                    <StyledFormControl
                                        as="select"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                    >
                                        <option value="">All Years</option>
                                        {years.map((yr, index) => (
                                            <option key={`filter-yr-${index}`} value={yr}>{yr}</option>
                                        ))}
                                    </StyledFormControl>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <StyledFormControl
                                        as="select"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        <option value="">All Countries</option>
                                        {countries.map((ctry, index) => (
                                            <option key={`filter-ctry-${index}`} value={ctry}>{ctry}</option>
                                        ))}
                                    </StyledFormControl>
                                </Form.Group>

                                <ClearButton 
                                    variant="outline-secondary" 
                                    onClick={() => {
                                        setSearch('');
                                        setCategory('');
                                        setYear('');
                                        setCountry('');
                                    }}
                                >
                                    <FiX /> Clear Filters
                                </ClearButton>
                            </Form>
                        </Card.Body>
                    </FilterCard>
                </Col>

                <Col md={9}>
                    <DocumentCard>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-semibold mb-0 text-dark">
                                    {filteredDocuments.length} {filteredDocuments.length === 1 ? 'Document' : 'Documents'} Found
                                </h5>
                                <small className="text-muted">Sorted by: Most Recent</small>
                            </div>

                            {filteredDocuments.length > 0 ? (
                                <ListGroup variant="flush">
                                    {filteredDocuments.map(doc => (
                                        <DocumentItem key={doc.id}>
                                            <Row className="align-items-center">
                                                <Col>
                                                    <div className="d-flex align-items-center mb-2">
                                                        {doc.category && (
                                                            <CategoryBadge>
                                                                {doc.category}
                                                            </CategoryBadge>
                                                        )}
                                                        <small className="text-muted">
                                                            {doc.country} • {doc.year}
                                                        </small>
                                                    </div>
                                                    <h6 className="mb-1 fw-semibold">{doc.name}</h6>
                                                    <small className="text-muted">
                                                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                                                    </small>
                                                </Col>
                                                <Col xs="auto">
                                                    {doc.file ? (
                                                        <DownloadButton
                                                            href={doc.file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <FiDownload /> Download
                                                        </DownloadButton>
                                                    ) : (
                                                        <span className="text-muted">No file attached</span>
                                                    )}
                                                </Col>
                                            </Row>
                                        </DocumentItem>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-5">
                                    <h5 className="text-muted mb-3">No documents found</h5>
                                    <p className="text-muted mb-4">Try adjusting your search filters</p>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => {
                                            setSearch('');
                                            setCategory('');
                                            setYear('');
                                            setCountry('');
                                        }}
                                        className="px-4 py-2"
                                    >
                                        <FiX /> Clear Filters
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </DocumentCard>
                </Col>
            </Row>
        </StyledContainer>
    );
};

export default Documents;