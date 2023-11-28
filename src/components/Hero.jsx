import { Button } from "@mui/material";
import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero-container">

      <div className="hero-child">
        <div className="hero-background" />
        <img className="hero-svg-1" alt="" src="/Assests/polygon-1.svg" />
        <h1 className="hero-heading">we care about your health</h1>
        <div className="hero-paragraph">
          check now your healty with our profesional doctor, completed and
          modern fasilities services
        </div>
        <Button
          className="hero-button"
          sx={{ width: 200 }}
          color="primary"
          variant="contained"
        >
          Check Now
        </Button>
        <img className="hero-svg-2" alt="" src="/Assests/polygon-2.svg" />
      </div>

      <div className="hero-child">
        <img
          className="hero-image"
          alt=""
          src="/Assests/image-hero@2x.png"
        />
      </div>

    </div>
  );
};

export default Hero;
