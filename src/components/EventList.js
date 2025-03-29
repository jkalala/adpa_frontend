import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/api';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="event-list">
      <h1>Upcoming ADPA Events</h1>
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <img src={event.image_url} alt={event.title} />
            <div className="event-info">
              <h2>{event.title}</h2>
              <p className="date">{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>
              <p className="location">{event.location}</p>
              <div className="event-actions">
                <Link to={`/events/${event.id}`} className="btn-details">View Details</Link>
                <Link to={`/register/${event.id}`} className="btn-register">Register</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;