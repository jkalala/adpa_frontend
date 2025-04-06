import React from 'react';
import { Table, Badge, ProgressBar } from 'react-bootstrap';
import ProjectCard from './components/ProjectCard';

const ProjectsTable = ({ projects = [] }) => {
  const statusVariant = {
    'Active': 'success',
    'Planning': 'warning',
    'Completed': 'primary',
    'On Hold': 'secondary'
  };

  return (
    <div className="projects-table">
      <div className="project-card-view mb-4">
        <h5>Featured Projects</h5>
        <div className="project-card-container">
          {projects.slice(0, 3).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Countries</th>
            <th>Status</th>
            <th>Budget</th>
            <th>Progress</th>
            <th>Timeline</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.countries.join(', ')}</td>
              <td>
                <Badge pill variant={statusVariant[project.status]}>
                  {project.status}
                </Badge>
              </td>
              <td>${project.budget.toLocaleString()}</td>
              <td>
                <ProgressBar 
                  now={project.progress} 
                  label={`${project.progress}%`} 
                  variant={project.progress > 70 ? 'success' : project.progress > 30 ? 'warning' : 'danger'}
                />
              </td>
              <td>{project.startDate} - {project.endDate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProjectsTable;