import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { FiDownload, FiSearch, FiFilter } from 'react-icons/fi';

const FinancialReports = ({ country }) => {
  const [yearFilter, setYearFilter] = useState('2023');
  const [searchTerm, setSearchTerm] = useState('');

  const reports = [
    { id: 1, year: '2023', title: 'Annual Financial Statement', type: 'Statement', date: '2023-03-15', downloadCount: 42 },
    { id: 2, year: '2023', title: 'Q1 Expenditure Report', type: 'Quarterly', date: '2023-04-20', downloadCount: 28 },
    { id: 3, year: '2022', title: 'Annual Audit Report', type: 'Audit', date: '2022-06-10', downloadCount: 56 },
    { id: 4, year: '2022', title: 'Special Projects Funding', type: 'Special', date: '2022-09-05', downloadCount: 31 },
  ];

  const filteredReports = reports.filter(report => 
    report.year.includes(yearFilter) && 
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col md={6}>
            <h5>Financial Documents</h5>
          </Col>
          <Col md={6}>
            <Form inline className="float-md-right">
              <Form.Control
                as="select"
                className="mr-2"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </Form.Control>
              <Form.Control
                type="text"
                placeholder="Search reports..."
                className="mr-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary">
                <FiFilter className="mr-1" /> Filter
              </Button>
            </Form>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Downloads</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map(report => (
              <tr key={report.id}>
                <td>{report.title}</td>
                <td>{report.type}</td>
                <td>{report.date}</td>
                <td>{report.downloadCount}</td>
                <td>
                  <Button variant="link" size="sm">
                    <FiDownload className="mr-1" /> Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default FinancialReports;