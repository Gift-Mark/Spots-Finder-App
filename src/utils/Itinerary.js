// ItineraryContext.js
import { createContext, useContext } from "react";

export const ItineraryContext = createContext(null);

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error("useItinerary must be used within an ItineraryProvider");
  }
  return context;
}