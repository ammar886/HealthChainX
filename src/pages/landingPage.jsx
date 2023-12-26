import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
    CssBaseline,
    ThemeProvider,
    createTheme,
    StyledEngineProvider,
  } from "@mui/material";
import Home from "../components/landingPage/mainComponents/Home";
import Navbar from "../components/landingPage/subComponents/Navbar";
import Login from "../components/landingPage/subComponents/Login";
import Signup from "../components/landingPage/subComponents/Signup";

const muiTheme = createTheme();

function landingPage({ onShowAdminPageClick }) {
  const [showHome, setShowHome] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginClick = () => {
    setShowHome(false); // Show the Login component and Hide other Component
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleCloseForm = () => {
    setShowHome(true); // Show the Home component and Hide other Component
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowHome(false); // Show the Signup component and Hide other Component
    setShowSignup(true);
    setShowLogin(false);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div>
          <Navbar onLoginClick={handleLoginClick} />
          <Routes>
            <Route path="/" element={showHome ? <Home /> : null} exact />
          </Routes>
          {showLogin && <Login onCloseIcon={handleCloseForm} onLoginSuccess={onShowAdminPageClick} onSignupButton={handleSignupClick} />}
          {showSignup && <Signup onCloseIcon={handleCloseForm} onLoginButton={handleLoginClick} />}
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default landingPage;
