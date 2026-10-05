import { useState } from 'react';
import { JOS_STAYS_DIRECTORY } from '../backend/data/accomodationData.js';

export default function StaysPage() {
  const [activeModal, setActiveModal] = useState(null);

  const sections = [
    { title: "Traditional Hotels", key: "traditionalHotels" },
    { title: "Boutique Resorts", key: "boutiqueResorts" },
    { title: "Serviced Apartments", key: "servicedApartments" },
    { title: "Guest Houses", key: "guestHouses" }
  ];

  const handleSeeAll = (sectionTitle) => {
    // Navigate to full list view filtered by this category
    console.log(`Navigating to full view for: ${sectionTitle}`);
  };

  return (
    <div className="stays-container" style={{ padding: '20px' }}>
      <h2>Stays & Accommodations in Jos</h2>

      {sections.map(({ title, key }) => (
        <section key={key} style={{ marginBottom: '40px' }}>
          {/* Header Row with "See All" */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>{title}</h3>
            <button 
              onClick={() => handleSeeAll(title)}
              style={{ background: 'none', border: 'none', color: '#f97316', fontWeight: 'bold', cursor: 'pointer' }}
            >
              See All ↗
            </button>
          </div>

          {/* 4 Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {JOS_STAYS_DIRECTORY[key].slice(0, 4).map((stay) => (
              <div key={stay.id} className="stay-card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
                <img
                  src={stay.image}
                  alt={stay.name}
                  loading="lazy"
                  onError={(event) => { event.currentTarget.src = '/images/Crest Hotel.jpg'; }}
                  style={{ display: 'block', width: '100%', height: '190px', objectFit: 'cover' }}
                />
                <div style={{ padding: '15px' }}>
                  <h4>{stay.name}</h4>
                  <p>📍 {stay.neighborhood}</p>
                  <p>💰 <strong>₦{stay.pricePerNight.toLocaleString()}</strong> / night</p>
                  <button 
                    onClick={() => setActiveModal(stay)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#f97316', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Book Stay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {activeModal && (
        <div
          role="presentation"
          onClick={() => setActiveModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.55)',
            zIndex: 1000,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stay-dialog-title"
            onClick={(event) => event.stopPropagation()}
            style={{ width: 'min(100%, 420px)', padding: '24px', borderRadius: '12px', background: '#fff' }}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="Close stay details"
              style={{ float: 'right', border: 0, background: 'none', cursor: 'pointer' }}
            >
              ×
            </button>
            <h3 id="stay-dialog-title">{activeModal.name}</h3>
            <p>{activeModal.address}</p>
            <p>{activeModal.neighborhood}</p>
            <p><strong>₦{activeModal.pricePerNight.toLocaleString()}</strong> / night</p>
          </div>
        </div>
      )}
    </div>
  );
}