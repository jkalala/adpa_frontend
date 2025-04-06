import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, 
  ListGroup, Alert, Spinner, Form, Modal,
  Dropdown, Nav, Tabs, Tab
} from 'react-bootstrap';
import { 
  FiUser, FiSettings, FiBell, FiHelpCircle, 
  FiLogOut, FiLock, FiMail, FiGlobe, FiShield,
  FiEdit, FiSave, FiX, FiCheck, FiAlertCircle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MemberMenu = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editedProfile, setEditedProfile] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    newsletter: true,
    updates: true,
    events: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  // API configuration
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    timeout: 10000,
  });

  useEffect(() => {
    // Authentication interceptor
    const requestInterceptor = api.interceptors.request.use(config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/user/profile');
        setUserData(response.data);
        setEditedProfile(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call for updating profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user data with edited profile
      setUserData(editedProfile);
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowProfileModal(false);
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    try {
      // Simulate API call for changing password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 2000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password. Please try again.');
    }
  };

  const handleNotificationSave = async () => {
    try {
      // Simulate API call for updating notification settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowNotificationModal(false);
      }, 2000);
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError('Failed to update notification settings. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/login', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading user information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <FiAlertCircle className="me-2" />
        {error}
      </Alert>
    );
  }

  return (
    <Container fluid className="p-0">
      <Row>
        <Col lg={4} className="mb-4">
          {/* User Profile Card */}
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <div className="user-avatar mb-3">
                {userData?.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt="User Avatar" 
                    className="rounded-circle"
                    width="100"
                    height="100"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <FiUser size={40} />
                  </div>
                )}
              </div>
              <h4>{userData?.firstName} {userData?.lastName}</h4>
              <p className="text-muted">{userData?.email}</p>
              <p className="text-muted mb-3">{userData?.role || 'Member'}</p>
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => setShowProfileModal(true)}
              >
                <FiEdit className="me-2" />
                Edit Profile
              </Button>
            </Card.Body>
          </Card>

          {/* Quick Links */}
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Quick Links</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item 
                action 
                onClick={() => navigate('/member-only?tab=directory')}
                className="d-flex align-items-center"
              >
                <FiUser className="me-2" />
                Member Directory
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                onClick={() => navigate('/member-only?tab=calendar')}
                className="d-flex align-items-center"
              >
                <FiGlobe className="me-2" />
                Event Calendar
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                onClick={() => navigate('/member-only?tab=resources')}
                className="d-flex align-items-center"
              >
                <FiMail className="me-2" />
                Resource Library
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                onClick={() => navigate('/member-only?tab=forums')}
                className="d-flex align-items-center"
              >
                <FiHelpCircle className="me-2" />
                Discussion Forums
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                onClick={() => navigate('/member-only?tab=membership')}
                className="d-flex align-items-center"
              >
                <FiShield className="me-2" />
                My Membership
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                onClick={() => navigate('/member-only?tab=payments')}
                className="d-flex align-items-center"
              >
                <FiSettings className="me-2" />
                Payment Processing
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col lg={8}>
          {/* Account Settings */}
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">Account Settings</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Email Notifications</h6>
                    <small className="text-muted">Receive email notifications about updates and events</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="email-notifications" 
                    checked={notificationSettings.email}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      email: e.target.checked
                    })}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">SMS Notifications</h6>
                    <small className="text-muted">Receive SMS notifications about important updates</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="sms-notifications" 
                    checked={notificationSettings.sms}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      sms: e.target.checked
                    })}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Newsletter Subscription</h6>
                    <small className="text-muted">Receive our monthly newsletter</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="newsletter-subscription" 
                    checked={notificationSettings.newsletter}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      newsletter: e.target.checked
                    })}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Event Reminders</h6>
                    <small className="text-muted">Receive reminders about upcoming events</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="event-reminders" 
                    checked={notificationSettings.events}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      events: e.target.checked
                    })}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Security Updates</h6>
                    <small className="text-muted">Receive notifications about security updates</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="security-updates" 
                    checked={notificationSettings.updates}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      updates: e.target.checked
                    })}
                  />
                </ListGroup.Item>
              </ListGroup>
              <div className="d-flex justify-content-end mt-3">
                <Button 
                  variant="primary"
                  onClick={() => setShowNotificationModal(true)}
                >
                  <FiSave className="me-2" />
                  Save Settings
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Security Settings</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Change Password</h6>
                    <small className="text-muted">Update your account password</small>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Two-Factor Authentication</h6>
                    <small className="text-muted">Add an extra layer of security to your account</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="two-factor-auth" 
                    checked={userData?.twoFactorEnabled || false}
                    onChange={(e) => {
                      // Simulate enabling/disabling 2FA
                      setUserData({
                        ...userData,
                        twoFactorEnabled: e.target.checked
                      });
                    }}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Login History</h6>
                    <small className="text-muted">View your recent login activity</small>
                  </div>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                  >
                    View
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Connected Devices</h6>
                    <small className="text-muted">Manage devices connected to your account</small>
                  </div>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                  >
                    Manage
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Profile Edit Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saveSuccess ? (
            <div className="text-center p-4">
              <FiCheck size={48} className="text-success mb-3" />
              <h4>Profile Updated!</h4>
              <p>Your profile has been updated successfully.</p>
            </div>
          ) : (
            <Form onSubmit={handleProfileSave}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedProfile?.firstName || ''}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        firstName: e.target.value
                      })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedProfile?.lastName || ''}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        lastName: e.target.value
                      })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editedProfile?.email || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    email: e.target.value
                  })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={editedProfile?.phone || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    phone: e.target.value
                  })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editedProfile?.bio || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    bio: e.target.value
                  })}
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Password Change Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saveSuccess ? (
            <div className="text-center p-4">
              <FiCheck size={48} className="text-success mb-3" />
              <h4>Password Changed!</h4>
              <p>Your password has been updated successfully.</p>
            </div>
          ) : (
            <Form onSubmit={handlePasswordChange}>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })}
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Password
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saveSuccess ? (
            <div className="text-center p-4">
              <FiCheck size={48} className="text-success mb-3" />
              <h4>Settings Saved!</h4>
              <p>Your notification settings have been updated successfully.</p>
            </div>
          ) : (
            <div>
              <p className="mb-3">Manage how you receive notifications from ADPA.</p>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Email Notifications</h6>
                    <small className="text-muted">Receive email notifications about updates and events</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="modal-email-notifications" 
                    checked={notificationSettings.email}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      email: e.target.checked
                    })}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">SMS Notifications</h6>
                    <small className="text-muted">Receive SMS notifications about important updates</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="modal-sms-notifications" 
                    checked={notificationSettings.sms}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      sms: e.target.checked
                    })}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Newsletter Subscription</h6>
                    <small className="text-muted">Receive our monthly newsletter</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="modal-newsletter-subscription" 
                    checked={notificationSettings.newsletter}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      newsletter: e.target.checked
                    })}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Event Reminders</h6>
                    <small className="text-muted">Receive reminders about upcoming events</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="modal-event-reminders" 
                    checked={notificationSettings.events}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      events: e.target.checked
                    })}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Security Updates</h6>
                    <small className="text-muted">Receive notifications about security updates</small>
                  </div>
                  <Form.Check 
                    type="switch" 
                    id="modal-security-updates" 
                    checked={notificationSettings.updates}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      updates: e.target.checked
                    })}
                  />
                </ListGroup.Item>
              </ListGroup>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="secondary" className="me-2" onClick={() => setShowNotificationModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleNotificationSave}>
                  Save Settings
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MemberMenu; 