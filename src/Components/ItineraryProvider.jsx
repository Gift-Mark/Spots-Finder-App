// ItineraryProvider.jsx
import { useState, useEffect } from "react";
import { ItineraryContext } from "./itineraryContext";

export function ItineraryProvider({ children }) {
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const saved = localStorage.getItem("plateau_itinerary");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("plateau_itinerary", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const isBookmarked = (id) => bookmarkedIds.includes(id);

  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <ItineraryContext.Provider value={{ bookmarkedIds, isBookmarked, toggleBookmark }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export default ItineraryProvider;