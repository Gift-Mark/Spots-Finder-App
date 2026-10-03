import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUtensils, 
  faCalendarCheck, 
  faChartLine, 
  faCheckCircle, 
  faStore, 
  faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/PartnerLandingPage.module.css';

const PARTNER_BENEFITS = [
  {
    icon: faUtensils,
    title: 'Publish & Update Menus',
    description: 'Keep your seasonal dishes, daily chef specials, and pricing updated in real-time for local foodies.'
  },
  {
    icon: faCalendarCheck,
    title: 'Direct Table Reservations',
    description: 'Receive instant booking requests from diners and corporate buyers across Plateau State.'
  },
  {
    icon: faChartLine,
    title: 'Boost Local Reach',
    description: 'Get discovered by thousands of monthly visitors, travelers, and residents exploring Jos.'
  },
  {
    icon: faShieldHalved,
    title: 'Verified Business Badge',
    description: 'Build credibility with a verified partner badge, authentic reviews, and direct WhatsApp contact.'
  }
];

export const PartnerLandingPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    venueType: 'Restaurant',
    location: '',
    contactName: '',
    phone: '',
    email: '',
    claimType: 'register'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Connect to your backend API or email service here
    console.log('Vendor Registration Submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <span className={styles.kicker}>
            <FontAwesomeIcon icon={faStore} /> JOS PULSE FOR BUSINESS
          </span>
          <h1 className={styles.heroTitle}>
            Put Your Restaurant, Cafe, or Suya Spot on the Jos Map
          </h1>
          <p className={styles.heroSubtitle}>
            Join the leading hospitality network in Plateau State. Connect with thousands of foodies, accept online reservations, and grow your customer base.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className={styles.contentSection}>
        <div className={`${styles.container} ${styles.gridContainer}`}>
          
          {/* Left Column: Value Proposition & Benefits */}
          <div className={styles.benefitsCol}>
            <h2 className={styles.sectionHeading}>Why Partner With Jos Pulse?</h2>
            
            <div className={styles.benefitCards}>
              {PARTNER_BENEFITS.map((item, index) => (
                <div key={index} className={styles.benefitCard}>
                  <div className={styles.iconBox}>
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <div>
                    <h3 className={styles.benefitTitle}>{item.title}</h3>
                    <p className={styles.benefitDesc}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats Box */}
            <div className={styles.statsBanner}>
              <div>
                <strong>10,000+</strong>
                <span>Monthly Jos Diners</span>
              </div>
              <div className={styles.divider}></div>
              <div>
                <strong>100%</strong>
                <span>Direct Direct Contact</span>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              {submitted ? (
                <div className={styles.successState}>
                  <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
                  <h3>Registration Submitted!</h3>
                  <p>
                    Thank you for listing <strong>{formData.businessName}</strong>. Our onboarding team will contact you via WhatsApp/Phone within 24 hours to verify your details.
                  </p>
                  <button 
                    type="button" 
                    className={styles.resetBtn}
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Establishment
                  </button>
                </div>
              ) : (
                <>
                  <h3 className={styles.formTitle}>Claim or Register Venue</h3>
                  <p className={styles.formDesc}>
                    Fill out this form to claim an existing listing or submit a new establishment.
                  </p>

                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input 
                          type="radio" 
                          name="claimType" 
                          value="register" 
                          checked={formData.claimType === 'register'} 
                          onChange={(e) => setFormData({ ...formData, claimType: e.target.value })}
                        />
                        <span>Register New Venue</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input 
                          type="radio" 
                          name="claimType" 
                          value="claim" 
                          checked={formData.claimType === 'claim'} 
                          onChange={(e) => setFormData({ ...formData, claimType: e.target.value })}
                        />
                        <span>Claim Existing Listing</span>
                      </label>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Establishment Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Barcardi Jos, Valada, or Rayfield Rooftop" 
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      />
                    </div>

                    <div className={styles.row}>
                      <div className={styles.inputGroup}>
                        <label>Venue Category *</label>
                        <select 
                          value={formData.venueType}
                          onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                        >
                          <option value="Restaurant">Restaurant</option>
                          <option value="Cafe">Cafe & Bakery</option>
                          <option value="Suya Spot">Suya Spot / Grill</option>
                          <option value="Lounge">Rooftop / Lounge</option>
                          <option value="Traditional">Traditional / Local Food</option>
                        </select>
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Location in Jos *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. GRA, Bukuru, Rayfield" 
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Contact Person Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Full Name of Manager / Owner" 
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      />
                    </div>

                    <div className={styles.row}>
                      <div className={styles.inputGroup}>
                        <label>Phone / WhatsApp Number *</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="08012345678" 
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          placeholder="manager@venue.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                      Submit Partnership Application <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default PartnerLandingPage;