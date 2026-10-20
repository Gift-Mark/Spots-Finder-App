import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, 
  faBell, 
  faCreditCard, 
  faSave, 
  faRightFromBracket 
} from '@fortawesome/free-solid-svg-icons';

export const VendorSettings = ({ businessName }) => {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [saving, setSaving] = useState(false);

  // Form State
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({ emailAlerts: true, whatsappTicketNotify: true, reviewDigest: false });
  const [payouts, setPayouts] = useState({ bankName: 'GTBank', accountNumber: '0123456789', accountName: businessName || 'The View Restaurant' });

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings updated successfully!');
    }, 600);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of your Vendor Portal?')) {
      // Clear user session tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('jos_pulse_user');
      
      // Redirect to Login page
      navigate('/login');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#0F172A' }}>Vendor Account Settings</h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
          Manage your account security, payout bank accounts, and notification preferences for <strong>{businessName}</strong>.
        </p>

        {/* Sub-navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', flexWrap: 'wrap' }}>
          {[
            { id: 'account', name: 'Security & Password', icon: faShieldHalved },
            { id: 'payouts', name: 'Bank & Payouts', icon: faCreditCard },
            { id: 'notifications', name: 'Notifications', icon: faBell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                backgroundColor: activeSubTab === tab.id ? '#F97316' : '#F1F5F9',
                color: activeSubTab === tab.id ? '#FFFFFF' : '#475569',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FontAwesomeIcon icon={tab.icon} />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Settings Form Card */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSave}>
          {/* TAB 1: SECURITY & PASSWORDS */}
          {activeSubTab === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#0F172A' }}>Change Password</h3>
              
              <div>
                <label style={styles.label}>Current Password</label>
                <input 
                  type="password" 
                  value={passwords.current} 
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••"
                  style={styles.input} 
                />
              </div>

              <div>
                <label style={styles.label}>New Password</label>
                <input 
                  type="password" 
                  value={passwords.new} 
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="At least 8 characters"
                  style={styles.input} 
                />
              </div>

              <div>
                <label style={styles.label}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwords.confirm} 
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Re-enter new password"
                  style={styles.input} 
                />
              </div>
            </div>
          )}

          {/* TAB 2: BANK & PAYOUTS */}
          {activeSubTab === 'payouts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#0F172A' }}>Ticket Settlement Account</h3>
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#64748B' }}>
                Automated payments from local ticket sales on Jos Pulse will be deposited into this account.
              </p>

              <div>
                <label style={styles.label}>Bank Name</label>
                <select 
                  value={payouts.bankName} 
                  onChange={(e) => setPayouts({ ...payouts, bankName: e.target.value })}
                  style={styles.input}
                >
                  <option>Guaranty Trust Bank (GTBank)</option>
                  <option>First Bank of Nigeria</option>
                  <option>Zenith Bank</option>
                  <option>Access Bank</option>
                  <option>United Bank for Africa (UBA)</option>
                  <option>OPay / Moniepoint</option>
                </select>
              </div>

              <div>
                <label style={styles.label}>NUBAN Account Number</label>
                <input 
                  type="text" 
                  value={payouts.accountNumber} 
                  onChange={(e) => setPayouts({ ...payouts, accountNumber: e.target.value })}
                  style={styles.input} 
                />
              </div>

              <div>
                <label style={styles.label}>Account Name</label>
                <input 
                  type="text" 
                  value={payouts.accountName} 
                  onChange={(e) => setPayouts({ ...payouts, accountName: e.target.value })}
                  style={styles.input} 
                />
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeSubTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#0F172A' }}>Alert Preferences</h3>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', color: '#0F172A' }}>
                <input 
                  type="checkbox" 
                  checked={notifications.emailAlerts} 
                  onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })} 
                />
                Receive Instant Email when a ticket is purchased
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', color: '#0F172A' }}>
                <input 
                  type="checkbox" 
                  checked={notifications.whatsappTicketNotify} 
                  onChange={(e) => setNotifications({ ...notifications, whatsappTicketNotify: e.target.checked })} 
                />
                Enable WhatsApp instant ticket verification updates
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', color: '#0F172A' }}>
                <input 
                  type="checkbox" 
                  checked={notifications.reviewDigest} 
                  onChange={(e) => setNotifications({ ...notifications, reviewDigest: e.target.checked })} 
                />
                Weekly digest of patron reviews and venue ratings
              </label>
            </div>
          )}

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
            <button 
              type="submit" 
              disabled={saving}
              style={{ backgroundColor: '#F97316', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* DANGER ZONE / LOG OUT CARD */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #FEE2E2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <strong style={{ fontSize: '14px', color: '#991B1B', display: 'block', marginBottom: '2px' }}>
              Sign Out of Portal
            </strong>
            <p style={{ margin: 0, fontSize: '12px', color: '#7F1D1D' }}>
              Disconnect your session on this device. You will need to log back in to manage events.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }
};

export default VendorSettings;