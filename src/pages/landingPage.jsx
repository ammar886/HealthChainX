import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme, StyledEngineProvider } from "@mui/material";
import Navbar from "../components/landingPage/Navbar";
import Home from "../components/landingPage/Home";
import Login from "../components/landingPage/Login";
import Signup from "../components/landingPage/Signup";

const muiTheme = createTheme();

function LandingPage() {
  const [isNavBar, setIsNavBar] = useState(true);
  const [showHome, setShowHome] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginClick = () => {
    setShowHome(false);
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowHome(false);
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleCloseForm = () => {
    setShowHome(true);
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div>
          <Navbar isNavBar={isNavBar} setIsNavBar={setIsNavBar} onLoginClick={handleLoginClick} />
          {showHome && <Home />}
          <Routes>
            <Route path="login" element={showLogin ? <Login onCloseIcon={handleCloseForm} onSignupButton={handleSignupClick} /> : null} />
            <Route path="signup" element={showSignup && <Signup onCloseIcon={handleCloseForm} onLoginButton={handleLoginClick} />} />
          </Routes>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default LandingPage;