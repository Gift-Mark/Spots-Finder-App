import { useState } from 'react';
import AdminSidebar from './Components/AdminSidebar';
import AdminHeader from './Components/AdminHeader';
import PromotedVenuesTable from './Components/PromotedVenuesTable';
import FlaggedContentQueue from './Components/FlaggedContentQueue';
import styles from './CSS/AdminDashboard.module.css';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const handleSignOut = () => {
    alert('Signing out of Admin Terminal...');
  };

  const handleSearch = (query) => {
    console.log('Admin search query:', query);
  };

  const handleNewListing = () => {
    alert('Opening New Promoted Listing Modal...');
  };

  const handleFilter = () => {
    alert('Opening Filter Drawer...');
  };

  const handleGoToModeration = () => {
    alert('Navigating to Moderation Hub...');
  };

  return (
    <div className={styles.adminContainer}>
      {/* Fixed Super Admin Navigation Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSignOut={handleSignOut} 
      />

      {/* Main Content Workspace */}
      <div className={styles.mainWrapper}>
        {/* Top Header */}
        <AdminHeader onSearch={handleSearch} />

        {/* Page Content Workspace */}
        <main className={styles.contentBody}>
          {/* Section Welcome Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Platform Overview</h1>
            <p className={styles.pageSubtitle}>
              Real-time metrics and critical administration tasks for Jos Pulse.
            </p>
          </div>

          {/* Promoted Venue Listings Table */}
          <PromotedVenuesTable 
            onNewListing={handleNewListing} 
            onFilter={handleFilter} 
          />

          {/* Bottom Grid Split: Flagged Content & Quick Actions */}
          <div className={styles.bottomSectionGrid}>
            <FlaggedContentQueue onGoToModeration={handleGoToModeration} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;