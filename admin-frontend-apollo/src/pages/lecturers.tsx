import { 
  Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, 
  ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { 
  Course, courseService, Lecturer, lecturerCourseService, 
  lecturerService, LecturerCourse 
} from "@/services/api";

export default function Home() {

  // all lecturers
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  // a specific lecturer
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  // courses that each a specific lecturer is assigned to
  const [assignedCourses, setAssignedCourses] = useState<LecturerCourse[]>([])

  // fill useStates
  useEffect(() => {
      lecturerService.getLecturers().then(setLecturers)
      courseService.getCourses().then(setCourses)
    }, []);

  // "View Course" button
  const handleViewCourses = async (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer)
    setIsModalOpen(true)
    await fetchAssignedCourses(lecturer.id)
  }

  // assign and unassign lecturers from courses
  const toggleCourseAssignment = async (course: Course) => {
    if (!selectedLecturer) return
    const assigned = isAssigned(course.id);
    try {
      // if the lecturer is already assigned, delete the assignment
      if (assigned) {
        const lecturerCourseId =
          assignedCourses.find(lecturerCourse => lecturerCourse.course.id === course.id)?.lecturer_course_id || 0;
        await lecturerCourseService.deleteLecturerCourse(lecturerCourseId);
      } 
      // if the lecturer is not already assigned, assign them
      else {
        await lecturerCourseService.assignCourse(selectedLecturer.id, course.id);
      }
      // update data for buttons to display correctly
      await fetchAssignedCourses(selectedLecturer.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
        console.error(err);
      } else {
        console.error("Unexpected error", err);
        alert("Unable to update lecturer assignment to course.");
      }
    }
  }

  // the following logic is used twice, pull both functions of the other code
  const fetchAssignedCourses = async (lecturerId: number) => {
    const lecturerCourses = await lecturerCourseService.getCoursesByLecturerId(lecturerId)
    setAssignedCourses(lecturerCourses)
  }

  const isAssigned = (courseId: number) => {
    return assignedCourses.some(lecturerCourse => lecturerCourse.course.id === courseId)
  }

  return (
    <div>
      <Box className="box">
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
                  {/* map all courses, colour and text on button is based on assignment */}
                  {courses.map(course => {
                    const assigned = isAssigned(course.id)
                    return (
                      <Tr key={course.id}>
                        <Td>{course.name}</Td>
                        <Td>{course.course_id}</Td>
                        <Td>
                          <Button
                            colorScheme={assigned ? "red" : "blue"}
                            onClick={() => toggleCourseAssignment(course)}
                          >
                            {assigned ? "Unassign Course" : "Assign Course"}
                          </Button>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>
            {courses.length === 0 && <p>Loading courses. If this is taking more than a couple seconds, please refresh the page.</p>}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)} mr={3}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
