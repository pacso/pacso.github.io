import React from "react";
import Link from "gatsby-link";

export default ({ children }) => (
  <div style={{ margin: `0 auto`, maxWidth: 650, padding: `0 1rem` }}>
    <h2>
    <Link to="/">pacso</Link>
    </h2>
    <h3>
      <Link to="/about/">About</Link>
    </h3>
    {children()}
    <footer>
      <p>My <a href="https://github.com/pacso">GitHub</a> Profile</p>
    </footer>
  </div>
);
