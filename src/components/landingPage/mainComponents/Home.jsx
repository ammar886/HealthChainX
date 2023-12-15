import React, { lazy, Suspense } from "react";
import Hero from "../subComponents/Hero";
import "./Home.css";

const Footer = lazy(() => import("../subComponents/Footer"));
const Testimonials = lazy(() => import("../subComponents/Testimonials"));
const OurDoctors = lazy(() => import("../subComponents/OurDoctors"));
const AboutUs = lazy(() => import("../subComponents/AboutUs"));
const OurServices = lazy(() => import("../subComponents/OurServices"));

const Home = () => {
  return (
    <div className="grid">
      <div className="grid-child">
        <Suspense fallback={<div>Loading...</div>}>
          <Hero />
        </Suspense>
      </div>
      <div>
        <OurServices />
      </div>
      <div>
        <AboutUs />
      </div>
      <div>
        <OurDoctors />
      </div>
      <div>
        <Testimonials />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default React.memo(Home);
