import React from "react";
import { Link } from "react-router-dom";
import './home.css';
import css from '/src/assets/css/style.module.css';

function Home() {
  return (
    <>
      <div className="hero" id="home">
        <h1>Welcome to JustMalikBeats</h1>
        <p>Where Denver's Sound Comes Alive</p>
        <p>Discover beats that capture the energy of the Mile High City</p>
      </div>
      <main className={css.main}>
        <div className={css.content}>
          <section className="about" id="about">
            <div className="about-content">
              <div className="p-content">
                <h2>JustMalikBeats</h2>
                <h3>Music Producer From Denver, Colorado</h3>
                <p>Creating beats that capture the essence of the Mile High City's vibrant music scene. My sound blends the energy of Denver's underground hip-hop culture with atmospheric melodies inspired by Colorado's stunning landscapes.
                </p>
                <p>From late-night studio sessions to collaborating with local artists, I'm passionate about pushing the boundaries of what Denver music can be. Each track tells a story, each beat carries the spirit of this incredible city we call home.
                </p>
              </div>
            </div>
          </section>
        </div>

          <aside className={css.sidebar}>
            <div className={css.sidebarWidget}>
              <h3>About Me</h3>
              <div className={css.aboutWidget}>
                <img src="/src/assets/icons/MALIKBEATSLOGO.jpg" alt="JustMalikBeats" className={css.authorAvatar} />
                <p>Music Producer from Denver, creating beats that capture the essence of the Mile High City's vibrant music scene.</p>
              </div>
            </div>

            <div className={css.sidebarWidget}>
              <h3>Follow Me</h3>
              <div className={css.socialLinks}>
                <a href="https://open.spotify.com/artist/31qEeNT1N54KjOMpPh3OmA" target="_blank" rel="noopener noreferrer"><img src="/src/assets/icons/spotify.png" alt="Spotify" /></a>
                <a href="https://www.youtube.com/@JustMalikBeats" target="_blank" rel="noopener noreferrer"><img src="/src/assets/icons/youtube.png" alt="YouTube" /></a>
                <a href="https://www.instagram.com/justmalikbeats/" target="_blank" rel="noopener noreferrer"><img src="/src/assets/icons/insta.png" alt="Instagram" /></a>
              </div>
            </div>
          </aside>
        </main>
        <div className="gallery" id="gallery">
            <p>Image gallery coming soon...</p>
        </div>

          <section className="music" id="new-releases">
            <h2>Latest Releases</h2>
            <ul>
              <li>Release 1: Description of release 1.</li>
              <li>Release 2: Description of release 2.</li>
              <li>Release 3: Description of release 3.</li>
            </ul>
          </section>

          <section className="music" id="top-tracks">
            <h2>Buy Music</h2>
            <ul>
              <li>Track 1: Description of track 1.</li>
              <li>Track 2: Description of track 2.</li>
              <li>Track 3: Description of track 3.</li>
              <li>Track 4: Description of track 4.</li>
              <li>Track 5: Description of track 5.</li>
              <li>Track 6: Description of track 6.</li>
              <li>Track 7: Description of track 7.</li>
              <li>Track 8: Description of track 8.</li>
              <li>Track 9: Description of track 9.</li>
              <li>Track 10: Description of track 10.</li>
              <li>Track 11: Description of track 11.</li>
              <li>Track 12: Description of track 12.</li>
              <li>Track 13: Description of track 13.</li>
              <li>Track 14: Description of track 14.</li>
              <li>Track 15: Description of track 15.</li>
              <li>Track 16: Description of track 16.</li>
              <li>Track 17: Description of track 17.</li>
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