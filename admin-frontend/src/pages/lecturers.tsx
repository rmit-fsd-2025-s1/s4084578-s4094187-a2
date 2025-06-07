import { 
  Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, 
  ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Course, courseService, Lecturer, lecturerCourseService, lecturerService } from "@/services/api";

export default function Home() {

  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null)
  const [courses, setCourses] = useState<Course[]>([])


  useEffect(() => {
      lecturerService.getLecturers().then(setLecturers)
      courseService.getCourses().then(setCourses)
    }, []);

  const handleViewCourses = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer)
    setIsEditOpen(true)
  }

  const handleAssignCourse = async (course: Course) => {
  if (!selectedLecturer) return;
  try {
    await lecturerCourseService.assignCourse(selectedLecturer.id, course.id);
    alert(`Assigned "${course.name}" to ${selectedLecturer.name}`);
    // optional – refetch lecturerCourses to disable the button
  } catch (err: any) {
    alert(err.message ?? "Could not assign – maybe it is already linked?");
    console.error(err);
  }
}

  return (
    <div>
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <h1><strong>All Lecturers</strong></h1>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>View Courses</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lecturers.map((lecturer) => (
                <Tr key={lecturer.id}>
                  <Td>{lecturer.name}</Td>
                  <Td><Button onClick={() => handleViewCourses(lecturer)}>View Courses</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {lecturers.length === 0 && <p>Loading lecturers. If this is taking more than a couple seconds, please refresh the page.</p>}
      </Box>
    
      {/* modal for edit button */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <ModalOverlay/>
        <ModalContent maxW="fit-content">
          <ModalHeader/>
          <ModalBody>
            <h1><strong>All Courses</strong></h1>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>ID</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {courses.map((course) => (
                    <Tr key={course.id}>
                      <Td>{course.name}</Td>
                      <Td>{course.course_id}</Td>
                      <Td><Button onClick={() => handleAssignCourse(course)}>Assign Course</Button></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            {courses.length === 0 && <p>Loading courses. If this is taking more than a couple seconds, please refresh the page.</p>}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsEditOpen(false)} mr={3}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
