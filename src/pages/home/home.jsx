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
        <h2>Contact Me</h2>
        <p>Reach out with any questions or ideas and let's make the magic happen.</p>
        <div className="contact-container">
          <form action="https://api.web3forms.com/submit" method="POST" className="contact-form" id="contact-form" value="Contact Form From Personal Portfolio">
            <input type="hidden" name="access_key" value="bd3b1db0-a150-4eb9-8c61-27249b4f0d98" />
            <input id="name" type="text" name="name" placeholder="Enter Your Name" />
            <input id="email" type="email" name="email" placeholder="Enter Your Email" />
            <input type="tel" id="phone" name="phone" placeholder="Enter Your Phone Number" />
            <input id="subject" type="text" name="subject" placeholder="Enter Subject" />
            <textarea id="message" name="message" placeholder="Enter Your Message"></textarea>
            <button id="submit" className="btn">Submit</button>
          </form>
        </div>
      </section>

      <footer>
        <p>&copy; {new Date().getFullYear()} JustMalikBeats. Developed by ZackFullStack</p>
      </footer>
    </>
    
  );
}
export default Home;