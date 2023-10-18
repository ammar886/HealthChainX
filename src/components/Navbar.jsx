import { Button } from "@mui/material";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo1">
        <b className="hospital1">
          <span>Health</span>
          <span className="pital1">ChainX.</span>
        </b>
      </div>
      <div className="nav">
        <a href="#" className="home2">Home</a>
        <a href="#" className="service1">Service</a>
        <a href="#" className="about1">About</a>
      </div>
      <Button
        className="btn-appointment"
        sx={{ width: 200 }}
        color="primary"
        variant="outlined"
      >
        Login
      </Button>
    </div>
  );
};

export default Navbar;
