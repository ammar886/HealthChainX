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
