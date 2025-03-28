import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Modal, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const Documents = () => {
    // State for documents
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filters
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('');
    const [country, setCountry] = useState('');

    // State for upload modal
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newDocument, setNewDocument] = useState({
        name: '',
        category: '',
        year: '',
        country: '',
        file: null
    });

    // API configuration
    const API_BASE_URL = 'http://localhost:1337';
    const API_URL = `${API_BASE_URL}/api`;

    // Fetch documents from Strapi
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`${API_URL}/adpadocuments?populate=*`);
                
                if (!response?.data?.data) {
                    throw new Error('Invalid API response structure');
                }

                // Process documents with proper file URL handling
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

    // Get unique values for filters
    const categories = [...new Set(documents.map(doc => doc.category).filter(Boolean))];
    const years = [...new Set(documents.map(doc => doc.year).filter(Boolean))].sort((a, b) => b - a);
    const countries = [...new Set(documents.map(doc => doc.country).filter(Boolean))].sort();

    // Filter documents
    const filteredDocuments = documents.filter(doc => {
        return (
            doc.name?.toLowerCase().includes(search.toLowerCase()) &&
            (category === '' || doc.category === category) &&
            (year === '' || doc.year === year) &&
            (country === '' || doc.country === country)
        );
    });

    // Handle file change
    const handleFileChange = (e) => {
        setNewDocument({
            ...newDocument,
            file: e.target.files[0]
        });
    };

    // Handle document upload to Strapi
    const handleUpload = async () => {
        if (!newDocument.file || !newDocument.name || !newDocument.category || !newDocument.year || !newDocument.country) {
            alert('Please fill all fields and select a file');
            return;
        }

        setUploading(true);

        try {
            // First upload the file
            const formData = new FormData();
            formData.append('files', newDocument.file);

            const fileUploadResponse = await axios.post(
                `${API_URL}/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const fileId = fileUploadResponse.data[0].id;

            // Then create the document entry with the file reference
            const documentResponse = await axios.post(
                `${API_URL}/adpadocuments`,
                {
                    data: {
                        name: newDocument.name,
                        category: newDocument.category,
                        year: newDocument.year,
                        country: newDocument.country,
                        file: fileId
                    }
                }
            );

            // Fetch the newly created document with populated file
            const newDocResponse = await axios.get(
                `${API_URL}/adpadocuments/${documentResponse.data.data.id}?populate=*`
            );

            const newDoc = {
                id: newDocResponse.data.data.id,
                documentId: newDocResponse.data.data.documentId,
                name: newDocResponse.data.data.name,
                category: newDocResponse.data.data.category,
                year: newDocResponse.data.data.year,
                country: newDocResponse.data.data.country,
                createdAt: newDocResponse.data.data.createdAt,
                updatedAt: newDocResponse.data.data.updatedAt,
                file: newDocResponse.data.data.file ? `${API_BASE_URL}${newDocResponse.data.data.file.url}` : null
            };

            setDocuments([newDoc, ...documents]);
            setShowUploadModal(false);
            setNewDocument({
                name: '',
                category: '',
                year: '',
                country: '',
                file: null
            });
        } catch (err) {
            console.error('Upload error:', err);
            alert('Error uploading document');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading documents...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5 text-center">
                <Alert variant="danger">
                    Error loading documents: {error}
                </Alert>
                <Button variant="primary" onClick={() => window.location.reload()} className="mt-3">
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            {/* Upload Document Modal */}
            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload New Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Document Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter document name"
                                value={newDocument.name}
                                onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                value={newDocument.category}
                                onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat, index) => (
                                    <option key={`cat-${index}`} value={cat}>{cat}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter year"
                                value={newDocument.year}
                                onChange={(e) => setNewDocument({...newDocument, year: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                as="select"
                                value={newDocument.country}
                                onChange={(e) => setNewDocument({...newDocument, country: e.target.value})}
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map((ctry, index) => (
                                    <option key={`ctry-${index}`} value={ctry}>{ctry}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Document File</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                required
                            />
                            <Form.Text className="text-muted">
                                Please upload the document file (PDF, DOCX, etc.)
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row className="mb-4">
                <Col className="text-center">
                    <h1 className="text-primary fw-bold">ADPA Documents Repository</h1>
                    <p className="lead text-muted">Access official publications and resources</p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col className="text-end">
                    <Button 
                        variant="primary" 
                        onClick={() => setShowUploadModal(true)}
                        className="rounded-pill px-4"
                    >
                        Upload Document
                    </Button>
                </Col>
            </Row>

            <Row>
                {/* Filters Column */}
                <Col md={3}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <h5 className="fw-semibold mb-4 text-primary">Filters</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Search Documents</Form.Label>
                                    <Form.Control
                                        type="search"
                                        placeholder="Enter keywords..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="rounded-pill"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="rounded-pill"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat, index) => (
                                            <option key={`filter-cat-${index}`} value={cat}>{cat}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Year</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="rounded-pill"
                                    >
                                        <option value="">All Years</option>
                                        {years.map((yr, index) => (
                                            <option key={`filter-yr-${index}`} value={yr}>{yr}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="rounded-pill"
                                    >
                                        <option value="">All Countries</option>
                                        {countries.map((ctry, index) => (
                                            <option key={`filter-ctry-${index}`} value={ctry}>{ctry}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => {
                                        setSearch('');
                                        setCategory('');
                                        setYear('');
                                        setCountry('');
                                    }}
                                    className="w-100 rounded-pill"
                                >
                                    Clear Filters
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Documents Column */}
                <Col md={9}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-semibold mb-0 text-primary">
                                    {filteredDocuments.length} {filteredDocuments.length === 1 ? 'Document' : 'Documents'} Found
                                </h5>
                                <small className="text-muted">Sorted by: Most Recent</small>
                            </div>

                            {filteredDocuments.length > 0 ? (
                                <ListGroup variant="flush">
                                    {filteredDocuments.map(doc => (
                                        <ListGroup.Item key={doc.id} className="py-3 border-bottom">
                                            <Row className="align-items-center">
                                                <Col>
                                                    <div className="d-flex align-items-center mb-1">
                                                        {doc.category && (
                                                            <span className="badge bg-primary-light text-primary me-2">
                                                                {doc.category}
                                                            </span>
                                                        )}
                                                        <small className="text-muted">
                                                            {doc.country} • {doc.year}
                                                        </small>
                                                    </div>
                                                    <h6 className="mb-0 fw-semibold">{doc.name}</h6>
                                                    <small className="text-muted">
                                                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                                                    </small>
                                                </Col>
                                                <Col xs="auto">
                                                    {doc.file ? (
                                                        <Button
                                                            variant="outline-primary"
                                                            href={doc.file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-white rounded-pill px-4 py-2 border-2 text-primary fw-medium"
                                                        >
                                                            Download
                                                        </Button>
                                                    ) : (
                                                        <span className="text-muted">No file attached</span>
                                                    )}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-5">
                                    <h5 className="text-muted">No documents found</h5>
                                    <p className="text-muted">Try adjusting your search filters</p>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => {
                                            setSearch('');
                                            setCategory('');
                                            setYear('');
                                            setCountry('');
                                        }}
                                        className="rounded-pill px-4"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Documents;