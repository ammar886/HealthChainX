import { Button } from "@mui/material";
import "./Testimonials.css";

const Testimonials = () => {
  return (
    <div className="testimonial-container">
      <div className="testimonials-title">Testimonials</div>
      <div className="testimonials-paragraph">
        what they say after visiting our hospital
      </div>

      <div className="testimonial-comment-container">
        <div className="testimonial-comment">
          <img
            className="testimonial-comment-image"
            alt=""
            src="/Assests/mask-group@2x.png"
          />
          <div className="testimonial-comment-info">
            <div className="testimonial-comment-name">John doe</div>
            <div className="testimonial-comment-paragraph">
              The service I felt was very good, the staff and doctors were
              friendly and provided very clear information.
            </div>
            <div className="stars">
              <img className="vector-icon1" alt="" src="/Assests/vector1.svg" />
              <img className="vector-icon1" alt="" src="/Assests/vector2.svg" />
              <img className="vector-icon1" alt="" src="/Assests/vector3.svg" />
              <img className="vector-icon1" alt="" src="/Assests/vector4.svg" />
              <img className="vector-icon1" alt="" src="/Assests/vector5.svg" />
            </div>
          </div>
        </div>
        <div className="testimonial-comment">
          <img
            className="testimonial-comment-image"
            alt=""
            src="/Assests/mask-group1@2x.png"
          />
          <div className="testimonial-comment-info">
            <div className="testimonial-comment-name">John doe</div>
            <div className="testimonial-comment-paragraph">
              The service I felt was very good, the staff and doctors were
              friendly and provided very clear information.
            </div>
            <div className="stars">
              <img className="vector-icon1" alt="" src="/Assests/vector1.svg" />
              <img className="vector-icon1" alt="" src="/Assests/vector2.svg" />
              <img className="vector-icon1" alt="" src="/Assests/vector3.svg" />
              <img className="vector-icon1" alt="" src="/Assests/vector4.svg" />
              <img className="vector-icon1" alt="" src="/Assests/vector5.svg" />
            </div>
          </div>
        </div>
      </div>

      <div className="contact-us-form">
        <div className="contact-us-child-1">
          <div className="contact-us-form-heading">
            Let's consult your health with our doctor
          </div>
          <div className="contact-us-form-heading-paragraph">
            we will provide the best service.
          </div>
        </div>
        <div className="contact-us-child-2">
          <Button
            className="contact-us-btn"
            sx={{ width: 216 }}
            color="primary"
            variant="contained"
          >
            Contact us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
