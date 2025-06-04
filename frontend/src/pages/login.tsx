import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from '@chakra-ui/react';
import { useState} from "react";
import Layout from "../components/Layout";
import React from "react";
import Link from "next/link";

export default function Home() {
  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");

  //Determine parameters for valid inputs
  const invalidEmail = !logEmail.endsWith("@rmit.edu.au");
  const invalidPassword = logPassword.length < 8;

  return (
    <Layout>
      <div>
        <main>
          {/*Email and password stored temporarily as typed*/}
          <FormControl isRequired isInvalid={invalidEmail}>
            <FormLabel>Email address</FormLabel>
              <Input placeholder="Type your email" type='email' 
              onChange={(e) => setLogEmail(e.target.value)} data-testid="login-email-field"/>
              {!invalidEmail ? (
                <FormHelperText>
                  Enter email.
                </FormHelperText>
              ):(
                <FormErrorMessage>
                  Valid email is required.
                </FormErrorMessage>
              )}
          </FormControl>    

          <FormControl isRequired isInvalid={invalidPassword}>
            <FormLabel>Password</FormLabel>
              <Input placeholder="Type your password" type='password' 
              onChange={(e) => setLogPassword(e.target.value)} data-testid="login-password-field"/>
              {!invalidPassword ? (
                <FormHelperText>
                  Enter password.
                </FormHelperText>
              ):(
                <FormErrorMessage>
                  Valid password is required.
                </FormErrorMessage>
              )}
          </FormControl>
          {/*Details only compared onClick of login button*/}
          <button onClick={handleSubmission} data-testid="login-button">Log In!</button><br/><br/>
          <Link href="/signup" className="nav-link">
            Don't have an account? Sign up here.
          </Link>
        </main>
      </div>
    </Layout>
  );  

  //Checks if inputs are valid before passing them through
  function handleSubmission() {
    if (invalidEmail || invalidPassword) {
      alert("email or password invalid")
    }
    else {
      checkLogin();
    }
  }

  async function checkLogin() {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: logEmail,
          password: logPassword,
        }),
      });

      const user = await res.json();

      if (!res.ok) {
        alert(user.message || "Invalid credentials");
        return;
      }

      // Save email and role to localStorage
      localStorage.setItem("account", user.email);

      if (user.name === "Admin") {
        localStorage.setItem("login", "admin");
        window.location.href = "/lecturers";
      } else if (user.lecturer === true) {
        localStorage.setItem("login", "lecturer");
        window.location.href = "/lecturers";
      } else {
        localStorage.setItem("login", "tutor");
        window.location.href = "/tutors";
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong during login.");
    }
  }

}
  