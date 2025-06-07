import Layout from "../components/Layout";
import React, { useState } from "react";
import Link from "next/link";
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
  Select,
  useToast,
  FormErrorMessage,
  FormHelperText
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
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [creds, setCreds] = useState("");
  const toast = useToast();

  const isValidEmail = (email: string) => email.endsWith("@rmit.edu.au");
  const isValidPassword = (password: string) => {
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber && hasSpecial;
  };
  const isValidName = (name: string) => name.trim().length > 0;
  const hasSkills = skills.length > 0;
  const hasCreds = creds !== "";

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const registerLecturer = async () => {
    if (!isValidEmail(lecturerEmail)) {
      toast({
        title: "Invalid Email",
        description: "Email must be an @rmit.edu.au address",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (!isValidPassword(lecturerPassword)) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters long and include letters, numbers, and special characters",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
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
      toast({
        title: "Successful Signup",
        description: "Lecturer registered successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      onLecturerClose();
    } else {
      toast({
        title: "Failed Signup",
        description: "Error registering lecturer",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const registerTutor = async () => {
    if (!isValidEmail(tutorEmail)) {
      toast({
        title: "Invalid Email",
        description: "Email must be an @rmit.edu.au address",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (!isValidPassword(tutorPassword)) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters long and include letters, numbers, and special characters",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!creds) {
      toast({
        title: "Invalid Credential",
        description: "Please select an academic credential",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
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
        skillsList: skills.join(","),
        academicCredentials: creds
      })
    });

    if (res.ok) {
      toast({
        title: "Successful Signup",
        description: "Tutor registered successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      onTutorClose();
    } else {
      toast({
        title: "Failed Signup",
        description: "Error registering tutor",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Layout>
      <VStack spacing={6}>
        <Text fontSize="lg">
          Already have an account? <Link href="/login" className="nav-link">Click here</Link>
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
              <FormControl isRequired isInvalid={!isValidEmail(lecturerEmail)}>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Type your email" value={lecturerEmail} onChange={(e) => setLecturerEmail(e.target.value)} />
                {!isValidEmail(lecturerEmail) ? (
                  <FormErrorMessage>
                    Valid email is required.
                  </FormErrorMessage>
                ):(
                  <FormHelperText>
                    Enter email.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!isValidPassword(lecturerPassword)}>
                <FormLabel mt={3}>Password</FormLabel>
                <Input placeholder="Type your password" type="password" value={lecturerPassword} onChange={(e) => setLecturerPassword(e.target.value)} />
                {!isValidPassword(lecturerPassword) ? (
                  <FormErrorMessage>
                    Valid password is required.
                  </FormErrorMessage>
                ):(
                  <FormHelperText>
                    Enter password.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!isValidName(lecturerName)}>
                <FormLabel mt={3}>Full Name</FormLabel>
                <Input placeholder="Type your full name" value={lecturerName} onChange={(e) => setLecturerName(e.target.value)} />
                {!isValidName(lecturerName) ? (
                  <FormErrorMessage>
                    Full name is required.
                  </FormErrorMessage>
                ):(
                  <FormHelperText>
                    Enter full name.
                  </FormHelperText>
                )}
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
              <FormControl isRequired isInvalid={!isValidEmail(lecturerEmail)}>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Type your email" value={tutorEmail} onChange={(e) => setTutorEmail(e.target.value)} />
                {!isValidEmail(lecturerEmail) ? (
                  <FormErrorMessage>
                    Valid email is required.
                  </FormErrorMessage>
                ):(
                  <FormHelperText>
                    Enter email.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!isValidPassword(lecturerPassword)}>
                <FormLabel mt={3}>Password</FormLabel>
                <Input placeholder="Type your password" type="password" value={tutorPassword} onChange={(e) => setTutorPassword(e.target.value)} />
                {!isValidPassword(lecturerPassword) ? (
                  <FormErrorMessage>
                    Valid password is required.
                  </FormErrorMessage>
                ):(
                  <FormHelperText>
                    Enter password.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!isValidName(tutorName)}>
                <FormLabel mt={3}>Full Name</FormLabel>
                <Input placeholder="Type your full name" value={tutorName} onChange={(e) => setTutorName(e.target.value)} />
                {!isValidName(tutorName) ? (
                  <FormErrorMessage>
                    Full name is required.
                  </FormErrorMessage>
                ):(
                  <FormHelperText>
                    Enter full name.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isRequired>
                <FormLabel mt={3}>Available Full Time</FormLabel>
                <Switch isChecked={availability} onChange={(e) => setAvailability(e.target.checked)} />
              </FormControl>
              <FormControl isRequired isInvalid={!hasSkills}>
                <FormLabel mt={3}>Skills</FormLabel>
                <Input
                  placeholder="Type a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
                <HStack wrap="wrap" mt={2}>
                  {skills.map((skill) => (
                    <Button
                      key={skill}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ✕
                    </Button>
                  ))}
                </HStack>
                {!hasSkills ? (
                  <FormErrorMessage>
                    Skills are required.
                  </FormErrorMessage>
                ):(
                  <FormHelperText>
                    Enter skills.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!hasCreds}>
                <FormLabel mt={3}>Academic Credentials</FormLabel>
                <Select value={creds} onChange={(e) => setCreds(e.target.value)}>
                  <option value="">Select a degree</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                </Select>
                {!hasCreds ? (
                  <FormErrorMessage>
                    Select valid credentials.
                  </FormErrorMessage>
                ):(
                  <FormHelperText>
                    Select credentials.
                  </FormHelperText>
                )}
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
