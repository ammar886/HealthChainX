import React from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLoginClick }) => {

  const navigate = useNavigate();
  const handleLoginClick = () => {
    onLoginClick();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="lr-col">
        <b className="navbar-logo">
          Health
          <span className="second-half">ChainX.</span>
        </b>
      </div>

      <div className="middle-col">
        <Link to="#">Home</Link>
        <Link to="#">Service</Link>
        <Link to="#">About</Link>
      </div>

      <div className="lr-col">
        <Button
          className="nav-btn"
          sx={{ width: 200 }}
          color="primary"
          variant="outlined"
          onClick={handleLoginClick}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
