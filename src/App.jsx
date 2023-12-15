import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import Admin from "./pages/adminPage";


function App() {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "HealthChainX";
        metaDescription = "Electronic Health Care System.";
        break;
      case "/admin":
        title = "Admin Dashboard";
        metaDescription = "Electronic Health Care System's Admin Dashboard.";
        break;
      default:
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  const [showLandingPage, setShowLandingPage] = useState(true);

  const handleShowAdminPageClick = () => {
    setShowLandingPage(false); // Hide the Home component
  };

  const handleBackToLandingPageClick = () => {
    setShowLandingPage(true); // Show the LandingPage component
  };

  return (
    <div>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={showHome ? <Home /> : null} exact />
     
=======
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            showLandingPage ? (
              <LandingPage onShowAdminPageClick={handleShowAdminPageClick} />
            ) : (
              <Admin onBackToLandingPageClick={handleBackToLandingPageClick} />
            )
          }
        />
>>>>>>> anis-beta
      </Routes>
    </div>
  );
}

export default App;
