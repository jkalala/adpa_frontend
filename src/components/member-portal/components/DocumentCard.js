import React from 'react';
import { Card } from 'react-bootstrap';
import { FiFile } from 'react-icons/fi';

const DocumentCard = ({ document }) => {
  return (
    <Card className="document-card">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="icon-container bg-primary-light text-primary">
            <FiFile />
          </div>
          <div className="ml-3">
            <h6 className="card-title mb-1">{document.title}</h6>
            <div className="text-muted small">
              <span className="mr-2">Type: {document.type}</span>
              <span>Size: {document.size}</span>
            </div>
            <div className="text-muted small mt-1">
              {document.date}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DocumentCard;