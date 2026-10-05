import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Paperclip, 
  ShieldCheck, 
  MessageSquare,
  Building2,
  Compass,
  LifeBuoy,
  X,
  ArrowRight
} from 'lucide-react';

const DIRECT_CONTACTS = [
  {
    id: 'gen-support',
    icon: Phone,
    title: 'General Enquiries & WhatsApp',
    subtitle: 'Instant response for ticket bookings & account help.',
    primaryDetail: '+234 800 567 7857 (JOS PULSE)',
    secondaryDetail: 'support@jospulse.ng',
    badge: 'Available 24/7',
    badgeColor: '#16A34A',
    actionText: 'Chat on WhatsApp',
    actionUrl: 'https://wa.me/2348005677857'
  },
  {
    id: 'vendor-support',
    icon: Building2,
    title: 'Vendor & Venue Onboarding',
    subtitle: 'Assistance with venue claims, promos & business profiles.',
    primaryDetail: 'vendors@jospulse.ng',
    secondaryDetail: '+234 802 999 4455',
    badge: 'Mon - Fri, 8am - 6pm',
    badgeColor: '#3B82F6',
    actionText: 'Claim Your Venue',
    actionUrl: '/claim-venue'
  },
  {
    id: 'tour-help',
    icon: Compass,
    title: 'Emergency Tour & Guide Help',
    subtitle: 'On-the-ground trek assistance & mountain guide dispatch.',
    primaryDetail: 'tour-help@jospulse.ng',
    secondaryDetail: '+234 803 111 2233',
    badge: 'Priority Field Support',
    badgeColor: '#F97316',
    actionText: 'Call Guide Ops',
    actionUrl: 'tel:+2348031112233'
  },
  {
    id: 'physical-office',
    icon: MapPin,
    title: 'Jos Headquarters',
    subtitle: 'Drop in for physical venue verification or partnership meetings.',
    primaryDetail: 'Jos Tech Hub, Rayfield Road',
    secondaryDetail: 'Jos South, Plateau State, Nigeria',
    badge: 'Open Office Hours',
    badgeColor: '#6B7280',
    actionText: 'Get Directions',
    actionUrl: 'https://maps.google.com'
  }
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'How do I access and use my event ticket QR code at venue entry?',
    answer: 'Once your purchase is completed via Paystack or Flutterwave, your electronic QR voucher is automatically generated and sent to your email. You can also view and present it directly from your Jos Pulse Account Dashboard under "My Passes". Simply show the QR code on your mobile device to gate staff for instant scanning.'
  },
  {
    id: 'faq-2',
    question: 'How long does venue ownership verification take after claiming a listing?',
    answer: 'Venue claims submitted via /claim-venue undergo local business verification by our team within 24 to 48 hours. We check business license documentation (CAC) or cross-verify via a quick physical spot-check or official phone confirmation before activating your Verified Badge.'
  },
  {
    id: 'faq-3',
    question: 'What is the refund policy if an event or guided tour is rescheduled?',
    answer: 'If an event or tour is officially canceled by the organizer, you will receive an automatic 100% refund to your original payment method within 5-7 business days. If rescheduled, your pass remains valid for the new date or you can request a risk-free full refund up to 48 hours before the new start time.'
  },
  {
    id: 'faq-4',
    question: 'Are outdoor treks (e.g., Shere Hills, Kurra Falls) accompanied by certified guides?',
    answer: 'Yes! All hiking and high-altitude activities booked through our Certified Local Guides program are led by Plateau Tourism Board accredited expedition leaders who are trained in mountain navigation, wilderness first aid, and regional history.'
  },
  {
    id: 'faq-5',
    question: 'How can I publish an event or festival on Jos Pulse?',
    answer: 'You can register an Event Host account or contact our Onboarding desk at vendors@jospulse.ng. Our team will review your event details, ticket tiers, and promotional banners to publish it to our main events feed within a few hours.'
  }
];

export default function ContactPage() {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    category: 'Ticket Booking & QR Passes',
    subject: '',
    message: '',
    attachment: null
  });

  // UI Interactive States
  const [openFaq, setOpenFaq] = useState('faq-1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachment: file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to backend support ticket system
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      category: 'Ticket Booking & QR Passes',
      subject: '',
      message: '',
      attachment: null
    });
    setFileName('');
    setShowSuccessModal(false);
  };

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* 1. NAVIGATION BAR */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <a href="/" style={styles.logoGroup}>
            <span style={styles.logoText}>Jos Pulse</span>
            <span style={styles.logoBadge}>SUPPORT</span>
          </a>

          <div style={styles.authButtons}>
            <a href="/login" style={styles.btnSignIn}>Login</a>
            <a href="/register" style={styles.btnJoin}>Register</a>
          </div>
        </div>
      </nav>

      {/* 2. HERO HEADER SECTION */}
      <header style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={styles.heroBadge}>
            <LifeBuoy size={14} color="#F97316" />
            <span>24/7 Plateau Customer Care</span>
          </div>
          <h1 style={styles.heroTitle}>Contact Jos Pulse Support</h1>
          <p style={styles.heroSub}>
            We're here to help you explore Plateau State seamlessly, answer ticket questions, or guide you through claiming your business listing.
          </p>

          <div style={styles.heroQuickBar}>
            <div style={styles.heroQuickItem}>
              <Clock size={16} color="#F97316" />
              <span>Avg. Response Time: <strong>&lt; 15 Mins</strong></span>
            </div>
            <div style={styles.heroQuickDivider} />
            <div style={styles.heroQuickItem}>
              <ShieldCheck size={16} color="#16A34A" />
              <span>Official Support Channel</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. DIRECT CONTACT CARDS GRID */}
      <section style={styles.sectionContainer}>
        <div style={styles.sectionHeaderCentered}>
          <span style={styles.categoryTag}>DIRECT CHANNELS</span>
          <h2 style={styles.sectionTitle}>Get in Touch with the Right Desk</h2>
          <p style={styles.sectionSub}>Choose a direct contact channel below or send us a message through the support form.</p>
        </div>

        <div style={styles.contactsGrid}>
          {DIRECT_CONTACTS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} style={styles.contactCard}>
                <div style={styles.contactCardHeader}>
                  <div style={styles.iconCircle}>
                    <IconComponent size={22} color="#F97316" />
                  </div>
                  <span style={{ ...styles.statusBadge, backgroundColor: `${item.badgeColor}15`, color: item.badgeColor, borderColor: item.badgeColor }}>
                    {item.badge}
                  </span>
                </div>

                <h3 style={styles.contactTitle}>{item.title}</h3>
                <p style={styles.contactSub}>{item.subtitle}</p>

                <div style={styles.contactDetailsBox}>
                  <strong style={styles.primaryDetail}>{item.primaryDetail}</strong>
                  <span style={styles.secondaryDetail}>{item.secondaryDetail}</span>
                </div>

                <a href={item.actionUrl} style={styles.cardActionBtn} target="_blank" rel="noopener noreferrer">
                  <span>{item.actionText}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE SUPPORT FORM & OFFICE LOCATION */}
      <section style={{ ...styles.sectionContainer, marginTop: '60px' }}>
        <div style={styles.formSectionLayout}>
          {/* LEFT: FORM CONTAINER */}
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <MessageSquare size={24} color="#F97316" />
              <div>
                <h3 style={styles.formTitle}>Send Support Ticket</h3>
                <p style={styles.formSubText}>Fill out the details below and our team will get back to you promptly.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.supportForm}>
              <div style={styles.formRow2}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name <span style={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Pam Chollom"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address <span style={styles.required}>*</span></label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. pam@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow2}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Topic / Category <span style={styles.required}>*</span></label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="Ticket Booking & QR Passes">Ticket Booking & QR Passes</option>
                    <option value="Venue Claim & Verification">Venue Claim & Verification</option>
                    <option value="Tour Guide & Shere Hills Hike">Tour Guide & Shere Hills Hike</option>
                    <option value="Event Host Sponsorship">Event Host Sponsorship</option>
                    <option value="Technical Bug / App Issue">Technical Bug / App Issue</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Subject <span style={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Message Details <span style={styles.required}>*</span></label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Please describe how we can help you in detail..."
                  value={formData.message}
                  onChange={handleInputChange}
                  style={styles.textarea}
                />
              </div>

              {/* File Attachment Field */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Attach Screenshot or Proof (Optional)</label>
                <div style={styles.fileUploadBox}>
                  <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/*,.pdf"
                  />
                  <label htmlFor="file-input" style={styles.fileUploadLabel}>
                    <Paperclip size={18} color="#F97316" />
                    <span>{fileName ? fileName : 'Choose image, ticket receipt, or PDF file...'}</span>
                  </label>
                </div>
              </div>

              <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  <span>Transmitting Ticket...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Support Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: PHYSICAL HQ SIDEBAR & MAP HIGHLIGHT */}
          <div style={styles.hqSidebar}>
            <div style={styles.hqCard}>
              <div style={styles.hqBadge}>PHYSICAL HEADQUARTERS</div>
              <h3 style={styles.hqTitle}>Jos Tech Hub & Operations Desk</h3>
              <p style={styles.hqAddress}>
                Rayfield Road, Opposite Government House Area,<br />
                Jos South, Plateau State, Nigeria
              </p>

              <div style={styles.hqMetaList}>
                <div style={styles.hqMetaItem}>
                  <Clock size={16} color="#F97316" />
                  <div>
                    <strong>Working Hours:</strong>
                    <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>Mon - Fri: 8:00 AM - 6:00 PM WAT</p>
                  </div>
                </div>

                <div style={styles.hqMetaItem}>
                  <Mail size={16} color="#F97316" />
                  <div>
                    <strong>General Email:</strong>
                    <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>hello@jospulse.ng</p>
                  </div>
                </div>
              </div>

              {/* Map Preview Graphic */}
              <div style={styles.mapBox}>
                <div style={styles.mapOverlay}>
                  <MapPin size={28} color="#F97316" />
                  <span style={styles.mapPinText}>Jos Pulse HQ (Rayfield)</span>
                </div>
              </div>

              <div style={styles.hqFooterTip}>
                <span>💡 Visiting for vendor onboarding? Bring your business CAC certificate for on-the-spot verification.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section style={{ ...styles.sectionContainer, margin: '80px auto' }}>
        <div style={styles.sectionHeaderCentered}>
          <div style={styles.categoryTagGroup}>
            <HelpCircle size={14} color="#F97316" />
            <span style={styles.categoryTag}>KNOWLEDGE BASE</span>
          </div>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p style={styles.sectionSub}>Quick answers to common questions about ticket passes, tour safety, and venue management.</p>
        </div>

        <div style={styles.faqList}>
          {FAQ_ITEMS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div key={faq.id} style={{ ...styles.faqCard, ...(isOpen ? styles.faqCardOpen : {}) }}>
                <button style={styles.faqQuestionBtn} onClick={() => toggleFaq(faq.id)}>
                  <span style={styles.faqQuestionText}>{faq.question}</span>
                  {isOpen ? <ChevronUp size={20} color="#F97316" /> : <ChevronDown size={20} color="#64748B" />}
                </button>

                {isOpen && (
                  <div style={styles.faqAnswerBox}>
                    <p style={styles.faqAnswerText}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SUCCESS MODAL NOTIFICATION */}
      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.modalCloseBtn} onClick={resetForm}>
              <X size={20} />
            </button>

            <div style={styles.modalBody}>
              <div style={styles.successIconCircle}>
                <CheckCircle2 size={48} color="#16A34A" />
              </div>

              <h3 style={styles.modalTitle}>Support Ticket Received!</h3>
              <p style={styles.modalSub}>
                Thank you <strong>{formData.fullName || 'User'}</strong>. Your ticket regarding <strong>"{formData.category}"</strong> has been logged into our support queue.
              </p>

              <div style={styles.ticketSummaryBox}>
                <div style={styles.ticketRow}>
                  <span>Ticket Ref ID:</span>
                  <strong style={{ color: '#F97316' }}>#JP-2026-{(Math.floor(Math.random() * 8999) + 1000)}</strong>
                </div>
                <div style={styles.ticketRow}>
                  <span>Destination Email:</span>
                  <strong>{formData.email}</strong>
                </div>
                <div style={styles.ticketRow}>
                  <span>Estimated Reply:</span>
                  <strong style={{ color: '#16A34A' }}>Within 15 Minutes</strong>
                </div>
              </div>

              <button style={styles.modalBtn} onClick={resetForm}>
                Done & Return to Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerBrandCol}>
            <h3 style={styles.footerBrand}>Jos Pulse</h3>
            <p style={styles.footerCopy}>
              © 2026 Jos Pulse. The Official Culture & Tourism Hub of Plateau State, Nigeria. Discover events, hike Shere Hills safely, and support local businesses.
            </p>
          </div>

          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerHeading}>Explore</h4>
            <a href="/guides" style={styles.footerLink}>Local Guides</a>
            <a href="/events" style={styles.footerLink}>Event Ticketing</a>
            <a href="/itineraries" style={styles.footerLink}>City Itineraries</a>
          </div>

          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerHeading}>Partners</h4>
            <a href="/claim-venue" style={styles.footerLink}>Claim Your Venue</a>
            <a href="/promotions" style={styles.footerLink}>Promote an Event</a>
          </div>

          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerHeading}>Legal & Support</h4>
            <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
            <a href="/terms" style={styles.footerLink}>Terms of Service</a>
            <a href="/contact" style={styles.footerLinkActiveText}>Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: '#FAFAFA',
    minHeight: '100vh',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#0F172A',
    paddingBottom: '0'
  },
  navbar: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0F172A'
  },
  logoBadge: {
    backgroundColor: '#FFF7ED',
    color: '#F97316',
    fontSize: '10px',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid #FFEDD5'
  },
  navLinks: {
    display: 'flex',
    gap: '24px'
  },
  navLink: {
    textDecoration: 'none',
    color: '#64748B',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s'
  },
  activeNavLink: {
    color: '#0F172A',
    fontWeight: 'bold',
    borderBottom: '2px solid #F97316',
    paddingBottom: '4px'
  },
  authButtons: {
    display: 'flex',
    gap: '12px'
  },
  btnSignIn: {
    textDecoration: 'none',
    color: '#0F172A',
    border: '1px solid #CBD5E1',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500'
  },
  btnJoin: {
    textDecoration: 'none',
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    padding: '8px 18px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 'bold'
  },
  heroSection: {
    backgroundColor: '#0F172A',
    backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.98)), url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#FFFFFF',
    padding: '70px 24px 60px',
    textAlign: 'center'
  },
  heroContainer: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    border: '1px solid #F97316',
    color: '#F97316',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  heroTitle: {
    fontSize: '38px',
    fontWeight: '800',
    margin: '0 0 16px',
    lineHeight: '1.2'
  },
  heroSub: {
    color: '#94A3B8',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 32px'
  },
  heroQuickBar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: '#1E293B',
    padding: '12px 24px',
    borderRadius: '30px',
    border: '1px solid #334155',
    fontSize: '13px',
    color: '#CBD5E1'
  },
  heroQuickItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  heroQuickDivider: {
    width: '1px',
    height: '16px',
    backgroundColor: '#334155'
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '50px auto 0',
    padding: '0 24px'
  },
  sectionHeaderCentered: {
    textAlign: 'center',
    maxWidth: '640px',
    margin: '0 auto 40px'
  },
  categoryTagGroup: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  categoryTag: {
    fontSize: '12px',
    color: '#F97316',
    fontWeight: '800',
    letterSpacing: '1px'
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0F172A',
    margin: '6px 0 10px'
  },
  sectionSub: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
    lineHeight: '1.5'
  },
  contactsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px'
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column'
  },
  contactCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  iconCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: '#FFF7ED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid'
  },
  contactTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 6px'
  },
  contactSub: {
    fontSize: '13px',
    color: '#64748B',
    lineHeight: '1.4',
    margin: '0 0 16px'
  },
  contactDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #F1F5F9',
    marginBottom: '20px',
    marginTop: 'auto'
  },
  primaryDetail: {
    display: 'block',
    fontSize: '14px',
    color: '#0F172A'
  },
  secondaryDetail: {
    display: 'block',
    fontSize: '12px',
    color: '#64748B',
    marginTop: '2px'
  },
  cardActionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    padding: '10px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  formSectionLayout: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '32px',
    alignItems: 'start'
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    padding: '36px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)'
  },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '28px',
    borderBottom: '1px solid #F1F5F9',
    paddingBottom: '20px'
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0F172A',
    margin: 0
  },
  formSubText: {
    fontSize: '13px',
    color: '#64748B',
    margin: '4px 0 0'
  },
  supportForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formRow2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#0F172A'
  },
  required: {
    color: '#EF4444'
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FFFFFF'
  },
  select: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer'
  },
  textarea: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  fileUploadBox: {
    border: '1px dashed #CBD5E1',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    textAlign: 'center'
  },
  fileUploadLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748B',
    cursor: 'pointer'
  },
  submitBtn: {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
    transition: 'background-color 0.2s'
  },
  hqSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  hqCard: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #1E293B'
  },
  hqBadge: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: '1px',
    marginBottom: '12px'
  },
  hqTitle: {
    fontSize: '20px',
    fontWeight: '800',
    margin: '0 0 8px'
  },
  hqAddress: {
    fontSize: '14px',
    color: '#94A3B8',
    lineHeight: '1.6',
    margin: '0 0 24px'
  },
  hqMetaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
    borderTop: '1px solid #1E293B',
    paddingTop: '20px'
  },
  hqMetaItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '14px'
  },
  mapBox: {
    height: '140px',
    backgroundColor: '#1E293B',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
    backgroundSize: '16px 16px',
    border: '1px solid #334155',
    marginBottom: '20px'
  },
  mapOverlay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px'
  },
  mapPinText: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#0F172A',
    padding: '4px 10px',
    borderRadius: '4px'
  },
  hqFooterTip: {
    fontSize: '12px',
    color: '#CBD5E1',
    lineHeight: '1.5',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid rgba(249, 115, 22, 0.2)'
  },
  faqList: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    transition: 'all 0.2s'
  },
  faqCardOpen: {
    borderColor: '#F97316',
    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.08)'
  },
  faqQuestionBtn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    backgroundColor: 'none',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left'
  },
  faqQuestionText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0F172A'
  },
  faqAnswerBox: {
    padding: '0 24px 20px',
    borderTop: '1px dashed #F1F5F9',
    paddingTop: '16px'
  },
  faqAnswerText: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.7',
    margin: 0
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '460px',
    width: '100%',
    padding: '32px',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748B'
  },
  modalBody: {
    textAlign: 'center'
  },
  successIconCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#DCFCE7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px'
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0F172A',
    margin: '0 0 8px'
  },
  modalSub: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: '1.5',
    margin: '0 0 24px'
  },
  ticketSummaryBox: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '13px'
  },
  ticketRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#475569'
  },
  modalBtn: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    border: 'none',
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer'
  },
  footer: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    padding: '60px 24px 40px',
    marginTop: '80px',
    borderTop: '1px solid #1E293B'
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px'
  },
  footerBrandCol: {
    paddingRight: '20px'
  },
  footerBrand: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#F97316',
    margin: '0 0 12px'
  },
  footerCopy: {
    color: '#94A3B8',
    fontSize: '13px',
    lineHeight: '1.6'
  },
  footerLinkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  footerHeading: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    margin: '0 0 6px'
  },
  footerLink: {
    color: '#94A3B8',
    textDecoration: 'none',
    fontSize: '13px'
  },
  footerLinkActiveText: {
    color: '#F97316',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 'bold'
  }
};