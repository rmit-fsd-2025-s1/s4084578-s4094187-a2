import Layout from "../components/Layout";
import React from "react";
import { useEffect, useState } from 'react';

export default function Home() {
  const [LoginExists, setLoginExists] = useState(false); //Check if user is logged in
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);

  type UserProfile = {
    id: number;
    email: string;
    password: string;
    name: string;
    availableFullTime: boolean;
    skillsList: string;
    academicCredentials: string;
    timesSelected: number;
    blocked: boolean;
    comments: string;
    joinDate: Date;
  };

  useEffect(() => {
    const login = localStorage.getItem("login");
    const email = localStorage.getItem("account");

    if (login && email) {
      setLoginExists(true);
      setRole(login);
      fetch(`http://localhost:5050/api/profile?email=${email}`)
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(err => console.error("Failed to fetch profile:", err));
    }
  }, []);

  // ensure profile does not load when there is no user logged in
  if(!LoginExists) {
    return (
      <Layout>
        <div className="card">
          <h2>Our Mission</h2>
          <p>
            This website is designed to be used by both tutors and lecturers to facilitate the applications and selections of
            tutors for various classes.
          </p>
        </div>

        <br/>

        <div className="card">
          <h2>What can I do as a tutor?</h2>
          <p>After logging into the website, you can apply for tutor and lab assistant positions in the available classes on the
            Tutors page.</p>
        </div>

        <br/>

        <div className="card">
          <h2>What can I do as a lecturer?</h2>
          <p>
            After logging into the website, you can see tutor applicants for specific classes and rate and/or recommend the
            applicants on the Lecturers page.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="card">
          <h2>Welcome!</h2>
          {profile ? (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>

            {role === "tutor" ? (
            <>
              <p><strong>Skills:</strong> {profile.skillsList}</p>
              <p><strong>Credentials:</strong> {profile.academicCredentials}</p>
              <p><strong>Availability:</strong> {profile.availableFullTime ? "Full-Time" : "Part-Time"}</p>
              <p><strong>Times Selected:</strong> {profile.timesSelected}</p>
              <p><strong>Blocked:</strong> {profile.blocked ? "Yes" : "No"}</p>
            </>
          ) : null}
            <p><strong>Join Date:</strong> {new Date(profile.joinDate).toLocaleDateString()}</p>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </Layout>
  );
}
