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

  function checkLogin() {
    //Details compared to localStorage info
    let key = 0;
    let userInfo = JSON.parse(localStorage.getItem("userInfo" + key) || 'null');
    let email = userInfo.Email;
    let password = userInfo.Password;
    //Iterate through stored userInfo
    //While loop is used because foreach and map cannot break
    while (email != logEmail || password != logPassword) {
      if (localStorage.getItem("userInfo" + key) != null) {
        userInfo = JSON.parse(localStorage.getItem("userInfo" + key) || 'null');
        email = userInfo.Email;
        password = userInfo.Password;
        ++key;
      }
      else {
        alert("Wrong Input");
        break;
      }
    }
    if (email == logEmail && password == logPassword) {
      localStorage.setItem("account", email)
      if (userInfo.Name == "Admin") {  
        localStorage.setItem("login", "admin")
        //alert("correct admin input");
        window.location.href = "/lecturers";
      }
      else if (userInfo.Lecturer == true) {  
        localStorage.setItem("login", "lecturer")
        //alert("correct lecturer input");
        window.location.href = "/lecturers";
      }
      else {
        localStorage.setItem("login", "tutor")
        //alert("correct tutor input");
        window.location.href = "/tutors";
      }
    }
  }
}
  