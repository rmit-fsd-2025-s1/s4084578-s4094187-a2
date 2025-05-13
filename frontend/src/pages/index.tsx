import Layout from "../components/Layout";
import React from "react";

export default function Home() {
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
  );
}
