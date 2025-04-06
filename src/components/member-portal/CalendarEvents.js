import React from 'react';
import { Button } from 'react-bootstrap';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

const CalendarEvents = () => {
  const events = [
    { 
      id: 1, 
      title: 'Annual General Meeting', 
      date: '2023-06-15', 
      time: '09:00 - 12:00 GMT', 
      location: 'Virtual (Zoom)', 
      type: 'meeting' 
    },
    { 
      id: 2, 
      title: 'Regional Workshop: Pacific', 
      date: '2023-07-05', 
      time: '14:00 - 17:00 GMT', 
      location: 'Fiji', 
      type: 'workshop' 
    },
    { 
      id: 3, 
      title: 'Project Deadline: Phase 1', 
      date: '2023-08-20', 
      time: '23:59 GMT', 
      location: '', 
      type: 'deadline' 
    },
  ];

  const eventTypeVariant = {
    'meeting': 'primary',
    'workshop': 'success',
    'deadline': 'warning'
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Upcoming Events</h5>
        <Button variant="outline-primary" size="sm">
          View Full Calendar
        </Button>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {events.map(event => (
            <ListGroup.Item key={event.id} className="event-item">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="mb-1">
                    <Badge 
                      pill 
                      variant={eventTypeVariant[event.type]} 
                      className="mr-2"
                    >
                      {event.type}
                    </Badge>
                    {event.title}
                  </h6>
                  <small className="text-muted d-block mb-1">
                    <FiCalendar className="mr-1" />
                    {event.date}
                  </small>
                  {event.time && (
                    <small className="text-muted d-block mb-1">
                      <FiClock className="mr-1" />
                      {event.time}
                    </small>
                  )}
                  {event.location && (
                    <small className="text-muted d-block">
                      <FiMapPin className="mr-1" />
                      {event.location}
                    </small>
                  )}
                </div>
                <Button variant="outline-secondary" size="sm">
                  RSVP
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default CalendarEvents;