import { lazy, Suspense, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import BottomNav from "./Components/BottomNav";

// Load route screens on demand so the initial bundle does not include every page.
const Explore = lazy(() => import("./Explore"));
const Discover = lazy(() => import("./discover"));
const Culture = lazy(() => import("./culture"));
const Profile = lazy(() => import("./profile").then(({ Profile }) => ({ default: Profile })));
const Map = lazy(() => import("./map"));
const Feed = lazy(() => import("./feed").then(({ Feed }) => ({ default: Feed })));
const PlaceDetails = lazy(() => import("./pages/PlaceDetails"));
const Login = lazy(() => import("./Login").then(({ Login }) => ({ default: Login })));
const Register = lazy(() => import("./Register").then(({ Register }) => ({ default: Register })));
const MainAnalyticsDashboard = lazy(() => import("./Main Analytics Dashboard"));
const ModerationDashboard = lazy(() => import("./ModerationDashboard"));
const CreateHotSpot = lazy(() => import("./CreateHotspot"));
const HotSpotManagement = lazy(() => import("./HotSpotManagement"));

// Admin pages share one guard so regular users cannot access management tools.
const ProtectedRoute = ({children}) => {
      const isAdmin = localStorage.getItem('userRole') === 'admin';

      if (!isAdmin){
        return <Navigate to="/login" replace />;
      }
      return children;
    };

function App() {
  // The selected tab controls which primary user view is rendered.
  const [activeTab, setActiveTab] = useState("home");

  const renderPage = () => {
    switch (activeTab) {
      case "map":
        return <Map />;
      case "feed":
        return <Feed />;
      case "profile":
        return <Profile />;
      default:
        return <Discover />;
    }
  };

  const location = useLocation();

  // Authentication and admin screens use their own layouts without bottom navigation.
  const hideBottomNav =
  location.pathname === "/" ||
    location.pathname === "/login" || 
    location.pathname === "/register" || 
    location.pathname === "/dashboard" || 
    location.pathname === "/moderationDashboard" || location.pathname.startsWith === "/adminDashboard" || 
    location.pathname === "/management";

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
        <Route path="/" element={<Register />} />
        <Route 
        path="/adminDashboard" 
        element={
        
          <CreateHotSpot />
          
        } />
        <Route path="/adminDashboard/edit/:id" 
        element={
          <ProtectedRoute>
            <CreateHotSpot />
          </ProtectedRoute>
        } />
        <Route
          path="/management"
          element={
            <HotSpotManagement />
          }
        />
        <Route path="/explore" element={<Explore />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/dashboard" element={<MainAnalyticsDashboard />} />
        <Route path="/ModerationDashboard" element={<ModerationDashboard />} />
        <Route path="/discover" element={renderPage()} />
        <Route path="/place/:slug" element={<PlaceDetails />} />
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
