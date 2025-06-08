import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  useToast,
  Button
} from '@chakra-ui/react';
import Link from "next/link";
import { useState} from "react";
import Layout from "../components/Layout";
import React from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  //Determine parameters for valid inputs
  const invalidEmail = !logEmail.endsWith("@rmit.edu.au");
  const invalidPassword = logPassword.length < 8;

  return (
    <Layout>
      <div>
        <main>
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

          <Button
            colorScheme="blue"
            onClick={handleSubmission}
            isLoading={isLoading}
            data-testid="login-button"
            mb={4}
          >
            Log In!
          </Button>
          <br/>
          <Link href="/signup" className="nav-link">
            Don`&apos;`t have an account? Sign up here.
          </Link>
        </main>
      </div>
    </Layout>
  );  

  //Checks if inputs are valid before passing them through
  function handleSubmission() {
    if (invalidEmail || invalidPassword) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid email and password.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    else {
      checkLogin();
    }
  }

  async function checkLogin() {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5050/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: logEmail,
          password: logPassword,
        }),
      });

      const user = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        toast({
          title: "Login failed",
          description: user.message || "Invalid credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      // Save email and role to localStorage
      localStorage.setItem("account", user.email);

      // Show confirmation before redirecting
      toast({
        title: `Welcome, ${user.name || "User"}!`,
        description: "You have successfully logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        if (user.role === "Admin") {
          localStorage.setItem("login", "admin");
        } else if (user.role === "lecturer") {
          localStorage.setItem("login", "lecturer");
        } else if (user.role === "tutor") {
          localStorage.setItem("login", "tutor");
        }
        router.push("/");
      }, 3000); // wait 3 seconds for toast to show
    } catch (err) {
      console.error("Login failed:", err);
      setIsLoading(false);
      toast({
        title: "Login error",
        description: "Something went wrong during login.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }

}
  