import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
} from "@mui/material";
import "./Footer.css";

const Footer = () => {
  return (
    <section className="footer" id="footer">
      <footer className="footer-child" id="footer" />
      <div className="menus">Menus</div>
      <div className="get-medical-checkup">Get Medical Checkup Voucher</div>
      <div className="our-hospital-tries">
        Our hospital tries to answer the challenges in the community's need for
        quality dental health services but still affordable by a wide audience.
      </div>
      <div className="logo">
        <b className="hospital">
          <span>Health</span>
          <span className="pital">ChainX.</span>
        </b>
      </div>
      <a href="#" className="home1">Home</a>
      <a href="#" className="service">Service</a>
      <a href="#" className="about">About</a>
      <div className="group-parent">
        <div className="group-container">
          <div className="rectangle-wrapper">
            <div className="group-child" />
          </div>
          <img
            className="footer-icons"
            alt=""
            src="/Assests/twitterfill.svg"
          />
        </div>
        <div className="group-div">
          <div className="rectangle-wrapper">
            <div className="group-child" />
          </div>
          <img
            className="footer-icons"
            alt=""
            src="/Assests/instagramfilled.svg"
          />
        </div>
        <div className="group-container">
          <div className="group-child" />
          <img
            className="footer-icons"
            alt=""
            src="/Assests/linkedinin.svg"
          />
        </div>
        <div className="group-container">
          <div className="group-child" />
          <img
            className="footer-icons"
            alt=""
            src="/Assests/youtubefilled.svg"
          />
        </div>
        <div className="group-container">
          <div className="group-child" />
          <img className="vector-icon" alt="" src="/Assests/vector.svg" />
        </div>
        <div className="group-container">
          <div className="rectangle-wrapper">
            <div className="group-child" />
          </div>
          <img
            className="footer-icons"
            alt=""
            src="/Assests/behancefill.svg"
          />
        </div>
      </div>
      <TextField
        className="footer-item"
        color="primary"
        required={true}
        placeholder="Enter Your Email"
        sx={{ width: 416 }}
        variant="filled"
      />
      <Button
        className="btn-about-us"
        sx={{ width: 216 }}
        color="primary"
        variant="contained"
      >
        Subscribe
      </Button>
    </section>
  );
};

export default Footer;
