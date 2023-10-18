import "./OurServices.css";

const OurServices = () => {
  return (
    <section className="step-check" id="services">
      <div className="step-check-child" />
      <h1 className="step-easy-we">4 step easy we care your health</h1>
      <div className="our-services">Our Services</div>
      <div className="choose-doctor">
        <div className="choose-doctor-child" />
        <div className="doctor">Doctor</div>
        <div className="and-choose-doctor">And choose doctor to check</div>
        <img className="doctor-2-icon" alt="" src="/Assests/doctor-2@2x.png" />
      </div>
      <div className="choose-poli">
        <div className="choose-doctor-child" />
        <div className="doctor">Poly</div>
        <div className="and-choose-doctor">choose what Poly to check</div>
        <img className="healthcare-2-icon" alt="" src="/Assests/healthcare-2@2x.png" />
      </div>
      <div className="choose-date">
        <div className="choose-doctor-child" />
        <div className="doctor">Date</div>
        <img className="healthcare-1-icon" alt="" src="/Assests/healthcare-1@2x.png" />
        <div className="and-choose-doctor">choose what date to check</div>
      </div>
    </section>
  );
};

export default OurServices;
