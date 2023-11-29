import "./OurServices.css";

const OurServices = () => {
  return (
    <div className="services-container">
      <div className="our-services-title">Our Services</div>
      <div className="our-services-paragraph">
        4 step easy we care your health
      </div>
      <div className="our-services">
        <div className="services-child">
          <img
            className="services-child-icon"
            alt=""
            src="/Assests/doctor-2@2x.png"
          />
          <div className="services-child-title">Doctor</div>
          <div className="services-child-paragraph">
            And choose doctor to check
          </div>
        </div>
        <div className="services-child">
          <img
            className="services-child-icon"
            alt=""
            src="/Assests/healthcare-2@2x.png"
          />
          <div className="services-child-title">Poly</div>
          <div className="services-child-paragraph">
            choose what Poly to check
          </div>
        </div>
        <div className="services-child">
          <img
            className="services-child-icon"
            alt=""
            src="/Assests/healthcare-1@2x.png"
          />
          <div className="services-child-title">Date</div>
          <div className="services-child-paragraph">
            choose what date to check
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;