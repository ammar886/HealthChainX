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

const muiTheme = createTheme();

function landingPage({ onShowAdminPageClick }) {
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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div>
          <Navbar onLoginClick={handleLoginClick} />
          <Routes>
            <Route path="/" element={showHome ? <Home /> : null} exact />
          </Routes>
          {showLogin && <Login onClose={handleCloseLogin} onLogin={onShowAdminPageClick} />}
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default landingPage;
