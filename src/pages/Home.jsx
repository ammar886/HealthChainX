import { Button } from "@mui/material";
import React, { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import "./Home.css";

const Footer = lazy(() => import("../components/Footer"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const OurDoctors = lazy(() => import("../components/OurDoctors"));
const AboutUs = lazy(() => import("../components/AboutUs"));
const OurServices = lazy(() => import("../components/OurServices"));

const Home = () => {
  return (
    <div className="home">
      <div className="home-child" />
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
        <Testimonials />
        <OurDoctors />
        <AboutUs />
        <OurServices />
      </Suspense>
      <img className="image-hero-icon" alt="" src="/Assests/image-hero@2x.png" />
      <section className="title-hero">
        <div className="title-hero-child" />
        <Button
          className="btn-check-now"
          sx={{ width: 200 }}
          color="primary"
          variant="contained"
        >
          Check Now
        </Button>
        <h1 className="we-care-about">we care about your health</h1>
        <div className="check-now-your">
          check now your healty with our profesional doctor, completed and
          modern fasilities services
        </div>
        <img className="title-hero-item" alt="" src="/Assests/polygon-1.svg" />
        <img className="title-hero-inner" alt="" src="/Assests/polygon-2.svg" />
      </section>
      <Navbar />
    </div>
  );
};

export default React.memo(Home);
