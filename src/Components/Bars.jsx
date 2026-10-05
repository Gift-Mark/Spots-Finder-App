import { useState } from 'react';
import { JOS_BARS_DIRECTORY } from './barsData';

export default function BarsDirectoryPage() {
  const [selectedSubCat, setSelectedSubCat] = useState('All Bars');

  const subCategories = [
    'All Bars',
    'Commercial Bars & Pubs',
    'Bush Bars & Open-Air Joints',
    'Hotel & Restaurant Bars'
  ];

  const filteredBars = JOS_BARS_DIRECTORY.filter((bar) => {
    if (selectedSubCat === 'All Bars') return true;
    return bar.subCategory === selectedSubCat;
  });

  return (
    <div className="bars-directory-container">
      <h2>Bars & Pubs in Jos</h2>

      {/* Sub-Category Pill Filters */}
      <div className="sub-category-pills" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {subCategories.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubCat(sub)}
            className={`pill-btn ${selectedSubCat === sub ? 'active' : ''}`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* List / Grid Display */}
      <div className="bars-grid">
        {filteredBars.map((bar) => (
          <div key={bar.id} className="bar-card">
            <span className="badge">{bar.subCategory}</span>
            <h3>{bar.name}</h3>
            <p>📍 {bar.address} ({bar.neighborhood})</p>
            <p>🕒 {bar.openingHours}</p>
            <p>✨ <em>{bar.vibe}</em></p>
            <div className="tags">
              {bar.popularFor.map((item, idx) => (
                <span key={idx} className="tag">#{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}