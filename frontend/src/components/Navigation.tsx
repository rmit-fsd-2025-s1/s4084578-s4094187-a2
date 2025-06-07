// normally, it would make sense to combine this page with header.tsx, however the specifications can be interpreted
// such that both a navigation page and a header are required.

import React, { useEffect, useState } from "react";
import Link from "next/link";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const login = localStorage.getItem("login");
    if (login === "admin" || login === "lecturer" || login === "tutor") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("account");
    setIsLoggedIn(false);
    window.location.href = "/" // redirect to home
  };

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
        {!isLoggedIn && (
          <>
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
          </>
        )}
        {isLoggedIn && (
          <li>
            <button onClick={handleLogout} className="nav-link">
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
