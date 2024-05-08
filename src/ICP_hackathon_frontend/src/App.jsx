import "./index.scss";
import Home from "./Components/Home";
import About from "./Components/About";
import Work from "./Components/Work";
import Testimonial from "./Components/Testimonial";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import EventList from "./Components/EventCard"
// import { useState } from 'react';
// import { ICP_hackathon_backend } from 'declarations/ICP_hackathon_backend';

function App() {
  return (
    <div className="App">
      <Home />
      <About />
      <Work />
      <EventList />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;

