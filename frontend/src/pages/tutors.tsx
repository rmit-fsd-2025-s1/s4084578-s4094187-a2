import Layout from "../components/Layout";
import React from "react";
import { useEffect, useState } from "react";
import { 
  TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Box, Heading,
  FormControl, FormLabel, Input, Stack, RadioGroup, Radio, Text, HStack 
} from "@chakra-ui/react";

interface Course {
  id: string;
  course_id: number;
  name: string;
}

interface Tutor {
  Name: string;
  Available: "Full Time" | "Part Time" | "";
  Skills: string;
  Creds: string;
};

export default function Home() {

  const [CoursesArray, setCoursesArray] = useState<Course[]>([])

  // useState for the currently logged in tutor
  const [currentTutor, setCurrentTutor] =useState<Tutor>({
    Name: "",
    Available: "",
    Skills: "",
    Creds: "",
  })

  // useState for the data currently in the form
  const [formData, setFormData] = useState<Tutor>({
    Name: "",
    Available: "",
    Skills: "",
    Creds: "",
  });

  // useState to help verify that there is a logged in tutor
  const [tutorLoginExists, setTutorLoginExists] = useState(false);

  useEffect(() => {

    // fetch courses
    fetch("http://localhost:5050/api/courses")
    .then((res) => res.json())
    .then((data) => setCoursesArray(data))
    .catch((err) => console.error("Failed to fetch courses:", err))

    // checking that there is a logged in tutor when page loads
    const tutorLoginCheck = localStorage.getItem("login");
    const userEmail = localStorage.getItem("account")
    if (tutorLoginCheck === "tutor" || tutorLoginCheck === "admin") {
      setTutorLoginExists(true)
      fetch(`http://localhost:5050/api/tutors/profile?email=${userEmail}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch tutor profile");
        }
        return res.json();
      })
      .then((tutorData) => {
        console.log("Fetched tutor data:", tutorData)
        setCurrentTutor({
          Name: tutorData.name || "",
          Available: tutorData.availableFullTime === 1 ? "Full Time" : "Part Time",
          Skills: tutorData.skillsList || "",
          Creds: tutorData.academicCredentials || "",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch tutor profile:", err);
      });
    }
  }, [])

  // when currentTutor changes, update the formData useState to ensure that the form is pre-filled
  useEffect(() => {
    if (currentTutor) {
      setFormData(currentTutor);
    }
  }, [currentTutor]);

  // function to process the form
  const updateTutorDetails = () => {
    alert("Not implemented!");
  };

  const handleApplication = async (courseDbId: string, role: boolean) => {
  const email = localStorage.getItem("account")
  if (!email) {
    alert("No logged-in tutor found")
    return
  }
  try {
    const res = await fetch("http://localhost:5050/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, courseId: courseDbId, tutorRole: role })
    })
    if (res.status === 201) {
      alert("Your application has been submitted")
    } 
    else if (res.status === 409) {
      alert("You already have a pending application for this course")
    } 
    else {
      const { error } = await res.json()
      alert(`Error: ${error}`)
    }
  } catch (err) {
    console.error("Failed to submit application:", err)
    alert("Failed to submit application.")
  }
}

  // ensure page does not load when there is no tutor logged in
  if(!tutorLoginExists) {
    return (
      <Layout>
        <p>No tutor login found, please login.</p>
      </Layout>
    )
  }

  return (
    <Layout>

      <h2>The following classes have tutor or lab assistant roles available:</h2>

      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Tutor Role</Th>
              <Th>Lab Assistant Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* grabs courses from the database */}
            {CoursesArray.map((course) => (
              <Tr key={course.id}>
                <Td>{course.course_id}</Td>
                <Td>{course.name}</Td>
                {/* tutor apply button */}
                <Td>
                  <Button onClick={() => handleApplication(course.id, true)}>Apply</Button>
                </Td>
                {/* lab assistant apply button */}
                <Td>
                  <Button onClick={() => handleApplication(course.id, false)}>Apply</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <br/>
      <Box p={4} borderWidth="1px" borderRadius="lg">
      <Heading size='2x1'>Your Profile</Heading>
      <HStack>
        <Text as='b'>Name:</Text>
        <Text> {currentTutor.Name}</Text>
      </HStack>
      <HStack>
        <Text as='b'>Availability:</Text>
        <Text> {currentTutor.Available}</Text>
      </HStack>
      <HStack>
        <Text as='b'>Skills List:</Text>
        <Text> {currentTutor.Skills}</Text>
      </HStack>
      <HStack>
        <Text as='b'>Academic Credentials:</Text>
        <Text> {currentTutor.Creds}</Text>
      </HStack>
      </Box>

      <br/>
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <Heading size='2x1'>Update Profile</Heading>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input 
            placeholder='Name' 
            value={formData.Name} 
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            data-testid="tutor-update-name"
          />
          <FormLabel>Availability</FormLabel>
          <RadioGroup
            value={formData.Available}
            onChange={(value) => setFormData({ ...formData, Available: value as "Full Time" | "Part Time" })}
          >
            <Stack direction="row">
              <Radio value="Full Time" key="full">Full Time</Radio>
              <Radio value="Part Time" key="part">Part Time</Radio>
            </Stack>
          </RadioGroup>
          <FormLabel>Skills List</FormLabel>
          <Input 
            placeholder='Skills List' 
            value={formData.Skills} 
            onChange={(e) => setFormData({ ...formData, Skills: e.target.value })}
          />
          <FormLabel>Academic Credentials</FormLabel>
          <Input 
            placeholder='Academic Credentials' 
            value={formData.Creds} 
            onChange={(e) => setFormData({ ...formData, Creds: e.target.value })}
          />
        </FormControl>
        <br/>
        <Button onClick={updateTutorDetails} data-testid="tutor-update-button">
          Update Details
        </Button>
      </Box>

    </Layout>
  );
}