import React, { useState, useEffect } from 'react';
import { 
  Card, Form, InputGroup, Table, Badge, Button, 
  Row, Col, Spinner, Alert, Modal
} from 'react-bootstrap';
import { FiSearch, FiUser, FiMail, FiPhone, FiMapPin, FiFilter, FiEye } from 'react-icons/fi';
import axios from 'axios';

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    membershipType: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, filters, members]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get('/api/members');
      setMembers(response.data);
      setFilteredMembers(response.data);
    } catch (err) {
      setError('Failed to load member directory. Please try again later.');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = [...members];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(term) ||
        member.organization.toLowerCase().includes(term) ||
        member.country.toLowerCase().includes(term)
      );
    }
    
    // Apply other filters
    if (filters.country) {
      filtered = filtered.filter(member => member.country === filters.country);
    }
    
    if (filters.membershipType) {
      filtered = filtered.filter(member => member.membershipType === filters.membershipType);
    }
    
    if (filters.status) {
      filtered = filtered.filter(member => member.status === filters.status);
    }
    
    setFilteredMembers(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowMemberDetails(true);
  };

  const handleConnect = async (memberId) => {
    try {
      // Replace with your actual API endpoint
      await axios.post(`/api/members/connect/${memberId}`);
      // Show success message or update UI
    } catch (err) {
      console.error('Error connecting with member:', err);
    }
  };

  const renderMemberDetails = () => (
    <Modal show={showMemberDetails} onHide={() => setShowMemberDetails(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Member Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedMember && (
          <div>
            <div className="text-center mb-4">
              <div className="member-avatar mb-3">
                {selectedMember.avatar ? (
                  <img src={selectedMember.avatar} alt={selectedMember.name} className="rounded-circle" />
                ) : (
                  <FiUser size={50} />
                )}
              </div>
              <h4>{selectedMember.name}</h4>
              <p className="text-muted">{selectedMember.organization}</p>
              <Badge bg={selectedMember.status === 'active' ? 'success' : 'warning'}>
                {selectedMember.status}
              </Badge>
            </div>
            
            <Row className="mb-4">
              <Col md={6}>
                <div className="d-flex align-items-center mb-3">
                  <FiMail className="me-2" />
                  <div>
                    <small className="text-muted">Email</small>
                    <div>{selectedMember.email}</div>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="d-flex align-items-center mb-3">
                  <FiPhone className="me-2" />
                  <div>
                    <small className="text-muted">Phone</small>
                    <div>{selectedMember.phone || 'Not provided'}</div>
                  </div>
                </div>
              </Col>
            </Row>
            
            <div className="d-flex align-items-center mb-3">
              <FiMapPin className="me-2" />
              <div>
                <small className="text-muted">Location</small>
                <div>{selectedMember.country}</div>
              </div>
            </div>
            
            <div className="mb-3">
              <h6>About</h6>
              <p>{selectedMember.bio || 'No bio provided'}</p>
            </div>
            
            <div className="mb-3">
              <h6>Expertise</h6>
              <div className="d-flex flex-wrap gap-2">
                {selectedMember.expertise?.map((skill, index) => (
                  <Badge key={index} bg="info">{skill}</Badge>
                )) || 'No expertise listed'}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShowMemberDetails(false)}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={() => handleConnect(selectedMember?.id)}
        >
          Connect
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderFilters = () => (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Filters</h5>
          <Button 
            variant="link" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {showFilters && (
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Select 
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                >
                  <option value="">All Countries</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  {/* Add more countries */}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Membership Type</Form.Label>
                <Form.Select 
                  name="membershipType"
                  value={filters.membershipType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                  <option value="student">Student</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading member directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchMembers}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="member-directory">
      <Card className="mb-4">
        <Card.Body>
          <h4 className="mb-4">Member Directory</h4>
          
          <InputGroup className="mb-4">
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search members by name, organization, or country..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
          
          {renderFilters()}
          
          <div className="table-responsive">
            <Table hover className="member-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Country</th>
                  <th>Membership Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="member-avatar me-2">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="rounded-circle" />
                            ) : (
                              <FiUser />
                            )}
                          </div>
                          {member.name}
                        </div>
                      </td>
                      <td>{member.organization}</td>
                      <td>{member.country}</td>
                      <td>{member.membershipType}</td>
                      <td>
                        <Badge bg={member.status === 'active' ? 'success' : 'warning'}>
                          {member.status}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewMember(member)}
                        >
                          <FiEye className="me-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No members found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {renderMemberDetails()}
    </div>
  );
};

export default MemberDirectory;