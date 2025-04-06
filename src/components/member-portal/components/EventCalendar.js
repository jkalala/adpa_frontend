import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Badge, Modal, Form, 
  Spinner, Alert, Tabs, Tab, ListGroup
} from 'react-bootstrap';
import { 
  FiCalendar, FiClock, FiMapPin, FiUsers, 
  FiPlus, FiFilter, FiSearch, FiDownload,
  FiExternalLink, FiVideo, FiBookOpen
} from 'react-icons/fi';
import axios from 'axios';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    eventType: '',
    category: '',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    organization: '',
    dietaryRestrictions: '',
    additionalNotes: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, filters, events, activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get('/api/events');
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];
    
    // Filter by tab (upcoming, past, all)
    if (activeTab === 'upcoming') {
      const now = new Date();
      filtered = filtered.filter(event => new Date(event.startDate) >= now);
    } else if (activeTab === 'past') {
      const now = new Date();
      filtered = filtered.filter(event => new Date(event.endDate) < now);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }
    
    // Apply other filters
    if (filters.eventType) {
      filtered = filtered.filter(event => event.type === filters.eventType);
    }
    
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }
    
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7);
      const nextMonth = new Date(now);
      nextMonth.setMonth(now.getMonth() + 1);
      
      if (filters.dateRange === 'thisWeek') {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.startDate);
          return eventDate >= now && eventDate <= nextWeek;
        });
      } else if (filters.dateRange === 'thisMonth') {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.startDate);
          return eventDate >= now && eventDate <= nextMonth;
        });
      }
    }
    
    // Sort by date
    filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    setFilteredEvents(filtered);
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

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleRegister = () => {
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      await axios.post(`/api/events/${selectedEvent.id}/register`, registrationForm);
      setShowRegistrationModal(false);
      // Show success message or update UI
    } catch (err) {
      console.error('Error registering for event:', err);
    }
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'webinar':
        return <FiVideo />;
      case 'workshop':
        return <FiBookOpen />;
      default:
        return <FiCalendar />;
    }
  };

  const getEventTypeBadge = (type) => {
    switch (type) {
      case 'conference':
        return 'primary';
      case 'webinar':
        return 'info';
      case 'workshop':
        return 'success';
      case 'meeting':
        return 'secondary';
      default:
        return 'light';
    }
  };

  const renderEventDetails = () => (
    <Modal show={showEventDetails} onHide={() => setShowEventDetails(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedEvent?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedEvent && (
          <div>
            <div className="text-center mb-4">
              <Badge bg={getEventTypeBadge(selectedEvent.type)} className="mb-2">
                {getEventTypeIcon(selectedEvent.type)} {selectedEvent.type}
              </Badge>
              <h4>{selectedEvent.title}</h4>
              <p className="text-muted">{selectedEvent.category}</p>
            </div>
            
            <Row className="mb-4">
              <Col md={6}>
                <div className="d-flex align-items-center mb-3">
                  <FiCalendar className="me-2" />
                  <div>
                    <small className="text-muted">Date</small>
                    <div>{formatDate(selectedEvent.startDate)}</div>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="d-flex align-items-center mb-3">
                  <FiClock className="me-2" />
                  <div>
                    <small className="text-muted">Time</small>
                    <div>{formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}</div>
                  </div>
                </div>
              </Col>
            </Row>
            
            <div className="d-flex align-items-center mb-3">
              <FiMapPin className="me-2" />
              <div>
                <small className="text-muted">Location</small>
                <div>{selectedEvent.location}</div>
                {selectedEvent.isVirtual && (
                  <small className="text-info">Virtual Event</small>
                )}
              </div>
            </div>
            
            <div className="d-flex align-items-center mb-3">
              <FiUsers className="me-2" />
              <div>
                <small className="text-muted">Capacity</small>
                <div>{selectedEvent.capacity} attendees</div>
                <div>
                  <small>
                    {selectedEvent.registeredCount} registered
                  </small>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h6>Description</h6>
              <p>{selectedEvent.description}</p>
            </div>
            
            {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
              <div className="mb-4">
                <h6>Speakers</h6>
                <ListGroup>
                  {selectedEvent.speakers.map((speaker, index) => (
                    <ListGroup.Item key={index} className="d-flex align-items-center">
                      {speaker.avatar ? (
                        <img 
                          src={speaker.avatar} 
                          alt={speaker.name} 
                          className="rounded-circle me-2" 
                          style={{ width: '40px', height: '40px' }}
                        />
                      ) : (
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
                             style={{ width: '40px', height: '40px' }}>
                          <FiUser />
                        </div>
                      )}
                      <div>
                        <div>{speaker.name}</div>
                        <small className="text-muted">{speaker.title}</small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
            
            {selectedEvent.materials && (
              <div className="mb-4">
                <h6>Materials</h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedEvent.materials.map((material, index) => (
                    <Button 
                      key={index} 
                      variant="outline-secondary" 
                      size="sm"
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiDownload className="me-1" /> {material.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShowEventDetails(false)}>
          Close
        </Button>
        {activeTab === 'upcoming' && (
          <Button variant="primary" onClick={handleRegister}>
            Register
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );

  const renderRegistrationModal = () => (
    <Modal show={showRegistrationModal} onHide={() => setShowRegistrationModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Register for {selectedEvent?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleRegistrationSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={registrationForm.name}
              onChange={handleRegistrationChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={registrationForm.email}
              onChange={handleRegistrationChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Organization</Form.Label>
            <Form.Control
              type="text"
              name="organization"
              value={registrationForm.organization}
              onChange={handleRegistrationChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Dietary Restrictions</Form.Label>
            <Form.Control
              type="text"
              name="dietaryRestrictions"
              value={registrationForm.dietaryRestrictions}
              onChange={handleRegistrationChange}
              placeholder="Any dietary restrictions?"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Additional Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="additionalNotes"
              value={registrationForm.additionalNotes}
              onChange={handleRegistrationChange}
              placeholder="Any additional information?"
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="outline-secondary" className="me-2" onClick={() => setShowRegistrationModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Registration
            </Button>
          </div>
        </Form>
      </Modal.Body>
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
                <Form.Label>Event Type</Form.Label>
                <Form.Select 
                  name="eventType"
                  value={filters.eventType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="conference">Conference</option>
                  <option value="webinar">Webinar</option>
                  <option value="workshop">Workshop</option>
                  <option value="meeting">Meeting</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  <option value="professional">Professional Development</option>
                  <option value="networking">Networking</option>
                  <option value="education">Education</option>
                  <option value="policy">Policy</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Date Range</Form.Label>
                <Form.Select 
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Dates</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
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
        <p className="mt-3">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchEvents}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="event-calendar">
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Event Calendar</h4>
            <Button variant="outline-primary" size="sm">
              <FiPlus className="me-1" /> Add to Calendar
            </Button>
          </div>
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="upcoming" title="Upcoming Events" />
            <Tab eventKey="past" title="Past Events" />
            <Tab eventKey="all" title="All Events" />
          </Tabs>
          
          <div className="d-flex mb-4">
            <Form.Control
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="me-2"
            />
            <Button variant="outline-secondary">
              <FiSearch />
            </Button>
          </div>
          
          {renderFilters()}
          
          {filteredEvents.length > 0 ? (
            <Row>
              {filteredEvents.map(event => (
                <Col md={6} lg={4} key={event.id} className="mb-4">
                  <Card className="h-100 event-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Badge bg={getEventTypeBadge(event.type)}>
                          {getEventTypeIcon(event.type)} {event.type}
                        </Badge>
                        <small className="text-muted">
                          {formatDate(event.startDate)}
                        </small>
                      </div>
                      
                      <Card.Title>{event.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {event.category}
                      </Card.Subtitle>
                      
                      <div className="d-flex align-items-center mb-2">
                        <FiClock className="me-2" />
                        <small>{formatTime(event.startTime)} - {formatTime(event.endTime)}</small>
                      </div>
                      
                      <div className="d-flex align-items-center mb-3">
                        <FiMapPin className="me-2" />
                        <small>{event.location}</small>
                      </div>
                      
                      <p className="card-text event-description">
                        {event.description.substring(0, 100)}
                        {event.description.length > 100 ? '...' : ''}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                          <FiUsers className="me-1" />
                          <small>{event.registeredCount}/{event.capacity} registered</small>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewEvent(event)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <FiCalendar size={48} className="text-muted mb-3" />
              <h5>No events found</h5>
              <p className="text-muted">
                No events match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {renderEventDetails()}
      {renderRegistrationModal()}
    </div>
  );
};

export default EventCalendar; 