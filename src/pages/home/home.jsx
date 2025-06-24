import React from "react";
import './home.css';

function Home() {
  return (
    <>
      <header>
        <div className="logo">
          <img src="/src/assets/icons/MALIKBEATSLOGO.jpg" alt="JustMalikBeats-Logo" />
          <h1>JustMalikBeats</h1>
        </div>
        
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#music">Music</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero" id="home">
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of our application.</p>
        <p>Feel free to explore the features and functionalities we offer.</p>
      </section>

      <div className="links">
        <a href="https://open.spotify.com/artist/31qEeNT1N54KjOMpPh3OmA"><img src="/src/assets/icons/spotify.png" alt="Spotify" /></a>
        <a href="https://www.youtube.com/@JustMalikBeats"><img src="/src/assets/icons/youtube.png" alt="YouTube" /></a>
        <a href="https://www.instagram.com/justmalikbeats/"><img src="/src/assets/icons/insta.png" alt="Insta" /></a>
      </div>

      <section className="about" id="about">
        <h2>About Us</h2>
        <p>This section contains information about our application.</p>
      </section>

      <section className="img" id="img">
        <img src="" alt="" />
        <p>img</p>
      </section>

      <section className="music" id="music">
        <h2>Music</h2>
        <ul>
          <li>Track 1: Description of track 1.</li>
          <li>Track 2: Description of track 2.</li>
          <li>Track 3: Description of track 3.</li>
        </ul>
      </section>

      <section className="contact" id="contact">
        <h2>Contact Us</h2>
        <p>If you have any questions or feedback, feel free to reach out to us.</p>
        <p>Email: <a href="mailto:info@example.com">info@example.com</a></p>
      </section>

      <footer>
        <p>&copy; {new Date().getFullYear()} JustMalikBeats. Developed by ZackFullStack</p>
      </footer>
    </>
    
  );
}
export default Home;