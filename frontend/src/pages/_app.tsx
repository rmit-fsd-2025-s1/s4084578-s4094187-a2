import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    //Hardcoded login data
    // Create fake data
    const sampleUsers = [
      {
        //Admin Login Data, Registered as both lecturer and tutor for testing.
        Email: "Admin@rmit.edu.au",
        Password: "password",
        Selected: false,
        Name: "Admin",
        Skills: "All",
        Creds: "All",
        Courses: "All",
        Available: "Full Time",
        TimesSelected: 0
      },
      {
        //Lecturer Login Data
        Email: "Lecturer@rmit.edu.au",
        Password: "password",
        Lecturer: true
      },
      {
        Email: "JohnDoe@rmit.edu.au",
        Password: "password",
        Lecturer: false,
        Selected: false,
        Name: "John Doe",
        Skills: "Time Management, Research",
        Creds: "Bachelor of Computer Science",
        Courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
        Available: "Part Time",
        TimesSelected: 0
      },
      {
        Email: "LilySmith@rmit.edu.au",
        Password: "p455w0rd",
        Lecturer: false,
        Selected: false,
        Name: "Lily Smith",
        Skills: "Computer Skills, Critical Thinking",
        Creds: "Bachelor of Software Engineering",
        Courses: "Algorithms and Analysis, Full Stack Development",
        Available: "Part Time",
        TimesSelected: 2
      },
      {
        Email: "MaxPayne@rmit.edu.au",
        Password: "rockstar",
        Lecturer: false,
        Selected: false,
        Name: "Max Payne",
        Skills: "Problem Solving, Independence",
        Creds: "Bachelor of IT",
        Courses: "Full Stack Development, Software Engineering Fundamentals",
        Available: "Full Time",
        TimesSelected: 3
      },
      {
        Email: "RichardMiles@rmit.edu.au",
        Password: "carfan77",
        Lecturer: false,
        Selected: false,
        Name: "Richard Miles",
        Skills: "Research, Critical Thinking",
        Creds: "Bachelor of Software Engineering",
        Courses: "Full Stack Development, Algorithms and Analysis",
        Available: "Full Time",
        TimesSelected: 2
      },
      {
        Email: "SteveJoes@rmit.edu.au",
        Password: "ApplesTasteGood",
        Lecturer: false,
        Selected: false,
        Name: "Steve Joes",
        Skills: "Computer Skills, Independence",
        Creds: "Bachelor of Computer Science",
        Courses: "Software Engineering Fundamentals, Algorithms and Analysis",
        Available: "Part Time",
        TimesSelected: 5
      },
      {
        Email: "BallGates@rmit.edu.au",
        Password: "Win10Forever",
        Lecturer: false,
        Selected: false,
        Name: "Ball Gates",
        Skills: "Problem Solving, Time Management",
        Creds: "Bachelor of IT",
        Courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
        Available: "Part Time",
        TimesSelected: 4
      }
    ];

      // Put fake data in localStorage
    sampleUsers.forEach((user, index) => {
        localStorage.setItem(`userInfo${index}`, JSON.stringify(user));
    });
  }, []);

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );

}
