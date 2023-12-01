import React, { useLayoutEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';


function App() {
  const location = useLocation();
  const pathname = location.pathname;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useLayoutEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
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

  const [showHome, setShowHome] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowHome(false); // Hide the Home component
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowHome(true); // Show the Home component
    setShowLogin(false);
  };

  return (
    <div>
      <Navbar onLoginClick={handleLoginClick} />
      <Routes>
        <Route path="/" element={showHome ? <Home /> : null} exact />
     
      </Routes>
      {showLogin && <Login onClose={handleCloseLogin} />}
    </div>
  );
}

export default App;