import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Badge, Modal, Form, 
  Spinner, Alert, Tabs, Tab, ListGroup, InputGroup
} from 'react-bootstrap';
import { 
  FiFile, FiFolder, FiDownload, FiSearch, FiFilter,
  FiBook, FiFileText, FiVideo, FiLink, FiExternalLink,
  FiStar, FiShare2, FiBookmark
} from 'react-icons/fi';
import axios from 'axios';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    resourceType: '',
    category: '',
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showResourceDetails, setShowResourceDetails] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchResources();
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    filterResources();
  }, [searchTerm, filters, resources, activeTab]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get('/api/resources');
      setResources(response.data);
      setFilteredResources(response.data);
    } catch (err) {
      setError('Failed to load resources. Please try again later.');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('/api/resource-categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchTags = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('/api/resource-tags');
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];
    
    // Filter by tab (all, documents, articles, videos, links)
    if (activeTab !== 'all') {
      filtered = filtered.filter(resource => resource.type === activeTab);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term) ||
        resource.author.toLowerCase().includes(term)
      );
    }
    
    // Apply other filters
    if (filters.resourceType) {
      filtered = filtered.filter(resource => resource.type === filters.resourceType);
    }
    
    if (filters.category) {
      filtered = filtered.filter(resource => resource.category === filters.category);
    }
    
    if (filters.tags.length > 0) {
      filtered = filtered.filter(resource => 
        resource.tags.some(tag => filters.tags.includes(tag))
      );
    }
    
    setFilteredResources(filtered);
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

  const handleTagToggle = (tag) => {
    setFilters(prev => {
      const updatedTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      
      return {
        ...prev,
        tags: updatedTags
      };
    });
  };

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setShowResourceDetails(true);
  };

  const handleDownload = async (resourceId) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/resources/${resourceId}/download`, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', selectedResource.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading resource:', err);
    }
  };

  const handleBookmark = async (resourceId) => {
    try {
      // Replace with your actual API endpoint
      await axios.post(`/api/resources/${resourceId}/bookmark`);
      // Update UI to show bookmarked state
    } catch (err) {
      console.error('Error bookmarking resource:', err);
    }
  };

  const handleShare = async (resourceId) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`/api/resources/${resourceId}/share`);
      // Show share link or copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(response.data.shareUrl);
        // Show success message
      }
    } catch (err) {
      console.error('Error sharing resource:', err);
    }
  };

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'document':
        return <FiFileText />;
      case 'article':
        return <FiBook />;
      case 'video':
        return <FiVideo />;
      case 'link':
        return <FiLink />;
      default:
        return <FiFile />;
    }
  };

  const getResourceTypeBadge = (type) => {
    switch (type) {
      case 'document':
        return 'primary';
      case 'article':
        return 'success';
      case 'video':
        return 'info';
      case 'link':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderResourceDetails = () => (
    <Modal show={showResourceDetails} onHide={() => setShowResourceDetails(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedResource?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedResource && (
          <div>
            <div className="text-center mb-4">
              <Badge bg={getResourceTypeBadge(selectedResource.type)} className="mb-2">
                {getResourceTypeIcon(selectedResource.type)} {selectedResource.type}
              </Badge>
              <h4>{selectedResource.title}</h4>
              <p className="text-muted">By {selectedResource.author}</p>
            </div>
            
            <Row className="mb-4">
              <Col md={6}>
                <div className="d-flex align-items-center mb-3">
                  <FiFile className="me-2" />
                  <div>
                    <small className="text-muted">Category</small>
                    <div>{selectedResource.category}</div>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="d-flex align-items-center mb-3">
                  <FiFile className="me-2" />
                  <div>
                    <small className="text-muted">Published</small>
                    <div>{formatDate(selectedResource.publishedDate)}</div>
                  </div>
                </div>
              </Col>
            </Row>
            
            <div className="mb-4">
              <h6>Description</h6>
              <p>{selectedResource.description}</p>
            </div>
            
            {selectedResource.tags && selectedResource.tags.length > 0 && (
              <div className="mb-4">
                <h6>Tags</h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedResource.tags.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {selectedResource.type === 'link' && (
              <div className="mb-4">
                <h6>External Link</h6>
                <Button 
                  variant="outline-primary" 
                  href={selectedResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiExternalLink className="me-1" /> Visit Resource
                </Button>
              </div>
            )}
            
            {selectedResource.type === 'video' && (
              <div className="mb-4">
                <h6>Video</h6>
                <div className="ratio ratio-16x9">
                  <iframe 
                    src={selectedResource.embedUrl} 
                    title={selectedResource.title}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            
            {selectedResource.relatedResources && selectedResource.relatedResources.length > 0 && (
              <div className="mb-4">
                <h6>Related Resources</h6>
                <ListGroup>
                  {selectedResource.relatedResources.map((resource, index) => (
                    <ListGroup.Item 
                      key={index} 
                      action
                      onClick={() => {
                        setSelectedResource(resource);
                        // Keep modal open but update content
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-2">
                          {getResourceTypeIcon(resource.type)}
                        </div>
                        <div>
                          <div>{resource.title}</div>
                          <small className="text-muted">{resource.type}</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShowResourceDetails(false)}>
          Close
        </Button>
        {selectedResource?.type !== 'link' && (
          <Button 
            variant="outline-primary" 
            onClick={() => handleDownload(selectedResource?.id)}
          >
            <FiDownload className="me-1" /> Download
          </Button>
        )}
        <Button 
          variant="outline-primary" 
          onClick={() => handleBookmark(selectedResource?.id)}
        >
          <FiBookmark className="me-1" /> Bookmark
        </Button>
        <Button 
          variant="outline-primary" 
          onClick={() => handleShare(selectedResource?.id)}
        >
          <FiShare2 className="me-1" /> Share
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Resource Type</Form.Label>
                <Form.Select 
                  name="resourceType"
                  value={filters.resourceType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="document">Documents</option>
                  <option value="article">Articles</option>
                  <option value="video">Videos</option>
                  <option value="link">Links</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        )}
        
        <div className="mb-3">
          <Form.Label>Tags</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge 
                key={tag.id}
                bg={filters.tags.includes(tag.id) ? 'primary' : 'light'}
                text={filters.tags.includes(tag.id) ? 'light' : 'dark'}
                style={{ cursor: 'pointer' }}
                onClick={() => handleTagToggle(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchResources}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="resource-library">
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Resource Library</h4>
            <Button variant="outline-primary" size="sm">
              <FiFile className="me-1" /> Upload Resource
            </Button>
          </div>
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="all" title="All Resources" />
            <Tab eventKey="document" title="Documents" />
            <Tab eventKey="article" title="Articles" />
            <Tab eventKey="video" title="Videos" />
            <Tab eventKey="link" title="Links" />
          </Tabs>
          
          <InputGroup className="mb-4">
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search resources..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
          
          {renderFilters()}
          
          {filteredResources.length > 0 ? (
            <Row>
              {filteredResources.map(resource => (
                <Col md={6} lg={4} key={resource.id} className="mb-4">
                  <Card className="h-100 resource-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Badge bg={getResourceTypeBadge(resource.type)}>
                          {getResourceTypeIcon(resource.type)} {resource.type}
                        </Badge>
                        <small className="text-muted">
                          {formatDate(resource.publishedDate)}
                        </small>
                      </div>
                      
                      <Card.Title>{resource.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        By {resource.author}
                      </Card.Subtitle>
                      
                      <p className="card-text resource-description">
                        {resource.description.substring(0, 100)}
                        {resource.description.length > 100 ? '...' : ''}
                      </p>
                      
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} bg="light" text="dark">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge bg="light" text="dark">
                            +{resource.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                          <small className="text-muted">
                            {resource.downloads} downloads
                          </small>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewResource(resource)}
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
              <FiFolder size={48} className="text-muted mb-3" />
              <h5>No resources found</h5>
              <p className="text-muted">
                No resources match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {renderResourceDetails()}
    </div>
  );
};

export default ResourceLibrary;