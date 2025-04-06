import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Badge, Modal, Form, 
  Spinner, Alert, Tabs, Tab, ListGroup, InputGroup,
  Pagination
} from 'react-bootstrap';
import { 
  FiMessageSquare, FiSearch, FiFilter, FiPlus, 
  FiThumbsUp, FiMessageCircle, FiEye, FiClock,
  FiUser, FiTag, FiEdit, FiTrash2, FiFlag
} from 'react-icons/fi';
import axios from 'axios';

const DiscussionForums = () => {
  const [forums, setForums] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    forum: '',
    sortBy: 'latest',
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showTopicDetails, setShowTopicDetails] = useState(false);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [showNewReplyModal, setShowNewReplyModal] = useState(false);
  const [newTopicForm, setNewTopicForm] = useState({
    title: '',
    content: '',
    forum: '',
    tags: []
  });
  const [newReplyForm, setNewReplyForm] = useState({
    content: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [topicsPerPage] = useState(10);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchForums();
    fetchTopics();
    fetchTags();
  }, []);

  useEffect(() => {
    filterTopics();
  }, [searchTerm, filters, topics, activeTab]);

  const fetchForums = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('/api/forums');
      setForums(response.data);
    } catch (err) {
      console.error('Error fetching forums:', err);
    }
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get('/api/topics');
      setTopics(response.data);
      setFilteredTopics(response.data);
    } catch (err) {
      setError('Failed to load discussion topics. Please try again later.');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('/api/topic-tags');
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const filterTopics = () => {
    let filtered = [...topics];
    
    // Filter by tab (all, my topics, bookmarked)
    if (activeTab === 'myTopics') {
      // Replace with actual user ID
      const userId = 'current-user-id';
      filtered = filtered.filter(topic => topic.authorId === userId);
    } else if (activeTab === 'bookmarked') {
      // Replace with actual user ID
      const userId = 'current-user-id';
      filtered = filtered.filter(topic => topic.bookmarkedBy.includes(userId));
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(term) ||
        topic.content.toLowerCase().includes(term)
      );
    }
    
    // Apply other filters
    if (filters.forum) {
      filtered = filtered.filter(topic => topic.forumId === filters.forum);
    }
    
    if (filters.tags.length > 0) {
      filtered = filtered.filter(topic => 
        topic.tags.some(tag => filters.tags.includes(tag))
      );
    }
    
    // Sort topics
    if (filters.sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => b.replyCount - a.replyCount);
    } else if (filters.sortBy === 'unanswered') {
      filtered.sort((a, b) => a.replyCount - b.replyCount);
    }
    
    setFilteredTopics(filtered);
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

  const handleViewTopic = (topic) => {
    setSelectedTopic(topic);
    setShowTopicDetails(true);
  };

  const handleNewTopicChange = (e) => {
    const { name, value } = e.target;
    setNewTopicForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewReplyChange = (e) => {
    const { name, value } = e.target;
    setNewReplyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewTopicSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      await axios.post('/api/topics', newTopicForm);
      setShowNewTopicModal(false);
      setNewTopicForm({
        title: '',
        content: '',
        forum: '',
        tags: []
      });
      fetchTopics(); // Refresh topics
    } catch (err) {
      console.error('Error creating new topic:', err);
    }
  };

  const handleNewReplySubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      await axios.post(`/api/topics/${selectedTopic.id}/replies`, newReplyForm);
      setShowNewReplyModal(false);
      setNewReplyForm({
        content: ''
      });
      // Refresh topic details
      const response = await axios.get(`/api/topics/${selectedTopic.id}`);
      setSelectedTopic(response.data);
    } catch (err) {
      console.error('Error creating new reply:', err);
    }
  };

  const handleLikeTopic = async (topicId) => {
    try {
      // Replace with your actual API endpoint
      await axios.post(`/api/topics/${topicId}/like`);
      // Update UI to show liked state
    } catch (err) {
      console.error('Error liking topic:', err);
    }
  };

  const handleBookmarkTopic = async (topicId) => {
    try {
      // Replace with your actual API endpoint
      await axios.post(`/api/topics/${topicId}/bookmark`);
      // Update UI to show bookmarked state
    } catch (err) {
      console.error('Error bookmarking topic:', err);
    }
  };

  const handleReportTopic = async (topicId) => {
    try {
      // Replace with your actual API endpoint
      await axios.post(`/api/topics/${topicId}/report`);
      // Show success message
    } catch (err) {
      console.error('Error reporting topic:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  const renderNewTopicModal = () => (
    <Modal show={showNewTopicModal} onHide={() => setShowNewTopicModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Topic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleNewTopicSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={newTopicForm.title}
              onChange={handleNewTopicChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Forum</Form.Label>
            <Form.Select 
              name="forum"
              value={newTopicForm.forum}
              onChange={handleNewTopicChange}
              required
            >
              <option value="">Select a forum</option>
              {forums.map(forum => (
                <option key={forum.id} value={forum.id}>
                  {forum.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={newTopicForm.content}
              onChange={handleNewTopicChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge 
                  key={tag.id}
                  bg={newTopicForm.tags.includes(tag.id) ? 'primary' : 'light'}
                  text={newTopicForm.tags.includes(tag.id) ? 'light' : 'dark'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setNewTopicForm(prev => {
                      const updatedTags = prev.tags.includes(tag.id)
                        ? prev.tags.filter(t => t !== tag.id)
                        : [...prev.tags, tag.id];
                      
                      return {
                        ...prev,
                        tags: updatedTags
                      };
                    });
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="outline-secondary" className="me-2" onClick={() => setShowNewTopicModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Topic
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );

  const renderNewReplyModal = () => (
    <Modal show={showNewReplyModal} onHide={() => setShowNewReplyModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Reply to Topic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleNewReplySubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Your Reply</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="content"
              value={newReplyForm.content}
              onChange={handleNewReplyChange}
              required
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="outline-secondary" className="me-2" onClick={() => setShowNewReplyModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Reply
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );

  const renderTopicDetails = () => (
    <Modal show={showTopicDetails} onHide={() => setShowTopicDetails(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedTopic?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedTopic && (
          <div>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <Badge bg="primary" className="mb-2">
                  {forums.find(f => f.id === selectedTopic.forumId)?.name || 'Forum'}
                </Badge>
                <h4>{selectedTopic.title}</h4>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    {selectedTopic.authorAvatar ? (
                      <img 
                        src={selectedTopic.authorAvatar} 
                        alt={selectedTopic.authorName} 
                        className="rounded-circle" 
                        style={{ width: '30px', height: '30px' }}
                      />
                    ) : (
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                           style={{ width: '30px', height: '30px' }}>
                        <FiUser />
                      </div>
                    )}
                  </div>
                  <div>
                    <div>{selectedTopic.authorName}</div>
                    <small className="text-muted">
                      Posted {formatTimeAgo(selectedTopic.createdAt)}
                    </small>
                  </div>
                </div>
              </div>
              <div>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  className="me-2"
                  onClick={() => handleLikeTopic(selectedTopic.id)}
                >
                  <FiThumbsUp className="me-1" /> {selectedTopic.likes}
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  className="me-2"
                  onClick={() => handleBookmarkTopic(selectedTopic.id)}
                >
                  <FiTag />
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleReportTopic(selectedTopic.id)}
                >
                  <FiFlag />
                </Button>
              </div>
            </div>
            
            <div className="topic-content mb-4">
              <p>{selectedTopic.content}</p>
            </div>
            
            {selectedTopic.tags && selectedTopic.tags.length > 0 && (
              <div className="mb-4">
                <h6>Tags</h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedTopic.tags.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <h5>Replies ({selectedTopic.replies?.length || 0})</h5>
              
              {selectedTopic.replies && selectedTopic.replies.length > 0 ? (
                <ListGroup className="mb-3">
                  {selectedTopic.replies.map((reply, index) => (
                    <ListGroup.Item key={index} className="reply-item">
                      <div className="d-flex">
                        <div className="me-3">
                          {reply.authorAvatar ? (
                            <img 
                              src={reply.authorAvatar} 
                              alt={reply.authorName} 
                              className="rounded-circle" 
                              style={{ width: '40px', height: '40px' }}
                            />
                          ) : (
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                                 style={{ width: '40px', height: '40px' }}>
                              <FiUser />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="fw-bold">{reply.authorName}</div>
                              <small className="text-muted">
                                {formatTimeAgo(reply.createdAt)}
                              </small>
                            </div>
                            <div>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="me-2"
                                onClick={() => handleLikeTopic(reply.id)}
                              >
                                <FiThumbsUp className="me-1" /> {reply.likes}
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleReportTopic(reply.id)}
                              >
                                <FiFlag />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            {reply.content}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted">No replies yet. Be the first to reply!</p>
                </div>
              )}
              
              <Button 
                variant="primary" 
                onClick={() => setShowNewReplyModal(true)}
              >
                <FiMessageCircle className="me-1" /> Post Reply
              </Button>
            </div>
          </div>
        )}
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Forum</Form.Label>
                <Form.Select 
                  name="forum"
                  value={filters.forum}
                  onChange={handleFilterChange}
                >
                  <option value="">All Forums</option>
                  {forums.map(forum => (
                    <option key={forum.id} value={forum.id}>
                      {forum.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sort By</Form.Label>
                <Form.Select 
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="unanswered">Unanswered</option>
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

  // Pagination
  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = filteredTopics.slice(indexOfFirstTopic, indexOfLastTopic);
  const totalPages = Math.ceil(filteredTopics.length / topicsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading discussions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchTopics}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="discussion-forums">
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Discussion Forums</h4>
            <Button 
              variant="primary" 
              onClick={() => setShowNewTopicModal(true)}
            >
              <FiPlus className="me-1" /> New Topic
            </Button>
          </div>
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="all" title="All Topics" />
            <Tab eventKey="myTopics" title="My Topics" />
            <Tab eventKey="bookmarked" title="Bookmarked" />
          </Tabs>
          
          <InputGroup className="mb-4">
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search topics..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
          
          {renderFilters()}
          
          {currentTopics.length > 0 ? (
            <>
              <ListGroup className="mb-4">
                {currentTopics.map(topic => (
                  <ListGroup.Item 
                    key={topic.id} 
                    action
                    onClick={() => handleViewTopic(topic)}
                    className="topic-item"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{topic.title}</h5>
                        <div className="d-flex align-items-center mb-2">
                          <Badge bg="primary" className="me-2">
                            {forums.find(f => f.id === topic.forumId)?.name || 'Forum'}
                          </Badge>
                          <small className="text-muted">
                            Posted by {topic.authorName} {formatTimeAgo(topic.createdAt)}
                          </small>
                        </div>
                        <p className="mb-0 topic-preview">
                          {topic.content.substring(0, 150)}
                          {topic.content.length > 150 ? '...' : ''}
                        </p>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-3">
                            <FiEye className="me-1" />
                            <small>{topic.views}</small>
                          </div>
                          <div className="me-3">
                            <FiMessageCircle className="me-1" />
                            <small>{topic.replyCount}</small>
                          </div>
                          <div>
                            <FiThumbsUp className="me-1" />
                            <small>{topic.likes}</small>
                          </div>
                        </div>
                        {topic.tags && topic.tags.length > 0 && (
                          <div className="d-flex flex-wrap gap-1">
                            {topic.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} bg="light" text="dark">
                                {tag}
                              </Badge>
                            ))}
                            {topic.tags.length > 2 && (
                              <Badge bg="light" text="dark">
                                +{topic.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                    
                    {[...Array(totalPages)].map((_, i) => {
                      // Show first page, last page, current page, and pages around current page
                      if (
                        i === 0 || 
                        i === totalPages - 1 || 
                        (i >= currentPage - 2 && i <= currentPage + 2)
                      ) {
                        return (
                          <Pagination.Item 
                            key={i + 1} 
                            active={currentPage === i + 1}
                            onClick={() => paginate(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        );
                      } else if (
                        (i === 1 && currentPage > 4) || 
                        (i === totalPages - 2 && currentPage < totalPages - 3)
                      ) {
                        return <Pagination.Ellipsis key={i + 1} />;
                      }
                      return null;
                    })}
                    
                    <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <FiMessageSquare size={48} className="text-muted mb-3" />
              <h5>No topics found</h5>
              <p className="text-muted">
                No topics match your current filters. Try adjusting your search criteria.
              </p>
              <Button 
                variant="primary" 
                onClick={() => setShowNewTopicModal(true)}
              >
                <FiPlus className="me-1" /> Create New Topic
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {renderTopicDetails()}
      {renderNewTopicModal()}
      {renderNewReplyModal()}
    </div>
  );
};

export default DiscussionForums;