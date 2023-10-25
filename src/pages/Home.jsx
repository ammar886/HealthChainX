import React, { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Login from "../components/Login";
import "./Home.css";

const Footer = lazy(() => import("../components/Footer"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const OurDoctors = lazy(() => import("../components/OurDoctors"));
const AboutUs = lazy(() => import("../components/AboutUs"));
const OurServices = lazy(() => import("../components/OurServices"));

const Home = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
        <Navbar />
      </Suspense>
{/*      <Footer />
      <Testimonials />
      <OurDoctors />
      <AboutUs />
      <OurServices />*/}
    </div>
  );
};

export default React.memo(Home);
