import { Link } from "react-router-dom";
import React from 'react';

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <button><Link to="/">Home</Link></button>
    </div>
  );
}
export default NotFound;