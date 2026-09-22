import { lazy, Suspense, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import BottomNav from "./Components/BottomNav";

// Load route screens on demand so the initial bundle does not include every page.
const Discover = lazy(() => import("./discover"));
const Culture = lazy(() => import("./culture"));
const Golf = lazy(() => import("./Golf"));
const EventsPage = lazy(() => import("./EventsPage"));
const NightlifePage = lazy(() => import("./Nightlife")); 
const LoungesPage = lazy(() => import("./LoungesPage"))
const DiningPage = lazy(() => import("./DiningPage"));
const VendorDashboard = lazy(() => import("./VendorDashboard"))
const Login = lazy(() => import("./Login").then(({ Login }) => ({ default: Login })));
const Register = lazy(() => import("./Register").then(({ Register }) => ({ default: Register })));

// Admin pages share one guard so regular users cannot access management tools.

function App() {
  // The selected tab controls which primary user view is rendered.
  const [activeTab, setActiveTab] = useState("home");

  const location = useLocation();

  // Authentication and admin screens use their own layouts without bottom navigation.
  const hideBottomNav =
  location.pathname === "/" ||
    location.pathname === "/nightlife" || 
    location.pathname === "/lounge" || 
    location.pathname === "/dining" || 
    location.pathname === "/golf" || location.pathname === "/culture" || 
    location.pathname === "/explore";

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/explore" element={<Discover />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/golf" element={<Golf />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/nightlife" element={<NightlifePage />} />
        <Route path="/lounges" element={<LoungesPage />} />
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
      

      {!hideBottomNav && (
        <BottomNav activeTab={activeTab} onTabSelect={setActiveTab} />
      )}
    </>
  );
}

export default App;
