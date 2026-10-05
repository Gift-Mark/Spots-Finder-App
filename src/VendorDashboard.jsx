import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import VendorSidebar from './Components/VendorSidebar';
import VendorHeader from './Components/VendorHeader';
import VendorStatsRow from './Components/VendorStatsRow';
import VendorEventsTable from './Components/VendorEventsTable';
import PromoteSpotCard from './Components/PromoteSpotCard';
import VendorReviewsSection from './Components/VendorReviewsSection';
import styles from './CSS/VendorDashboard.module.css';

export const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const location = useLocation();
  const vendorUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();
  const claimBusinessName = location.state?.businessName || vendorUser?.businessName;
  const claimConfirmed = location.state?.claimConfirmed || vendorUser?.accountStatus === 'confirmed';

  const handleCreateEvent = () => {
    alert('Opening Create New Event Modal...');
  };

  const handleSubscribePromotion = () => {
    alert('Redirecting to Promotion Plan Payment Gateway...');
  };

  const handleSearch = (query) => {
    console.log('Vendor search query:', query);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Fixed Left Navigation Sidebar */}
      <VendorSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        {/* Top Header */}
        <VendorHeader onSearch={handleSearch} />

        {/* Page Content View */}
        <main className={styles.contentBody}>
          {/* Section Welcome Header & Primary CTA */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Overview</h1>
              <p className={styles.pageSubtitle}>
                {claimConfirmed && claimBusinessName
                  ? `Your business account is confirmed for ${claimBusinessName}. Venue ownership review is pending.`
                  : "Here's what's happening at Rayfield Golf Club today."}
              </p>
            </div>

            <button
              type="button"
              className={styles.createEventBtn}
              onClick={handleCreateEvent}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.btnIcon} />
              <span>Create New Event</span>
            </button>
          </div>

          {/* 4 KPI Analytics Cards Row */}
          <VendorStatsRow />

          {/* Main Content Split: Events Table & Promotion Monetization Card */}
          <div className={styles.middleSectionGrid}>
            <VendorEventsTable />
            <PromoteSpotCard onSubscribe={handleSubscribePromotion} />
          </div>

          {/* Recent Reviews & Community Feedback Section */}
          <VendorReviewsSection />
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;