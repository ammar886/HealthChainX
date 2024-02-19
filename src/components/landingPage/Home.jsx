import React, { lazy, Suspense } from "react";
import Hero from "./Hero";
import "./Home.css";

const Footer = lazy(() => import("./Footer"));
const Testimonials = lazy(() => import("./Testimonials"));
const OurDoctors = lazy(() => import("./OurDoctors"));
const AboutUs = lazy(() => import("./AboutUs"));
const OurServices = lazy(() => import("./OurServices"));

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
