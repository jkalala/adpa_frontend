const API_BASE_URL = 'http://localhost:8000/api';

export const fetchEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/events/`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return await response.json();
};

export const fetchEventDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/events/${id}/`);
  if (!response.ok) throw new Error('Failed to fetch event details');
  return await response.json();
};

export const registerForEvent = async (eventId, formData) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error('Registration failed');
  return await response.json();
};

export const fetchAgenda = async (eventId) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/agenda/`);
  if (!response.ok) throw new Error('Failed to fetch agenda');
  return await response.json();
};

export const fetchAttendees = async (eventId) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendees/`);
  if (!response.ok) throw new Error('Failed to fetch attendees');
  return await response.json();
};

export const fetchDocuments = async (eventId) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/documents/`);
  if (!response.ok) throw new Error('Failed to fetch documents');
  return await response.json();
};

export const fetchSurveys = async (eventId) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/surveys/`);
  if (!response.ok) throw new Error('Failed to fetch surveys');
  return await response.json();
};