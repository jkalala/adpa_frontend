import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ status }) => {
  const variantMap = {
    'Active': 'success',
    'Observer': 'info',
    'Pending': 'warning',
    'Inactive': 'secondary'
  };

  return (
    <Badge pill variant={variantMap[status] || 'primary'}>
      {status}
    </Badge>
  );
};

export default StatusBadge;