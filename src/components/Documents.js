import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';

const Documents = () => {
    // Sample data for documents
    const [documents, setDocuments] = useState([
        { id: 1, category: 'Governance', name: 'ADPA Governance Framework', year: 2023, country: 'Namibia', file: 'governance.pdf' },
        { id: 2, category: 'Reports', name: 'Annual Report 2022', year: 2022, country: 'Angola', file: 'annual-report-2022.pdf' },
        { id: 3, category: 'Policies', name: 'Ethical Sourcing Policy', year: 2023, country: 'Botswana', file: 'ethical-sourcing.pdf' },
    ]);

    // State for filters
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('');
    const [country, setCountry] = useState('');

    // Filter documents based on search and filters
    const filteredDocuments = documents.filter(doc => {
        return (
            doc.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === '' || doc.category === category) &&
            (year === '' || doc.year === parseInt(year)) &&
            (country === '' || doc.country === country)
        );
    });

    return (
        <Container className="mt-5">
            <Row>
                <Col className="text-center">
                    <h1>Download ADPA Documents</h1>
                </Col>
            </Row>

            <Row className="mt-4">
                {/* Filters Column */}
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <h5>Filters</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Search</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search documents"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Governance">Governance</option>
                                        <option value="Reports">Reports</option>
                                        <option value="Policies">Policies</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Year</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                    >
                                        <option value="">All Years</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                        <option value="2021">2021</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        <option value="">All Countries</option>
                                        <option value="Namibia">Namibia</option>
                                        <option value="Angola">Angola</option>
                                        <option value="Botswana">Botswana</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Documents Column */}
                <Col md={9}>
                    <ListGroup>
                        {filteredDocuments.map(doc => (
                            <ListGroup.Item key={doc.id}>
                                <Row>
                                    <Col>
                                        <h6>{doc.category}</h6>
                                        <p>{doc.name}</p>
                                    </Col>
                                    <Col className="text-end">
                                        <Button
                                            variant="primary"
                                            href={`/path/to/documents/${doc.file}`}  // Replace with actual file path
                                            download
                                        >
                                            <i className="bi bi-download"></i> Download
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default Documents;