import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventDetails } from '../services/api';

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvent = async () => {
      try {
        const data = await fetchEventDetails(id);
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };
    getEvent();
  }, [id]);

  if (loading) return <div className="loading">Loading event details...</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="event-detail">
      <div className="event-header">
        <img src={event.image_url} alt={event.title} className="event-banner" />
        <h1>{event.title}</h1>
        <p className="event-meta">
          <span>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</span>
          <span>{event.location}</span>
        </p>
      </div>
      
      <div className="event-tabs">
        <Link to={`/events/${id}`} className="active">Overview</Link>
        <Link to={`/agenda/${id}`}>Agenda</Link>
        <Link to={`/networking/${id}`}>Networking</Link>
        <Link to={`/documents/${id}`}>Documents</Link>
        <Link to={`/surveys/${id}`}>Surveys</Link>
      </div>
      
      <div className="event-content">
        <div className="event-description">
          <h2>About the Event</h2>
          <p>{event.description}</p>
        </div>
        
        <div className="event-details">
          <div className="detail-section">
            <h3>Venue</h3>
            <p>{event.venue_name}</p>
            <p>{event.venue_address}</p>
          </div>
          
          <div className="detail-section">
            <h3>Registration</h3>
            <p>Status: {event.registration_open ? 'Open' : 'Closed'}</p>
            <Link to={`/register/${id}`} className="btn-register">Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;