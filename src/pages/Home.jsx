import React, { lazy, Suspense } from "react";
import Hero from "../components/Hero";
import "./Home.css";

const Footer = lazy(() => import("../components/Footer"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const OurDoctors = lazy(() => import("../components/OurDoctors"));
const AboutUs = lazy(() => import("../components/AboutUs"));
const OurServices = lazy(() => import("../components/OurServices"));

const Home = () => {
  return (
    <div className="grid">
      <div className="gridChild">
        <Suspense fallback={<div>Loading...</div>}>
          <Hero />
        </Suspense>
      </div>
      <div className="gridChild">
        <OurServices />
      </div>
      <div className="gridChild">
        <AboutUs />
      </div>
      <div className="gridChild">
        <OurDoctors />
      </div>
      <div className="gridChild">
        <Testimonials />
      </div>
      <div className="gridChild">
        <Footer />
      </div>
    </div>
  );
};

export default React.memo(Home);
