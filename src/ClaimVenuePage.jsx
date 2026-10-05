import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerVenueClaim } from './api/client';

export default function ClaimVenuePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    category: 'Restaurant & Dining',
    address: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    ownershipProof: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'file' ? files?.[0] || null : value
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    const claimData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'confirmPassword' && value !== null) claimData.append(key, value);
    });

    setIsSubmitting(true);
    try {
      const result = await registerVenueClaim(claimData);
      if (result.token) localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/vendor', {
        replace: true,
        state: {
          claimConfirmed: result.user.accountStatus === 'confirmed',
          businessName: result.user.businessName,
          claimStatus: result.claimStatus
        }
      });
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Could not submit your claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* HEADER */}
      <header style={styles.header}>
        <h2 style={styles.brandTitle}>Jos Pulse <span style={styles.badge}>Business</span></h2>
        <p style={styles.headerSub}>Claim your listing, manage tickets, and promote your spot to local tourists.</p>
      </header>

      {/* REGISTRATION FORM CONTAINER */}
      <div style={styles.formCard}>
        {submitError && <p role="alert" style={styles.errorText}>{submitError}</p>}

        {/* PROGRESS STEPPER */}
        <div style={styles.stepperRow}>
          <div style={{ ...styles.stepDot, ...(step >= 1 ? styles.stepActive : {}) }}>1. Business Info</div>
          <div style={{ ...styles.stepDot, ...(step >= 2 ? styles.stepActive : {}) }}>2. Owner Details</div>
          <div style={{ ...styles.stepDot, ...(step >= 3 ? styles.stepActive : {}) }}>3. Verification</div>
        </div>

        {/* STEP 1: BUSINESS DETAILS */}
        {step === 1 && (
          <form onSubmit={handleNextStep}>
            <h3 style={styles.stepHeading}>Search or Enter Your Venue Name</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Venue / Business Name</label>
              <input
                type="text"
                name="businessName"
                required
                placeholder="e.g. Rayfield Golf Club or The View Restaurant"
                value={formData.businessName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Venue Category</label>
              <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
                <option>Restaurant & Dining</option>
                <option>Hotel & Resort</option>
                <option>Golf & Sports Club</option>
                <option>Lounge & Nightlife</option>
                <option>Event Center & Arena</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Street Address in Jos / Plateau State</label>
              <input
                type="text"
                name="address"
                required
                placeholder="e.g. Rayfield Road, Opposite Resort, Jos"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.btnPrimary}>
              Continue to Account Creation →
            </button>
          </form>
        )}

        {/* STEP 2: MANAGER / OWNER ACCOUNT */}
        {step === 2 && (
          <form onSubmit={handleNextStep}>
            <h3 style={styles.stepHeading}>Manager Credentials</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Your Full Name</label>
              <input
                type="text"
                name="ownerName"
                required
                placeholder="Manager / Owner Name"
                value={formData.ownerName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Business Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="manager@rayfieldgolf.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>WhatsApp / Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+234 803 000 0000"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Create Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.btnGroup}>
              <button type="button" style={styles.btnSecondary} onClick={() => setStep(1)}>
                Back
              </button>
              <button type="submit" style={{ ...styles.btnPrimary, flex: 1 }}>
                Continue to Verification →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PROOF & SUBMIT */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h3 style={styles.stepHeading}>Verify Ownership</h3>
            <p style={styles.helperText}>
              Upload a utility bill, CAC registration, or business permit confirming your connection to <strong>{formData.businessName || 'your venue'}</strong>.
            </p>
            <p style={styles.helperText}>Your business account will be confirmed when the submission is saved. Venue ownership remains pending review.</p>

            <div style={styles.uploadBox}>
              <span style={{ fontSize: '24px' }}>📄</span>
              <p style={{ margin: '8px 0 4px', fontSize: '13px', fontWeight: 'bold' }}>
                {formData.ownershipProof?.name || 'Click to upload Proof of Ownership'}
              </p>
              <span style={{ fontSize: '11px', color: '#64748B' }}>PDF, PNG, or JPG up to 10MB</span>
              <input
                type="file"
                name="ownershipProof"
                accept=".pdf,.png,.jpg,.jpeg"
                required
                onChange={handleChange}
                style={styles.fileInput}
              />
            </div>

            <div style={styles.btnGroup}>
              <button type="button" style={styles.btnSecondary} onClick={() => setStep(2)}>
                Back
              </button>
              <button type="submit" disabled={isSubmitting} style={{ ...styles.btnPrimary, flex: 1, opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Submitting Claim...' : 'Submit & Open Vendor Dashboard'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: '#0F172A',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: '"Inter", sans-serif',
    color: '#FFFFFF'
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  brandTitle: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px' },
  badge: { backgroundColor: '#F97316', fontSize: '12px', padding: '2px 8px', borderRadius: '4px', verticalAlign: 'middle' },
  headerSub: { color: '#94A3B8', fontSize: '14px', maxWidth: '480px', margin: '0 auto' },
  formCard: {
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    borderRadius: '16px',
    padding: '36px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
  },
  stepperRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' },
  stepDot: { fontSize: '12px', color: '#94A3B8', fontWeight: '500' },
  stepActive: { color: '#F97316', fontWeight: 'bold' },
  stepHeading: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px' },
  helperText: { fontSize: '13px', color: '#64748B', lineHeight: '1.5', marginBottom: '16px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' },
  uploadBox: { border: '2px dashed #CBD5E1', borderRadius: '8px', padding: '24px', textAlign: 'center', backgroundColor: '#F8FAFC', position: 'relative', cursor: 'pointer', marginBottom: '20px' },
  fileInput: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' },
  btnGroup: { display: 'flex', gap: '12px', marginTop: '20px' },
  errorText: { color: '#B91C1C', fontSize: '13px', fontWeight: '600', margin: '0 0 16px' },
  btnPrimary: { width: '100%', backgroundColor: '#F97316', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
  btnSecondary: { backgroundColor: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', padding: '14px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }
};