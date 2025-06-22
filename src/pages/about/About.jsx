import React from 'react';
import css from '/src/assets/css/style.module.css';

function About() {
  return (
    <div className={css.about}>
      <h1>About Us</h1>
      <p>This is the about page of our application.</p>
      <p>Here you can find information about our team and mission.</p>
      <p>We are dedicated to providing the best service possible.</p>
    </div>
  );
}
export default About;