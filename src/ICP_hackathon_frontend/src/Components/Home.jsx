import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img className='all-images' src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Discover, Reserve, and Enjoy Unforgettable Events!
          </h1>
          <p className="primary-text">
            <span className="quote-mark">"</span>
              Let Us Handle the Details: From Ticketing to Seating, We Make Your Event Experience Effortless!
            <span className="quote-mark">"</span>
          </p>
          <button className="secondary-button">
            Create Event <FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img className='all-images' src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
