import React from "react";
import Link from "gatsby-link";

export default ({ children }) => (
  <div style={{ margin: `0 auto`, maxWidth: 650, padding: `0 1rem` }}>
    <h2>
    <Link to="/">pacso</Link>
    </h2>
    {children()}
  </div>
);
