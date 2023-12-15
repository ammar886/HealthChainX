import React from "react";
import { Button } from "@mui/material";
import "./Navbar.css";

const Navbar = ({ onLoginClick }) => {
  return (
    <div className="navbar">
      <div className="lr-col">
        <b className="navbar-logo">
          Health
          <span className="second-half">ChainX.</span>
        </b>
      </div>

      <div className="middle-col">
        <a href="#">Service</a>
        <a href="#">Home</a>
        <a href="#">About</a>
      </div>

      <div className="lr-col">
        <Button
          className="nav-btn"
          sx={{ width: 200 }}
          color="primary"
          variant="outlined"
          onClick={onLoginClick} // Trigger the parent component's state change
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Navbar;