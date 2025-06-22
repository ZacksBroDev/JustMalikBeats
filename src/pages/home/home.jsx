import React from "react";
import css from '/src/assets/css/style.module.css';

function Home() {
  return (
    <div className={css.home}>
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of our application.</p>
      <p>Feel free to explore the features and functionalities we offer.</p>
    </div>
  );
}
export default Home;