import Layout from "../components/Layout";
import React from "react";
import { useEffect, useState } from "react";
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Box, Heading,
       FormControl, FormLabel, Input, Stack, RadioGroup, Radio, Text, HStack } from "@chakra-ui/react";

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
  Courses: string;
};


export default function Home() {

  const [CoursesArray, setCoursesArray] = useState<Course[]>([])

  useEffect(() => {
    fetch("http://localhost:5050/api/courses")
    .then((res) => res.json())
    .then((data) => setCoursesArray(data))
    .catch((err) => console.error("Failed to fetch courses:", err))
  }, []);

  // useState for the currently logged in tutor
  const [currentTutor, setCurrentTutor] =useState<Tutor>({
    Name: "",
    Available: "",
    Skills: "",
    Creds: "",
    Courses: "",
  })

  // useState for the data currently in the form
  const [formData, setFormData] = useState<Tutor>({
    Name: "",
    Available: "",
    Skills: "",
    Creds: "",
    Courses: ""
  });

  // Track key of logged in tutor
  const [tutorKey, setTutorKey] = useState<number | null>(null);

  // useState to help verify that there is a logged in tutor
  const [tutorLoginExists, setTutorLoginExists] = useState(false);

  //Splits courses to check if present
  const isCourseApplied = (courseName: string) => {
    return formData.Courses.split(", ").includes(courseName);
  };

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(CoursesArray))

    //Loop through
    let key = 0;
    let storedTutor = JSON.parse(localStorage.getItem("userInfo" + key) || 'null');
    let email = localStorage.getItem("account");
    //Iterate through stored userInfo
    //While loop is used because foreach and map cannot break
    while (storedTutor != null && email != storedTutor.Email) {
      if (localStorage.getItem("userInfo" + key) != null) {
        storedTutor = JSON.parse(localStorage.getItem("userInfo" + key) || 'null');
        ++key;
      }
      else {
        break;
      }
    }
    --key;
    setTutorKey(key);
    if (storedTutor) {
      setCurrentTutor(storedTutor);
    }

    // checking that there is a logged in tutor when page loads
    const tutorLoginCheck = localStorage.getItem("login");
    if (tutorLoginCheck === "tutor" || tutorLoginCheck === "admin") {
      setTutorLoginExists(true)
    }
  }, []);

  // when currentTutor changes, update the formData useState to ensure that the form is pre-filled
  useEffect(() => {
    if (currentTutor) {
      setFormData(currentTutor);
    }
  }, [currentTutor]);

  //Handle the toggle button
  const handleApplyToggle = (courseName: string) => {
  };

  // function to process the form
  const updateTutorDetails = () => {
    localStorage.setItem("userInfo" + tutorKey, JSON.stringify(formData));
    setCurrentTutor(formData);
    alert("Tutor details updated!");
  };

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
              <Th>Application</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* currently maps all courses in the array, the local storage value is not used */}
            {CoursesArray.map((course) => (
              <Tr key={course.id}>
                <Td>{course.course_id}</Td>
                <Td>{course.name}</Td>
                <Td>
                  <Button 
                    variant={isCourseApplied(course.name) ? "solid" : "solid"} 
                    colorScheme={isCourseApplied(course.name) ? "red" : "green"}
                    onClick={() => handleApplyToggle(course.name)}
                    data-testid="tutor-apply-button"
                  >
                    {isCourseApplied(course.name) ? "Remove" : "Apply"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
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