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
    <div className="footer-container">
      <div className="footer-child-1">
        <b className="footer-logo">
          Health
          <span className="second-half">ChainX.</span>
        </b>
        <div className="footer-child-1-paragraph">
          Our hospital tries to answer the challenges in the community's need
          for quality dental health services but still affordable by a wide
          audience.
        </div>
        <div className="footer-child-1-icons">
          <img className="footer-icons" alt="" src="/Assests/twitterfill.svg" />
          <img
            className="footer-icons"
            alt=""
            src="/Assests/instagramfilled.svg"
          />
          <img className="footer-icons" alt="" src="/Assests/linkedinin.svg" />
          <img
            className="footer-icons"
            alt=""
            src="/Assests/youtubefilled.svg"
          /> 
          <img className="footer-icons" alt="" src="/Assests/vector.svg" />
          <img className="footer-icons" alt="" src="/Assests/behancefill.svg" />
        </div>
      </div>

      <div className="footer-child-2">
        <div className="footer-child-2-heading">Menus</div>
        <a href="#">Home</a>
        <a href="#">Service</a>
        <a href="#">About</a>
      </div>

      <div className="footer-child-3">
        <div className="footer-child-3-heading">Get Medical Checkup Voucher</div>
        <TextField
          className="footer-textfield"
          color="primary"
          required={true}
          placeholder="Enter Your Email"
          sx={{ width: 416 }}
          variant="filled"
        />
        <Button
          className="footer-btn"
          sx={{ width: 216 }}
          color="primary"
          variant="contained"
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
};

export default Footer;
