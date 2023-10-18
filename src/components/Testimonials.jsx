import { Button } from "@mui/material";
import "./Testimonials.css";

const Testimonials = () => {
  return (
    <section className="testimonial" id="testimonials">
      <div className="testimonial-child" />
      <div className="action-contact-us">
        <div className="action-contact-us-child" />
        <Button
          className="btn-about-us1"
          sx={{ width: 216 }}
          color="primary"
          variant="contained"
        >
          Contact us
        </Button>
        <div className="we-will-provide">we will provide the best service.</div>
        <h1 className="lets-consult-your">
          Let's consult your health with our doctor
        </h1>
      </div>
      <h1 className="what-they-say">
        what they say after visiting our hospital
      </h1>
      <div className="testimonials">Testimonials</div>
      <div className="testi-1">
        <img className="mask-group-icon" alt="" src="/Assests/mask-group@2x.png" />
        <div className="testi-1-child" />
        <div className="the-service-i">
          The service I felt was very good, the staff and doctors were friendly
          and provided very clear information.
        </div>
        <b className="john-doe">John doe</b>
        <div className="stars">
          <img className="vector-icon1" alt="" src="/Assests/vector1.svg" />
          <img className="vector-icon1" alt="" src="/Assests/vector2.svg" />
          <img className="vector-icon1" alt="" src="/Assests/vector3.svg" />
          <img className="vector-icon1" alt="" src="/Assests/vector4.svg" />
          <img className="vector-icon1" alt="" src="/Assests/vector5.svg" />
        </div>
      </div>
      <div className="testi-2">
        <img className="mask-group-icon1" alt="" src="/Assests/mask-group1@2x.png" />
        <div className="testi-1-child" />
        <div className="the-service-i">
          The service I felt was very good, the staff and doctors were friendly
          and provided very clear information.
        </div>
        <b className="john-doe">John doe</b>
        <div className="stars1">
          <img className="vector-icon1" alt="" src="/Assests/vector1.svg" />
          <img className="vector-icon1" alt="" src="/Assests/vector2.svg" />
          <img className="vector-icon1" alt="" src="/Assests/vector3.svg" />
          <img className="vector-icon1" alt="" src="/Assests/vector4.svg" />
          <img className="vector-icon1" alt="" src="/Assests/vector5.svg" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
