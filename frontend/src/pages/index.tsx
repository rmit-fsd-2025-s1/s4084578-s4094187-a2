import Layout from "../components/Layout";
import React from "react";
import { useEffect, useState } from 'react';

export default function Home() {
  const [LoginExists, setLoginExists] = useState(false); //Check if user is logged in
  const [profile, setProfile] = useState<UserProfile | null>(null);

  type UserProfile = {
    id: number;
    email: string;
    name: string;
    password: string;
    lecturer: boolean;
    selected: boolean;
    skills: string;
    creds: string;
    courses: string;
    available: string;
    timesSelected: number;
    blocked: boolean;
    joinDate: Date;
  };

  useEffect(() => {
    const login = localStorage.getItem("login");
    const email = localStorage.getItem("account");

    if (login && email) {
      setLoginExists(true);
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
            <p><strong>Role:</strong> {profile.lecturer ? "Lecturer" : "Tutor"}</p>
            <p><strong>Skills:</strong> {profile.skills}</p>
            <p><strong>Credentials:</strong> {profile.creds}</p>
            <p><strong>Courses:</strong> {profile.courses}</p>
            <p><strong>Availability:</strong> {profile.available}</p>
            <p><strong>Times Selected:</strong> {profile.timesSelected}</p>
            <p><strong>Blocked:</strong> {profile.blocked ? "Yes" : "No"}</p>
            <p><strong>Join Date:</strong> {new Date(profile.joinDate).toLocaleDateString()}</p>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </Layout>
  );
}
