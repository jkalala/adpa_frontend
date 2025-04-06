import React, { useState } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { FiFile } from 'react-icons/fi';
import DocumentCard from './components/DocumentCard';

const DocumentRepository = () => {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    { id: 1, title: 'ADPA Charter', category: 'governance', type: 'pdf', size: '2.4 MB', date: '2023-01-15' },
    { id: 2, title: 'Membership Guidelines', category: 'membership', type: 'docx', size: '1.1 MB', date: '2023-02-20' },
    { id: 3, title: 'Annual Report 2022', category: 'reports', type: 'pdf', size: '5.7 MB', date: '2023-03-10' },
    { id: 4, title: 'Project Proposal Template', category: 'templates', type: 'docx', size: '0.8 MB', date: '2023-01-05' },
  ];

  const filteredDocs = documents.filter(doc => 
    (category === 'all' || doc.category === category) &&
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col md={6}>
            <h5>Document Repository</h5>
          </Col>
          <Col md={6}>
            <Form inline className="float-md-right">
              <Form.Control
                type="text"
                placeholder="Search documents..."
                className="mr-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="governance">Governance</option>
                <option value="membership">Membership</option>
                <option value="reports">Reports</option>
                <option value="templates">Templates</option>
              </Form.Control>
            </Form>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Row>
          {filteredDocs.map(doc => (
            <Col md={6} lg={4} key={doc.id} className="mb-3">
              <DocumentCard document={doc} />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DocumentRepository;