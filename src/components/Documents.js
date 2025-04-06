/**
 * ADPA Documents Repository Component
 * 
 * A React component that displays a filterable and searchable list of documents
 * fetched from a backend API. Includes filtering by category, year, and country,
 * with responsive design and loading/error states.
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, ListGroup, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FiDownload, FiFilter, FiX, FiSearch, FiCalendar, FiGlobe, FiFileText, FiRefreshCw } from 'react-icons/fi';

// =============================================
// ANIMATIONS
// =============================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`;

// =============================================
// STYLED COMPONENTS
// =============================================

/**
 * Main container with custom padding and font
 */
const StyledContainer = styled(Container)`
  padding: 3rem 0;
  font-family: 'Poppins', sans-serif;
  animation: ${fadeIn} 0.8s ease-out;
`;

/**
 * Page header section with title and description
 */
const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  h1 {
    color: #1a1a2e;
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #4cc9f0, #4361ee);
      border-radius: 2px;
    }
  }

  p {
    color: #6c757d;
    font-size: 1.2rem;
    max-width: 700px;
    margin: 0 auto;
  }
`;

/**
 * Card component for filter controls with glassmorphism effect
 */
const FilterCard = styled(Card)`
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  border-left: 4px solid #4cc9f0;
  animation: ${slideIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.2s;

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
    
    svg {
      color: #4cc9f0;
    }
  }
`;

/**
 * Card component for displaying document list with glassmorphism effect
 */
const DocumentCard = styled(Card)`
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  animation: ${slideIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.3s;

  .card-body {
    padding: 1.5rem;
  }
`;

/**
 * Individual document list item with hover effects
 */
const DocumentItem = styled(ListGroup.Item)`
  padding: 1.5rem;
  border-left: none;
  border-right: none;
  transition: all 0.3s ease;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.1}s;

  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &:first-of-type {
    border-top: none;
  }
`;

/**
 * Badge component for document categories with gradient background
 */
const CategoryBadge = styled.span`
  background: linear-gradient(135deg, #4cc9f0, #4361ee);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.75rem;
  box-shadow: 0 2px 5px rgba(76, 201, 240, 0.3);
`;

/**
 * Custom download button with gradient and hover effects
 */
const DownloadButton = styled(Button)`
  background: linear-gradient(135deg, #4cc9f0, #4361ee);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.3);

  &:hover {
    background: linear-gradient(135deg, #3ab8df, #3250d4);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 201, 240, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

/**
 * Full-width clear filters button with gradient
 */
const ClearButton = styled(Button)`
  background: white;
  color: #1a1a2e;
  border: 2px solid #1a1a2e;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    background: #1a1a2e;
    color: white;
    transform: translateY(-2px);
  }
`;

/**
 * Custom styled form inputs with rounded corners and focus effects
 */
const StyledFormControl = styled(Form.Control)`
  border-radius: 50px;
  padding: 0.75rem 1.25rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);

  &:focus {
    border-color: #4cc9f0;
    box-shadow: 0 0 0 0.25rem rgba(76, 201, 240, 0.25);
  }
`;

/**
 * Form label with icon
 */
const FormLabel = styled(Form.Label)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  
  svg {
    color: #4cc9f0;
  }
`;

/**
 * Loading container with animation
 */
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    color: #4cc9f0;
  }
  
  p {
    margin-top: 1rem;
    color: #6c757d;
    font-size: 1.1rem;
  }
`;

/**
 * Error container with styling
 */
const ErrorContainer = styled.div`
  border-radius: 12px;
  border: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  background-color: #f8d7da;
  color: #842029;
  
  h4 {
    color: #dc3545;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .btn {
    border-radius: 50px;
    padding: 0.5rem 1.25rem;
    font-weight: 500;
    
    &.btn-primary {
      background: linear-gradient(135deg, #4cc9f0, #4361ee);
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #3ab8df, #3250d4);
      }
    }
  }
`;

/**
 * Results header with count and sorting info
 */
const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  h5 {
    font-weight: 600;
    color: #1a1a2e;
    margin: 0;
  }
  
  small {
    color: #6c757d;
  }
`;

/**
 * Empty state container
 */
const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  
  h5 {
    color: #1a1a2e;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  p {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }
  
  .btn {
    border-radius: 50px;
    padding: 0.5rem 1.5rem;
    font-weight: 500;
  }
`;

/**
 * Document metadata container
 */
const DocumentMetadata = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  small {
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      font-size: 0.9rem;
    }
  }
`;

/**
 * Document title
 */
const DocumentTitle = styled.h6`
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

/**
 * Document date
 */
const DocumentDate = styled.small`
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    font-size: 0.9rem;
  }
`;

// =============================================
// MAIN COMPONENT
// =============================================

const Documents = () => {
    // Component state
    const [documents, setDocuments] = useState([]);          // Array of all documents from API
    const [loading, setLoading] = useState(true);           // Loading state flag
    const [error, setError] = useState(null);               // Error message state
    const [search, setSearch] = useState('');               // Search term filter
    const [category, setCategory] = useState('');          // Selected category filter
    const [year, setYear] = useState('');                   // Selected year filter
    const [country, setCountry] = useState('');             // Selected country filter

    // API configuration - TODO: Move to environment variables in production
    const API_BASE_URL = 'http://localhost:1337';
    const API_URL = `${API_BASE_URL}/api`;

    /**
     * Fetches documents from API on component mount
     */
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch documents with populated file data
                const response = await axios.get(`${API_URL}/adpadocuments?populate=*`);
                
                // Validate API response structure
                if (!response?.data?.data) {
                    throw new Error('Invalid API response structure');
                }

                // Transform API response to consistent format
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
                // Set user-friendly error message
                setError(err.response?.data?.error?.message || err.message || 'Failed to load documents');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    // Extract unique filter options from documents
    const categories = [...new Set(documents.map(doc => doc.category).filter(Boolean))];
    const years = [...new Set(documents.map(doc => doc.year).filter(Boolean))].sort((a, b) => b - a); // Sort years descending
    const countries = [...new Set(documents.map(doc => doc.country).filter(Boolean))].sort(); // Sort countries alphabetically

    /**
     * Filters documents based on current search and filter criteria
     */
    const filteredDocuments = documents.filter(doc => {
        return (
            doc.name?.toLowerCase().includes(search.toLowerCase()) &&  // Search term match
            (category === '' || doc.category === category) &&         // Category filter
            (year === '' || doc.year === year) &&                    // Year filter
            (country === '' || doc.country === country)              // Country filter
        );
    });

    // =============================================
    // RENDER STATES
    // =============================================

    // Loading state
    if (loading) {
        return (
            <StyledContainer>
                <LoadingContainer>
                    <Spinner animation="border" />
                    <p>Loading documents...</p>
                </LoadingContainer>
            </StyledContainer>
        );
    }

    // Error state
    if (error) {
        return (
            <StyledContainer>
                <ErrorContainer>
                    <h4>Error Loading Documents</h4>
                    <p>{error}</p>
                    <Button 
                        variant="primary" 
                        onClick={() => window.location.reload()}
                        className="mt-3"
                    >
                        <FiRefreshCw className="me-2" /> Retry
                    </Button>
                </ErrorContainer>
            </StyledContainer>
        );
    }

    // Main render
    return (
        <StyledContainer>
            {/* Page Header */}
            <PageHeader>
                <h1>ADPA Documents Repository</h1>
                <p>Access official publications and resources from the African Diamond Producers Association</p>
            </PageHeader>

            <Row>
                {/* Filter Sidebar - Column (3/12 width on medium+ screens) */}
                <Col md={3}>
                    <FilterCard>
                        <Card.Body>
                            <h5><FiFilter /> Filters</h5>
                            <Form>
                                {/* Search Documents Input */}
                                <Form.Group className="mb-3">
                                    <FormLabel><FiSearch /> Search Documents</FormLabel>
                                    <StyledFormControl
                                        type="search"
                                        placeholder="Enter keywords..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </Form.Group>

                                {/* Category Filter Dropdown */}
                                <Form.Group className="mb-3">
                                    <FormLabel><FiFileText /> Category</FormLabel>
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

                                {/* Year Filter Dropdown */}
                                <Form.Group className="mb-3">
                                    <FormLabel><FiCalendar /> Year</FormLabel>
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

                                {/* Country Filter Dropdown */}
                                <Form.Group className="mb-3">
                                    <FormLabel><FiGlobe /> Country</FormLabel>
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

                                {/* Clear Filters Button */}
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

                {/* Document List - Column (9/12 width on medium+ screens) */}
                <Col md={9}>
                    <DocumentCard>
                        <Card.Body>
                            {/* Results Header */}
                            <ResultsHeader>
                                <h5>
                                    {filteredDocuments.length} {filteredDocuments.length === 1 ? 'Document' : 'Documents'} Found
                                </h5>
                                <small>Sorted by: Most Recent</small>
                            </ResultsHeader>

                            {/* Document List or Empty State */}
                            {filteredDocuments.length > 0 ? (
                                <ListGroup variant="flush">
                                    {filteredDocuments.map((doc, index) => (
                                        <DocumentItem key={doc.id} index={index}>
                                            <Row className="align-items-center">
                                                <Col>
                                                    {/* Document Metadata */}
                                                    <DocumentMetadata>
                                                        {doc.category && (
                                                            <CategoryBadge>
                                                                {doc.category}
                                                            </CategoryBadge>
                                                        )}
                                                        <small>
                                                            {doc.country && (
                                                                <>
                                                                    <FiGlobe /> {doc.country}
                                                                </>
                                                            )}
                                                            {doc.year && (
                                                                <>
                                                                    <FiCalendar /> {doc.year}
                                                                </>
                                                            )}
                                                        </small>
                                                    </DocumentMetadata>
                                                    {/* Document Name */}
                                                    <DocumentTitle>{doc.name}</DocumentTitle>
                                                    {/* Upload Date */}
                                                    <DocumentDate>
                                                        <FiCalendar /> Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                                                    </DocumentDate>
                                                </Col>
                                                <Col xs="auto">
                                                    {/* Download Button or No File Message */}
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
                                /* Empty State */
                                <EmptyState>
                                    <h5>No documents found</h5>
                                    <p>Try adjusting your search filters</p>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => {
                                            setSearch('');
                                            setCategory('');
                                            setYear('');
                                            setCountry('');
                                        }}
                                    >
                                        <FiX className="me-2" /> Clear Filters
                                    </Button>
                                </EmptyState>
                            )}
                        </Card.Body>
                    </DocumentCard>
                </Col>
            </Row>
        </StyledContainer>
    );
};

export default Documents;