import { useState } from 'react';

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('platform-rules');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* 1. TOP NAVIGATION BAR */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <a href="/" style={styles.logo}>Jos Pulse</a>
          <div style={styles.navLinks}>
            <a href="/guides" style={styles.navLink}>Local Guides</a>
            <a href="/events" style={styles.navLink}>Events & Tickets</a>
            <a href="/claim-venue" style={styles.navLink}>Claim Your Venue</a>
            <a href="/terms" style={{ ...styles.navLink, ...styles.activeNavLink }}>Terms of Service</a>
          </div>
          <div style={styles.authButtons}>
            <a href="/login" style={styles.btnSignIn}>Sign In</a>
            <a href="/register" style={styles.btnJoin}>Join</a>
          </div>
        </div>
      </nav>

      {/* 2. HERO HEADER */}
      <header style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <span style={styles.heroBadge}>Legal Framework</span>
          <h1 style={styles.heroTitle}>Terms of Service</h1>
          <p style={styles.heroSub}>
            Effective Date: October 1, 2026 | Last Updated: October 2026
          </p>
          <p style={styles.heroDescription}>
            These Terms governing access to and use of Jos Pulse outline user responsibilities, event ticket purchase & refund policies, certified guide interactions, and vendor listing standards across Plateau State.
          </p>
        </div>
      </header>

      {/* 3. MAIN CONTENT LAYOUT */}
      <div style={styles.contentContainer}>
        {/* SIDEBAR NAVIGATION */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarSticky}>
            <h4 style={styles.sidebarTitle}>Terms Sections</h4>
            <nav style={styles.sidebarNav}>
              {[
                { id: 'platform-rules', label: '1. Platform Usage Rules' },
                { id: 'ticket-refunds', label: '2. Event Tickets & Refunds' },
                { id: 'tour-bookings', label: '3. Guided Tours & Hiking' },
                { id: 'content-guidelines', label: '4. User Content & Reviews' },
                { id: 'vendor-terms', label: '5. Venue & Business Owners' },
                { id: 'limitation', label: '6. Liability & Disclaimers' },
                { id: 'contact-terms', label: '7. Governing Law & Inquiries' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    ...styles.sidebarLink,
                    ...(activeSection === item.id ? styles.sidebarLinkActive : {})
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* TERMS DOCUMENT BODY */}
        <main style={styles.termsBody}>
          <section id="platform-rules" style={styles.termsSection}>
            <h2 style={styles.sectionHeading}>1. Platform Usage Rules</h2>
            <p style={styles.paragraph}>
              By accessing or using Jos Pulse (website, mobile platforms, and ticketing services), you agree to comply with all applicable Nigerian federal and Plateau State laws.
            </p>
            <ul style={styles.bulletList}>
              <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your credentials and all activity under your account.</li>
              <li><strong>Age Requirement:</strong> Ticket purchasing and venue registration are limited to persons aged 18 or older.</li>
              <li><strong>Prohibited Conduct:</strong> Users must not attempt ticket scalping, voucher counterfeiting, unauthorized scraping, or uploading malicious content.</li>
            </ul>
          </section>

          <section id="ticket-refunds" style={styles.termsSection}>
            <h2 style={styles.sectionHeading}>2. Event Tickets & Refund Rules</h2>
            <p style={styles.paragraph}>
              All ticket transactions conducted through Jos Pulse issue scannable electronic QR vouchers linked to a unique transaction ID.
            </p>
            <div style={styles.calloutBox}>
              <strong style={{ color: '#F97316', display: 'block', marginBottom: '6px' }}>🎟️ Official Refund & Cancellation Policy</strong>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: '1.7' }}>
                <li><strong>Event Cancellations:</strong> If an event or festival is officially canceled by the organizer, users receive a 100% refund processed within 5 to 7 business days.</li>
                <li><strong>Event Rescheduling:</strong> If an event date or location changes, tickets remain valid for the new date, or a full refund can be requested within 48 hours of notification.</li>
                <li><strong>User No-Shows:</strong> Standard ticket purchases are non-refundable for individual non-attendance unless explicitly specified by the event host.</li>
                <li><strong>Transferability:</strong> E-tickets can be transferred to another individual via the "Transfer Pass" option inside your user dashboard.</li>
              </ul>
            </div>
          </section>

          <section id="tour-bookings" style={styles.termsSection}>
            <h2 style={styles.sectionHeading}>3. Guided Tours & Outdoor Expeditions</h2>
            <p style={styles.paragraph}>
              Outdoor activities in Plateau State (such as Shere Hills treks, Kurra Falls tours, and Assob Falls excursions) involve inherent natural terrain risks.
            </p>
            <ul style={styles.bulletList}>
              <li><strong>Guide Authority:</strong> Participants must follow all safety protocols outlined by certified local Jos Pulse tour guides.</li>
              <li><strong>Weather Safety:</strong> Guided outdoor activities delayed or canceled due to severe weather will be rescheduled at no additional cost.</li>
            </ul>
          </section>

          <section id="content-guidelines" style={styles.termsSection}>
            <h2 style={styles.sectionHeading}>4. User Content & Review Guidelines</h2>
            <p style={styles.paragraph}>
              Jos Pulse encourages genuine community ratings, photographs, and vibe reviews for spots across Jos. Submitted content must comply with our community standard:
            </p>
            <div style={styles.rulesGrid}>
              <div style={styles.ruleCard}>
                <strong style={{ color: '#16A34A' }}>✓ Authentic Reviews</strong>
                <p style={styles.ruleCardText}>Reviews must reflect genuine first-hand visits to local dining, resorts, or sports clubs.</p>
              </div>
              <div style={styles.ruleCard}>
                <strong style={{ color: '#DC2626' }}>✕ Strict Prohibitions</strong>
                <p style={styles.ruleCardText}>No hate speech, extortion, false claims, promotional spam, or offensive media.</p>
              </div>
            </div>
          </section>

          <section id="vendor-terms" style={styles.termsSection}>
            <h2 style={styles.sectionHeading}>5. Venue & Business Owners</h2>
            <p style={styles.paragraph}>
              Business owners claiming listings (restaurants, resorts, lounges, golf clubs) via `/claim-venue` agree to maintain accurate business hours, ticket prices, and facility information.
            </p>
            <ul style={styles.bulletList}>
              <li><strong>Verification Integrity:</strong> Claimed properties undergo CAC and local business authorization checks before badge publication.</li>
              <li><strong>Promoted Placements:</strong> Subscription payments for featured hero spots are non-refundable once the promotion period goes live.</li>
            </ul>
          </section>

          <section id="limitation" style={styles.termsSection}>
            <h2 style={styles.sectionHeading}>6. Liability & Disclaimers</h2>
            <p style={styles.paragraph}>
              Jos Pulse operates as a digital discovery platform and ticketing engine. Third-party venue operations, catering, and independent organizer management remain the direct responsibility of the respective venue or event host.
            </p>
          </section>

          <section id="contact-terms" style={styles.termsSection}>
            <h2 style={styles.sectionHeading}>7. Governing Law & Legal Inquiries</h2>
            <p style={styles.paragraph}>
              These terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
            </p>
            <div style={styles.contactCard}>
              <p style={{ margin: '0 0 6px', fontWeight: 'bold' }}>Jos Pulse Legal & Compliance Unit</p>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748B' }}>📍 Jos Tech Hub, Rayfield Road, Jos, Plateau State, Nigeria</p>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748B' }}>✉️ legal@jospulse.ng</p>
            </div>
          </section>
        </main>
      </div>

      {/* 4. FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerBrandCol}>
            <h3 style={styles.footerBrand}>Jos Pulse</h3>
            <p style={styles.footerCopy}>
              © 2026 Jos Pulse. The Official Culture & Tourism Hub of Plateau State, Nigeria.
            </p>
          </div>
          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerHeading}>Explore</h4>
            <a href="/guides" style={styles.footerLink}>Local Guides</a>
            <a href="/events" style={styles.footerLink}>Event Ticketing</a>
          </div>
          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerHeading}>Partners</h4>
            <a href="/claim-venue" style={styles.footerLink}>Claim Your Venue</a>
          </div>
          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerHeading}>Legal & Support</h4>
            <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
            <a href="/terms" style={styles.footerLinkActiveText}>Terms of Service</a>
            <a href="/contact" style={styles.footerLink}>Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// STYLES REUSING JOS PULSE DESIGN SYSTEM (#0F172A Dark Slate & #F97316 Brand Orange)
const styles = {
  pageWrapper: {
    backgroundColor: '#FAFAFA',
    minHeight: '100vh',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#0F172A'
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
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#0F172A', textDecoration: 'none' },
  navLinks: { display: 'flex', gap: '24px' },
  navLink: { textDecoration: 'none', color: '#64748B', fontSize: '14px', fontWeight: '500' },
  activeNavLink: { color: '#0F172A', fontWeight: 'bold', borderBottom: '2px solid #F97316', paddingBottom: '4px' },
  authButtons: { display: 'flex', gap: '12px' },
  btnSignIn: { textDecoration: 'none', color: '#0F172A', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' },
  btnJoin: { textDecoration: 'none', backgroundColor: '#F97316', color: '#FFFFFF', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' },
  heroSection: { backgroundColor: '#0F172A', color: '#FFFFFF', padding: '60px 24px 50px', textAlign: 'center' },
  heroContainer: { maxWidth: '800px', margin: '0 auto' },
  heroBadge: { display: 'inline-block', backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#F97316', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' },
  heroTitle: { fontSize: '36px', fontWeight: '800', margin: '0 0 12px' },
  heroSub: { fontSize: '13px', color: '#F97316', fontWeight: 'bold', marginBottom: '12px' },
  heroDescription: { color: '#94A3B8', fontSize: '15px', lineHeight: '1.6', margin: 0 },
  contentContainer: { maxWidth: '1200px', margin: '40px auto 80px', padding: '0 24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '48px' },
  sidebarSticky: { position: 'sticky', top: '100px' },
  sidebarTitle: { fontSize: '14px', fontWeight: 'bold', color: '#0F172A', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  sidebarLink: { background: 'none', border: 'none', textAlign: 'left', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#64748B', cursor: 'pointer', fontWeight: '500' },
  sidebarLinkActive: { backgroundColor: '#FFF7ED', color: '#F97316', fontWeight: 'bold' },
  termsBody: { backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  termsSection: { marginBottom: '40px', scrollMarginTop: '120px' },
  sectionHeading: { fontSize: '20px', fontWeight: 'bold', color: '#0F172A', margin: '0 0 16px', borderBottom: '2px solid #F1F5F9', paddingBottom: '8px' },
  paragraph: { fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: '0 0 16px' },
  bulletList: { paddingLeft: '20px', fontSize: '14px', color: '#475569', lineHeight: '1.8' },
  calloutBox: { backgroundColor: '#FFF7ED', borderLeft: '4px solid #F97316', padding: '16px 20px', borderRadius: '0 8px 8px 0', marginTop: '16px' },
  rulesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' },
  ruleCard: { padding: '16px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' },
  ruleCardText: { margin: '6px 0 0', fontSize: '12px', color: '#64748B', lineHeight: '1.5' },
  contactCard: { backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', padding: '20px', borderRadius: '8px', marginTop: '12px' },
  footer: { backgroundColor: '#0F172A', color: '#FFFFFF', padding: '60px 24px 40px' },
  footerContainer: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' },
  footerBrandCol: { paddingRight: '20px' },
  footerBrand: { fontSize: '22px', fontWeight: 'bold', color: '#F97316', margin: '0 0 12px' },
  footerCopy: { color: '#94A3B8', fontSize: '13px', lineHeight: '1.5' },
  footerLinkCol: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerHeading: { fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF', margin: '0 0 6px' },
  footerLink: { color: '#94A3B8', textDecoration: 'none', fontSize: '13px' },
  footerLinkActiveText: { color: '#F97316', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }
};