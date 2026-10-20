import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faCheckCircle, faBolt } from '@fortawesome/free-solid-svg-icons';

export const PromotedListings = ({ businessName }) => {
  const [selectedPlan, setSelectedPlan] = useState('weekend');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const promotionPlans = [
    {
      id: 'weekend',
      name: 'Weekend Spotlight Pass',
      duration: '3 Days',
      price: '₦7,500',
      description: 'Pin your venue and events to the top of the events directory for the entire weekend rush.',
      features: ['Top banner placement', 'Highlighted WhatsApp/ScoutCity badge', 'Estimated 2,500+ impressions']
    },
    {
      id: 'season',
      name: 'Plateau Season Booster',
      duration: '14 Days',
      price: '₦25,000',
      description: 'Extended multi-week promotion designed for major festivals, holidays, and tournament series.',
      features: ['Featured Hero card placement', 'Priority newsletter inclusion', 'Estimated 12,000+ impressions']
    }
  ];

  const handleSubscribe = (planName) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Successfully activated ${planName} for ${businessName}! Redirecting to payment gateway...`);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ backgroundColor: '#FFF7ED', color: '#F97316', padding: '12px', borderRadius: '8px', fontSize: '20px' }}>
            <FontAwesomeIcon icon={faBullhorn} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#0F172A' }}>Promote {businessName}</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
              Boost your venue visibility across Jos Pulse to attract more tourists, festival-goers, and local patrons.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing & Tier Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {promotionPlans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                border: isSelected ? '2px solid #F97316' : '1px solid #E2E8F0',
                boxShadow: isSelected ? '0 4px 12px rgba(249, 115, 22, 0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '6px' }}>
                    {plan.duration}
                  </span>
                  {isSelected && (
                    <span style={{ fontSize: '12px', color: '#F97316', fontWeight: 'bold' }}>
                      <FontAwesomeIcon icon={faCheckCircle} /> Selected
                    </span>
                  )}
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0F172A' }}>{plan.name}</h3>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#F97316', marginBottom: '12px' }}>
                  {plan.price}
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', marginBottom: '20px' }}>
                  {plan.description}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} style={{ fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#16A34A', fontSize: '12px' }}>✔</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(plan.name);
                }}
                style={{
                  width: '100%',
                  backgroundColor: isSelected ? '#F97316' : '#111827',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FontAwesomeIcon icon={faBolt} /> {isSubmitting ? 'Processing...' : `Activate ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Campaigns Section */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#0F172A' }}>Active Promotion History</h3>
        <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            No active promotional campaigns running right now. Choose a package above to launch your first spotlight spot!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotedListings;