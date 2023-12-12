import "./OurDoctors.css";

const OurDoctors = () => {
  return (
    <div className="our-doctors-container">
      <div className="our-doctors-title">Our Doctors</div>
      <div className="our-doctors-paragraph">
        visit our professional specialists
      </div>

      <div className="our-doctors-child">
        <div className="specialist">
          <img
            className="specialist-image"
            alt=""
            src="/Assests/mask-group2@2x.png"
          />
          <div className="specialist-info">
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/facebook.svg"
            />
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/pinterest.svg"
            />
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/dribbbleoutlined.svg"
            />
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/instagramoutlined.svg"
            />
            <div className="our-doctors-name">MUHAMMAD ALI SYAHPUTRA</div>
            <div className="our-doctors-profession">{`Dentist `}</div>
          </div>
        </div>

        <div className="specialist">
          <img
            className="specialist-image"
            alt=""
            src="Assests/mask-group3@2x.png"
          />
          <div className="specialist-info">
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/facebook.svg"
            />
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/pinterest.svg"
            />
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/dribbbleoutlined.svg"
            />
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/instagramoutlined.svg"
            />
            <div className="our-doctors-name">dr. NADYA NAVIRA</div>
            <div className="our-doctors-profession">{`Dentist `}</div>
          </div>
        </div>

        <div className="specialist">
          <img
            className="specialist-image"
            alt=""
            src="/Assests/mask-group4@2x.png"
          />
          <div className="specialist-info">
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/facebook.svg"
            />
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/pinterest.svg"
            />
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/dribbbleoutlined.svg"
            />
            <img
              className="social-media-icon"
              alt=""
              src="/Assests/instagramoutlined.svg"
            />
            <div className="our-doctors-name">ANTONIUS JANSEN</div>
            <div className="our-doctors-profession">{`Pediatric `}</div>
          </div>
        </div>

        <div className="specialist">
          <div className="social-media-icons-group">
            <img
              className="specialist-image"
              alt=""
              src="/Assests/mask-group5@2x.png"
            />
            <div className="specialist-info">
              <img
                className="social-media-icon"
                alt=""
                src="/Assests/facebook.svg"
              />
              <img
                className="social-media-icon"
                alt=""
                src="/Assests/pinterest.svg"
              />
              <img
                className="social-media-icon"
                alt=""
                src="/Assests/dribbbleoutlined.svg"
              />
              <img
                className="social-media-icon"
                alt=""
                src="/Assests/instagramoutlined.svg"
              />
              <div className="our-doctors-name">dr. Moeharman, Sp. THT.KL</div>
              <div className="our-doctors-profession">{`Orthodontist `}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurDoctors;
