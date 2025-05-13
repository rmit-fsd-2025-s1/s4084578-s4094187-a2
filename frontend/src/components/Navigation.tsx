// normally, it would make sense to combine this page with header.tsx, however the specifications can be interpreted
// such that both a navigation page and a header are required.

import React from "react";
import Link from "next/link";

const Navigation = () => {
  return (
    <div className="nav">
      <ul className="nav-list">
        <li>
          <Link href="/" className="nav-link" data-testid="homepage-link">
            TeachTeam Homepage
          </Link>
        </li>
        <li>
          <Link href="/lecturers" className="nav-link">
            Lecturers
          </Link>
        </li>
        <li>
          <Link href="/tutors" className="nav-link">
            Tutors
          </Link>
        </li>
        <li>
          <Link href="/signup" className="nav-link">
            Sign Up
          </Link>
        </li>
        <li>
          <Link href="/login" className="nav-link">
            Login
          </Link>
        </li>
        <li>
          <Link href="/" className="nav-link">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
