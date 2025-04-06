import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FiTrendingUp, FiDollarSign, FiGlobe, FiUsers } from 'react-icons/fi';
import InteractiveChart from './components/InteractiveChart';

const DashboardMetrics = ({ data }) => {
  return (
    <div className="dashboard-metrics">
      <h4 className="mb-4">ADPA Overview</h4>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon bg-primary-light">
                <FiUsers className="text-primary" />
              </div>
              <h5>Member States</h5>
              <p className="metric-value">{data?.memberCount || 0}</p>
              <p className="metric-change positive">+2 this year</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon bg-success-light">
                <FiDollarSign className="text-success" />
              </div>
              <h5>Annual Budget</h5>
              <p className="metric-value">${data?.annualBudget?.toLocaleString() || '0'}</p>
              <p className="metric-change positive">12% increase</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon bg-warning-light">
                <FiGlobe className="text-warning" />
              </div>
              <h5>Active Projects</h5>
              <p className="metric-value">{data?.activeProjects || 0}</p>
              <p className="metric-change positive">5 new</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon bg-info-light">
                <FiTrendingUp className="text-info" />
              </div>
              <h5>Compliance Rate</h5>
              <p className="metric-value">{data?.complianceRate || 0}%</p>
              <p className="metric-change negative">-3% from last year</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Membership Growth</h5>
            </Card.Header>
            <Card.Body>
              <InteractiveChart 
                data={data?.growthChartData || []}
                type="line"
                height={300}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Recent Activities</h5>
            </Card.Header>
            <Card.Body className="activity-feed">
              {data?.recentActivities?.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div>
                    <p className="activity-text">{activity.text}</p>
                    <small className="text-muted">{activity.date}</small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardMetrics;