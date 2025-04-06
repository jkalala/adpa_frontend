import React from 'react';
import { Card } from 'react-bootstrap';

const DataCard = ({ title, value, change, icon, variant = 'primary' }) => {
  const variantClass = `bg-${variant}-light text-${variant}`;
  
  return (
    <Card className="data-card">
      <Card.Body className="d-flex align-items-center">
        <div className={`icon-container ${variantClass}`}>
          {icon}
        </div>
        <div className="ml-3">
          <h6 className="card-title mb-0">{title}</h6>
          <div className="d-flex align-items-end">
            <h4 className="mb-0 mr-2">{value}</h4>
            <small className={`change-indicator ${change >= 0 ? 'text-success' : 'text-danger'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DataCard;