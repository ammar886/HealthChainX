import { Button } from "@mui/material";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-child">
        <div className="about-us-shape" />
        <img className="about-us-image" alt="" src="/Assests/doctor-1@2x.png" />
      </div>
      <div className="about-us-child">
        <div className="about-us-title">About Us</div>
        <h1 className="about-us-sub-title">we help your health</h1>
        <div className="about-us-paragraph">
          This profile describes the activities of health services and medical
          support as well as the facilities and conditions of the General
          Hospital which is reflected in the general public served from all
          groups, religions and beliefs, ethnicity and the level and frequency
          of bed occupancy which continues to increase significantly.
        </div>
        <Button
          sx={{ width: 216 }}
          color="primary"
          variant="contained"
        >
          more about us
        </Button>
      </div>
    </div>
  );
};

export default AboutUs;
