import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import JosPulseAI from "./Components/JosPulseAI";

// Load route screens on demand so the initial bundle does not include every page.
const Discover = lazy(() => import("./discover"));
const Culture = lazy(() => import("./culture"));
const Golf = lazy(() => import("./Golf"));
const EventsPage = lazy(() => import("./EventsPage"));
const NightlifePage = lazy(() => import("./Nightlife")); 
const LoungesPage = lazy(() => import("./LoungesPage"));
const DiningPage = lazy(() => import("./DiningPage"));
const FlightBookingPage = lazy(() => import("./pages/Flight_booking"));
const VendorDashboard = lazy(() => import("./VendorDashboard"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));
const Login = lazy(() => import("./Login").then(({ Login }) => ({ default: Login })));
const Register = lazy(() => import("./Register").then(({ Register }) => ({ default: Register })));

// Lazy-load PlaceDetail (Spot Details) page
const PlaceDetail = lazy(() => 
  import("./pages/PlaceDetailPage").then((module) => ({
    default: module.PlaceDetailPage || module.default
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
          <Route path="/events" element={<EventsPage />} />
          <Route path="/nightlife" element={<NightlifePage />} />
          <Route path="/lounges" element={<LoungesPage />} />
          <Route path="/dining" element={<DiningPage />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/SuperAdmin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dynamic route for all spot/place detail views */}
          <Route path="/place/:id" element={<PlaceDetail />} />

          {/* Flight Booking Page */}
          <Route path="/flights" element={<FlightBookingPage />} />
        </Routes>
      </Suspense>
      <JosPulseAI />
    </>
  );
}

export default App;