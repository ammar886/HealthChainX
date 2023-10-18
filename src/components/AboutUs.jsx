import { Button } from "@mui/material";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <section className="about-us" id="aboutus">
      <div className="about-us-child" />
      <Button
        className="btn-about-us2"
        sx={{ width: 216 }}
        color="primary"
        variant="contained"
      >
        more about us
      </Button>
      <div className="about-us-item" />
      <img
        className="doctor-1-icon"
        alt=""
        src="/Assests/doctor-1@2x.png"
      />
      <div className="about-us1">About Us</div>
      <div className="this-profile-describes">
        This profile describes the activities of health services and medical
        support as well as the facilities and conditions of the General Hospital
        which is reflected in the general public served from all groups,
        religions and beliefs, ethnicity and the level and frequency of bed
        occupancy which continues to increase significantly.
      </div>
      <h1 className="we-help-your">we help your health</h1>
    </section>
  );
};

export default AboutUs;
