import { useState } from 'react';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('data-collection');

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
            <a href="/privacy" style={{ ...styles.navLink, ...styles.activeNavLink }}>Privacy Policy</a>
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
          <span style={styles.heroBadge}>Legal & Compliance</span>
          <h1 style={styles.heroTitle}>Privacy Policy</h1>
          <p style={styles.heroSub}>
            Effective Date: October 1, 2026 | Last Updated: October 2026
          </p>
          <p style={styles.heroDescription}>
            At Jos Pulse, we respect your privacy and are committed to protecting your personal data, payment transactions, and account security under Nigerian Data Protection Regulations (NDPR) and international standards.
          </p>
        </div>
      </header>

      {/* 3. MAIN CONTENT LAYOUT */}
      <div style={styles.contentContainer}>
        {/* SIDEBAR NAVIGATION */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarSticky}>
            <h4 style={styles.sidebarTitle}>Policy Sections</h4>
            <nav style={styles.sidebarNav}>
              {[
                { id: 'data-collection', label: '1. Information We Collect' },
                { id: 'data-usage', label: '2. How We Use Your Data' },
                { id: 'transactions', label: '3. Booking & Payment Security' },
                { id: 'subscriptions', label: '4. Email & Marketing Preferences' },
                { id: 'data-sharing', label: '5. Data Sharing & Third Parties' },
                { id: 'user-rights', label: '6. Your NDPR Data Rights' },
                { id: 'contact-us', label: '7. Data Protection Officer' }
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

        {/* POLICY DOCUMENT BODY */}
        <main style={styles.policyBody}>
          <section id="data-collection" style={styles.policySection}>
            <h2 style={styles.sectionHeading}>1. Information We Collect</h2>
            <p style={styles.paragraph}>
              We collect information that you provide directly to us when creating an account, booking a local tour, purchasing event tickets, or claiming a business listing in Plateau State.
            </p>
            <ul style={styles.bulletList}>
              <li><strong>Account Profile Data:</strong> Full name, email address, phone number, and account password hashes.</li>
              <li><strong>Transaction Data:</strong> Event ticket orders, local guide reservations, voucher reference numbers, and billing contact details.</li>
              <li><strong>Business Owner Verification:</strong> CAC documentation, utility proofs, and venue management details uploaded via the Vendor Portal.</li>
              <li><strong>Technical Data:</strong> IP address, device browser type, and location telemetry used for localized event recommendations across Jos and Bukuru.</li>
            </ul>
          </section>

          <section id="data-usage" style={styles.policySection}>
            <h2 style={styles.sectionHeading}>2. How We Use Your Data</h2>
            <p style={styles.paragraph}>
              Your information is strictly processed to power tourism services, deliver electronic QR passes, and ensure platform safety. Specifically, we use your data to:
            </p>
            <ul style={styles.bulletList}>
              <li>Generate and deliver scannable electronic QR vouchers for events and guided tours.</li>
              <li>Facilitate instant WhatsApp/email updates regarding booking confirmations or event itinerary changes.</li>
              <li>Verify authentic venue ownership for business listings across Rayfield, Shere Hills, and central Jos.</li>
              <li>Prevent ticket fraud, unauthorized voucher duplication, and platform abuse.</li>
            </ul>
          </section>

          <section id="transactions" style={styles.policySection}>
            <h2 style={styles.sectionHeading}>3. Booking & Payment Security</h2>
            <p style={styles.paragraph}>
              Jos Pulse prioritizes bank-grade security for all financial transactions. Payment processing is integrated with regulated gateways (Paystack / Flutterwave).
            </p>
            <div style={styles.calloutBox}>
              <strong style={{ color: '#F97316', display: 'block', marginBottom: '6px' }}>🔒 Zero Payment Card Retention</strong>
              <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                Jos Pulse <strong>never stores or logs raw credit/debit card details, PINs, or CVVs</strong> on our servers. All transaction payloads are encrypted using 256-bit SSL/TLS protocols and transmitted directly to PCI-DSS compliant payment infrastructure.
              </p>
            </div>
          </section>

          <section id="subscriptions" style={styles.policySection}>
            <h2 style={styles.sectionHeading}>4. Email & Marketing Preferences</h2>
            <p style={styles.paragraph}>
              When you register or purchase tickets, you may opt into the <em>Weekly Jos Pulse Digest</em> highlighting weekend hikes, nightlife events, and dining spots.
            </p>
            <ul style={styles.bulletList}>
              <li>You can opt out of marketing communications at any time by clicking the <strong>"Unsubscribe"</strong> link at the bottom of any email.</li>
              <li>Essential transactional emails (such as ticket delivery and booking receipts) will continue to be sent regardless of marketing subscription status.</li>
            </ul>
          </section>

          <section id="data-sharing" style={styles.policySection}>
            <h2 style={styles.sectionHeading}>5. Data Sharing & Third Parties</h2>
            <p style={styles.paragraph}>
              We do not sell, rent, or trade your personal data to third-party advertisers. Limited data sharing occurs solely to fulfill requested tourism services:
            </p>
            <ul style={styles.bulletList}>
              <li><strong>Certified Tour Guides & Event Hosts:</strong> Your name and contact phone number are shared with your assigned Plateau State guide or event organizer to facilitate check-in.</li>
              <li><strong>Payment Processors:</strong> Transaction totals and billing details are sent via secure API to complete ticket payments.</li>
            </ul>
          </section>

          <section id="user-rights" style={styles.policySection}>
            <h2 style={styles.sectionHeading}>6. Your NDPR Data Rights</h2>
            <p style={styles.paragraph}>
              Under the Nigerian Data Protection Regulation (NDPR), users residing in Nigeria or accessing Jos Pulse globally retain full control over their personal data:
            </p>
            <div style={styles.rightsGrid}>
              <div style={styles.rightCard}>
                <strong>Right to Access</strong>
                <p style={styles.rightCardText}>Request a complete copy of all personal records and ticket history stored on Jos Pulse.</p>
              </div>
              <div style={styles.rightCard}>
                <strong>Right to Rectification</strong>
                <p style={styles.rightCardText}>Update or correct inaccurate profile details directly from your account settings.</p>
              </div>
              <div style={styles.rightCard}>
                <strong>Right to Erasure ("Right to be Forgotten")</strong>
                <p style={styles.rightCardText}>Request full deletion of your user account and historical transaction records.</p>
              </div>
            </div>
          </section>

          <section id="contact-us" style={styles.policySection}>
            <h2 style={styles.sectionHeading}>7. Data Protection Officer</h2>
            <p style={styles.paragraph}>
              If you have any questions, data access requests, or privacy concerns regarding Jos Pulse, please reach out directly to our legal team:
            </p>
            <div style={styles.contactCard}>
              <p style={{ margin: '0 0 6px', fontWeight: 'bold' }}>Jos Pulse Data Protection Office</p>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748B' }}>📍 Jos Tech Hub, Rayfield Road, Jos, Plateau State, Nigeria</p>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748B' }}>✉️ privacy@jospulse.ng</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>📞 +234 800 JOS PULSE</p>
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
            <a href="/privacy" style={styles.footerLinkActiveText}>Privacy Policy</a>
            <a href="/terms" style={styles.footerLink}>Terms of Service</a>
            <a href="/contact" style={styles.footerLink}>Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// INLINE STYLES MATCHING JOS PULSE DESIGN SYSTEM (#0F172A Dark Slate & #F97316 Brand Orange)
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
  policyBody: { backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  policySection: { marginBottom: '40px', scrollMarginTop: '120px' },
  sectionHeading: { fontSize: '20px', fontWeight: 'bold', color: '#0F172A', margin: '0 0 16px', borderBottom: '2px solid #F1F5F9', paddingBottom: '8px' },
  paragraph: { fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: '0 0 16px' },
  bulletList: { paddingLeft: '20px', fontSize: '14px', color: '#475569', lineHeight: '1.8' },
  calloutBox: { backgroundColor: '#FFF7ED', borderLeft: '4px solid #F97316', padding: '16px 20px', borderRadius: '0 8px 8px 0', marginTop: '16px' },
  rightsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' },
  rightCard: { padding: '16px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' },
  rightCardText: { margin: '6px 0 0', fontSize: '12px', color: '#64748B', lineHeight: '1.5' },
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