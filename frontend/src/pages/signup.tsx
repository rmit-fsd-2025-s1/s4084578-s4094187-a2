import Layout from "../components/Layout";
import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  Text,
  Select
} from "@chakra-ui/react";

export default function Home() {
  const {
    isOpen: isLecturerOpen,
    onOpen: onLecturerOpen,
    onClose: onLecturerClose
  } = useDisclosure();

  const {
    isOpen: isTutorOpen,
    onOpen: onTutorOpen,
    onClose: onTutorClose
  } = useDisclosure();

  // Lecturer form state
  const [lecturerEmail, setLecturerEmail] = useState("");
  const [lecturerPassword, setLecturerPassword] = useState("");
  const [lecturerName, setLecturerName] = useState("");

  // Tutor form state
  const [tutorEmail, setTutorEmail] = useState("");
  const [tutorPassword, setTutorPassword] = useState("");
  const [tutorName, setTutorName] = useState("");
  const [availability, setAvailability] = useState(false);
  const [skills, setSkills] = useState("");
  const [creds, setCreds] = useState("");

  const isValidEmail = (email: string) => email.endsWith("@rmit.edu.au");

  const isValidPassword = (password: string) => {
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber && hasSpecial;
  };

  const registerLecturer = async () => {
    if (!isValidEmail(lecturerEmail)) {
      alert("Email must be an @rmit.edu.au address");
      return;
    }
    if (!isValidPassword(lecturerPassword)) {
      alert("Password must be at least 8 characters long and include letters, numbers, and special characters");
      return;
    }
    const res = await fetch("http://localhost:5050/api/register/lecturer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: lecturerEmail,
        password: lecturerPassword,
        name: lecturerName
      })
    });

    if (res.ok) {
      alert("Lecturer registered successfully");
      onLecturerClose();
    } else {
      alert("Error registering lecturer");
    }
  };

  const registerTutor = async () => {
    if (!isValidEmail(tutorEmail)) {
      alert("Email must be an @rmit.edu.au address");
      return;
    }
    if (!isValidPassword(tutorPassword)) {
      alert("Password must be at least 8 characters long and include letters, numbers, and special characters");
      return;
    }

    if (!creds) {
      alert("Please select an academic credential");
      return;
    }
    const res = await fetch("http://localhost:5050/api/register/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: tutorEmail,
        password: tutorPassword,
        name: tutorName,
        availableFullTime: availability,
        skillsList: skills,
        academicCredentials: creds
      })
    });

    if (res.ok) {
      alert("Tutor registered successfully");
      onTutorClose();
    } else {
      alert("Error registering tutor");
    }
  };

  return (
    <Layout>
      <VStack spacing={6}>
        <Text fontSize="lg">
          Already have an account? <a href="/login">Click here</a>
        </Text>

        <HStack spacing={4}>
          <Button colorScheme="blue" onClick={onLecturerOpen}>
            Sign up as Lecturer
          </Button>
          <Button colorScheme="blue" onClick={onTutorOpen}>
            Sign up as Tutor
          </Button>
        </HStack>

        {/* Lecturer Modal */}
        <Modal isOpen={isLecturerOpen} onClose={onLecturerClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Lecturer Signup</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={lecturerEmail} onChange={(e) => setLecturerEmail(e.target.value)} />
                <FormLabel mt={3}>Password</FormLabel>
                <Input type="password" value={lecturerPassword} onChange={(e) => setLecturerPassword(e.target.value)} />
                <FormLabel mt={3}>Full Name</FormLabel>
                <Input value={lecturerName} onChange={(e) => setLecturerName(e.target.value)} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={registerLecturer}>
                Register
              </Button>
              <Button onClick={onLecturerClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Tutor Modal */}
        <Modal isOpen={isTutorOpen} onClose={onTutorClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tutor Signup</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={tutorEmail} onChange={(e) => setTutorEmail(e.target.value)} />
                <FormLabel mt={3}>Password</FormLabel>
                <Input type="password" value={tutorPassword} onChange={(e) => setTutorPassword(e.target.value)} />
                <FormLabel mt={3}>Full Name</FormLabel>
                <Input value={tutorName} onChange={(e) => setTutorName(e.target.value)} />
                <FormLabel mt={3}>Available Full Time</FormLabel>
                <Switch isChecked={availability} onChange={(e) => setAvailability(e.target.checked)} />
                <FormLabel mt={3}>Skills</FormLabel>
                <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
                <FormLabel mt={3}>Academic Credentials</FormLabel>
                <Select value={creds} onChange={(e) => setCreds(e.target.value)}>
                  <option value="">Select a degree</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={registerTutor}>
                Register
              </Button>
              <Button onClick={onTutorClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Layout>
  );
}
