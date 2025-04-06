import React from 'react';
import { Button } from 'react-bootstrap';
import { Card, ProgressBar, Badge } from 'react-bootstrap';

const ProjectCard = ({ project }) => {
  return (
    <Card className="project-card h-100">
      <Card.Img variant="top" src={project.image || '/images/project-placeholder.jpg'} />
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title>{project.name}</Card.Title>
          <Badge pill variant={project.status === 'Active' ? 'success' : 'secondary'}>
            {project.status}
          </Badge>
        </div>
        <Card.Text className="text-muted small">
          {project.countries.join(', ')}
        </Card.Text>
        <div className="mb-3">
          <small className="text-muted">Progress</small>
          <ProgressBar 
            now={project.progress} 
            label={`${project.progress}%`} 
            variant={project.progress > 70 ? 'success' : project.progress > 30 ? 'warning' : 'danger'}
          />
        </div>
        <div className="d-flex justify-content-between">
          <small className="text-muted">Budget: ${project.budget.toLocaleString()}</small>
          <Button variant="outline-primary" size="sm">
            Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;