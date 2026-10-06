import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Load route screens on demand so the initial bundle does not include every page.
const Discover = lazy(() => import("./discover"));
const Culture = lazy(() => import("./culture"));
const Golf = lazy(() => import("./Golf"));
const EventsPage = lazy(() => import("./EventsPage"));
const NightlifePage = lazy(() => import("./Nightlife")); 
const LoungesPage = lazy(() => import("./LoungesPage"));
const DiningPage = lazy(() => import("./DiningPage"));
const AttractionsPage = lazy(() => import("./Components/AttractionsPage"));
const GuidesPage = lazy(() => import("./Components/Guides"));
const ClaimVenuePage = lazy(() => import("./ClaimVenuePage"));
const StaysPage = lazy(() => import("./Stays"));
const Flights = lazy(() => import("./pages/Flight_booking"));
const PrivacyPage = lazy(() => import("./Privacy"));
const TermsPage = lazy(() => import("./Terms"));
const ContactPage = lazy(() => import("./Contact"));
const VendorDashboard = lazy(() => import("./VendorDashboard"));
const UserDashboard = lazy(() => import("./UserDashboard"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));
const Login = lazy(() => import("./Login").then(({ Login }) => ({ default: Login })));
const Register = lazy(() => import("./Register").then(({ Register }) => ({ default: Register })));

// Lazy-load PlaceDetail (Spot Details) page
const PlaceDetail = lazy(() => 
  import("./pages/PlaceDetail").then((module) => ({
    default: module.PlaceDetail || module.default
  }))
);

function App() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Navigate to="/explore" replace />} />
          <Route path="/explore" element={<Discover />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/golf" element={<Golf />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/nightlife" element={<NightlifePage />} />
          <Route path="/lounges" element={<LoungesPage />} />
          <Route path="/dining" element={<DiningPage />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/stays" element={<StaysPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/claim" element={<ClaimVenuePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<ContactPage />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/SuperAdmin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dynamic route for all spot/place detail views */}
          <Route path="/place/:id" element={<PlaceDetail />} />

        </Routes>
      </Suspense>
    </>
  );
}

export default App;
