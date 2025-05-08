import Layout from "../components/Layout";
import React from "react";
import Link from "next/link";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {

  const [signUpEmail, setSignUpEmail] =useState<String>()
  const [signUpPassword, setSignUpPassword] =useState<String>()

  const registerUser = () => {
    alert("Non Functioning")
    /*
    // initialise index to the lowest number without an account
    let index = 1;
    let data = localStorage.getItem(`userInfo${index}`)

    // while loop will set index to the correct value
    while ((data = localStorage.getItem(`userInfo${index}`))) {
      index++;
    }

    // setup an object for passing to local storage
    const userInfo = {
      Email: signUpEmail,
      Password: signUpPassword,
    };

    localStorage.setItem(`userInfo${index}`, JSON.stringify(userInfo))
    */
  }

  return (

    <Layout>

      <div>
        <Link href="/login" className="nav-link">
          Already have an account? Click here.
        </Link>
      </div>

      <br/>

      <FormControl>
        <FormLabel>Email</FormLabel>
          <Input 
            placeholder='Email' 
            onChange={(e) => setSignUpEmail(e.target.value)}
          />
        <FormLabel>Password</FormLabel>
          <Input 
            placeholder='Password' 
            onChange={(e) => setSignUpPassword(e.target.value)}
          />
      </FormControl>

      <br/>

      <Button onClick={registerUser} data-testid="signup-button">
        Register
      </Button>

    </Layout>
  );
}