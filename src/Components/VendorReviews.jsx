import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCommentDots, faReply, faCheck } from '@fortawesome/free-solid-svg-icons';

export const VendorReviews = ({ businessName }) => {
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      author: 'Aisha Bello',
      rating: 5,
      date: 'Yesterday, 4:15 PM',
      comment: 'An absolute masterpiece of an experience! The atmosphere and service at ' + businessName + ' were top-notch during the weekend event.',
      reply: ''
    },
    {
      id: 'rev-2',
      author: 'Chinedu Okafor',
      rating: 4,
      date: '3 days ago',
      comment: 'Great ambiance and smooth ticket entry QR validation. Will definitely be coming back for the next meetup.',
      reply: 'Thank you Chinedu! Glad you enjoyed the experience.'
    }
  ]);

  const [replyText, setReplyText] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  const handleSendReply = (revId) => {
    const text = replyText[revId];
    if (!text) return;

    setReviews(prev => prev.map(r => r.id === revId ? { ...r, reply: text } : r));
    setActiveReplyId(null);
    setReplyText(prev => ({ ...prev, [revId]: '' }));
  };

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Reviews Summary Header Card */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '16px', borderRadius: '12px', fontSize: '24px' }}>
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#0F172A' }}>Customer Reviews & Ratings</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
              Real-time community feedback and visitor ratings for {businessName}.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#F8FAFC', padding: '12px 20px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', display: 'block' }}>{averageRating}</span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Overall Score</span>
          </div>
          <div style={{ borderLeft: '1px solid #CBD5E1', paddingLeft: '16px' }}>
            <div style={{ color: '#EAB308', fontSize: '14px', marginBottom: '2px' }}>★★★★★</div>
            <span style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold' }}>Based on {reviews.length} reviews</span>
          </div>
        </div>
      </div>

      {/* Reviews Feed List */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '16px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FontAwesomeIcon icon={faCommentDots} /> Recent Feedback
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((rev) => (
            <div key={rev.id} style={{ padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>{rev.author}</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{rev.date}</span>
                </div>
                <div style={{ color: '#EAB308', fontSize: '13px' }}>
                  {Array.from({ length: rev.rating }).map(() => '★').join('')}
                </div>
              </div>

              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
                {rev.comment}
              </p>

              {/* Vendor Reply Section */}
              {rev.reply ? (
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '8px', padding: '12px', marginTop: '12px' }}>
                  <strong style={{ fontSize: '11px', color: '#166534', display: 'block', marginBottom: '2px' }}>
                    <FontAwesomeIcon icon={faCheck} /> Official Venue Response:
                  </strong>
                  <p style={{ margin: 0, fontSize: '12px', color: '#14532D' }}>{rev.reply}</p>
                </div>
              ) : (
                <div>
                  {activeReplyId === rev.id ? (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Type a polite public reply..."
                        value={replyText[rev.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF', color: '#0F172A' }}
                      />
                      <button 
                        onClick={() => handleSendReply(rev.id)}
                        style={{ backgroundColor: '#111827', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Send
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setActiveReplyId(rev.id)}
                      style={{ background: 'none', border: 'none', color: '#F97316', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}
                    >
                      <FontAwesomeIcon icon={faReply} /> Reply to patron
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorReviews;