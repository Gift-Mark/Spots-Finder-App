import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faXmark, 
  faTrash, 
  faCalendar, 
  faClock, 
  faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';

export const EventModeration = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('Pending'); // 'Pending', 'Approved', 'Rejected'

  // --- READ: Fetch events safely on mount (Lint-safe version) ---
  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        if (isMounted) setLoading(true);
        const response = await fetch('/api/admin/events', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const eventList = Array.isArray(data) 
          ? data 
          : data.data || data.events || [];
          
        if (isMounted) {
          setEvents(eventList);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch moderation events:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to reload events after actions
  const reloadEvents = async () => {
    try {
      const response = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const eventList = Array.isArray(data) ? data : data.data || data.events || [];
      setEvents(eventList);
    } catch (err) {
      console.error('Failed to reload events:', err);
    }
  };

  // Update event status (Approve / Reject)
  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      await fetch(`/api/admin/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      alert(`Event ${newStatus.toLowerCase()} successfully!`);
      reloadEvents();
    } catch {
      alert('Failed to update event status.');
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event submission?')) return;
    try {
      await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Event deleted successfully.');
      reloadEvents();
    } catch {
      alert('Failed to delete event.');
    }
  };

  // Filter events based on active sub-tab
  const filteredEvents = events.filter((ev) => {
    const status = (ev.status || 'Pending').toLowerCase();
    return status === filterTab.toLowerCase();
  });

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>
          Event Submissions & Moderation Hub
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
          Review, verify, and approve community event submissions for Jos Pulse.
        </p>
      </div>

      {/* Moderation Status Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
        {['Pending', 'Approved', 'Rejected'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilterTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor: filterTab === tab ? '#F97316' : '#F1F5F9',
              color: filterTab === tab ? '#FFFFFF' : '#475569',
            }}
          >
            {tab} Queue ({events.filter(e => (e.status || 'Pending').toLowerCase() === tab.toLowerCase()).length})
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#64748B', padding: '20px 0' }}>Loading event queue...</p>
      ) : filteredEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFC', borderRadius: '8px', color: '#64748B' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>No {filterTab.toLowerCase()} events found in the queue.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredEvents.map((event) => {
            const eventId = event._id || event.id;

            return (
              <div 
                key={eventId}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      textTransform: 'uppercase', 
                      padding: '3px 8px', 
                      borderRadius: '4px',
                      backgroundColor: '#FFEDD5',
                      color: '#C2410C'
                    }}>
                      {event.category || 'General Event'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>By: {event.organizerName || 'Community'}</span>
                  </div>

                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
                    {event.title || event.name}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon icon={faCalendar} style={{ color: '#F97316' }} />
                      <span>{event.date || 'TBD'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon icon={faClock} style={{ color: '#F97316' }} />
                      <span>{event.time || 'TBD'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#F97316' }} />
                      <span>{event.venue || event.location || 'Jos, Plateau'}</span>
                    </div>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                  {filterTab === 'Pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(eventId, 'Approved')}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#16A34A',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} /> Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(eventId, 'Rejected')}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#DC2626',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} /> Reject
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(eventId)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    title="Delete Event"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventModeration;