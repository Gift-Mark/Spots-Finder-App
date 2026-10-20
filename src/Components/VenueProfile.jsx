import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faSave, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const VenueProfile = ({ initialBusinessName, initialCategory, venueImage }) => {
  const [profile, setProfile] = useState({
    businessName: initialBusinessName || 'The View Restaurant',
    category: initialCategory || 'Restaurant & Dining',
    address: 'Rayfield Road, Jos',
    phone: '+234 803 000 0000',
    description: 'Premier dining experience overlooking the beautiful landscapes of Jos, Plateau State.',
    status: 'Verified Partner'
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // API call to update vendor profile
      // await updateVendorProfile(profile);
      setTimeout(() => {
        alert('Venue profile updated successfully!');
        setSaving(false);
      }, 500);
    } catch {
      alert('Failed to update profile.');
      setSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
        {venueImage ? (
          <img src={venueImage} alt={profile.businessName} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '70px', height: '70px', borderRadius: '10px', backgroundColor: '#F97316', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            <FontAwesomeIcon icon={faBuilding} />
          </div>
        )}
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#0F172A' }}>{profile.businessName}</h2>
          <span style={{ fontSize: '12px', backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
            <FontAwesomeIcon icon={faCheckCircle} /> {profile.status}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Business Name</label>
          <input 
            type="text" 
            name="businessName"
            value={profile.businessName}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Category</label>
          <select 
            name="category"
            value={profile.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '14px', boxSizing: 'border-box' }}
          >
            <option>Restaurant & Dining</option>
            <option>Hotel & Resort</option>
            <option>Golf & Sports Club</option>
            <option>Lounge & Nightlife</option>
            <option>Event Center & Arena</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Address in Jos</label>
          <input 
            type="text" 
            name="address"
            value={profile.address}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Phone Number</label>
          <input 
            type="text" 
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Venue Description</label>
          <textarea 
            name="description"
            rows="3"
            value={profile.description}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
          <button 
            type="submit" 
            disabled={saving}
            style={{ backgroundColor: '#F97316', color: '#FFFFFF', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VenueProfile;