import {
  Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalFooter, 
  ModalHeader, ModalContent, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Course, courseService } from "@/services/api";

export default function Home() {

  const [courses, setCourses] = useState<Course[]>([])
  const [formData, setFormData] = useState<Course>({ id: -1, course_id: "", name: "" })
  // useState to handle showing the modal (edit course window)
  const [isModalOpen, setisModalOpen] = useState(false)
  // set a specific course to edit
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [editName, setEditName] = useState("")
  const [editCourseId, setEditCourseId] = useState<string>("");

  // load all courses on page load
  useEffect(() => {
    courseService.getCourses().then(setCourses)
  }, []);

  // function for adding a course
  const handleSubmit = async () => {
    if (!formData.name.trim() || formData.name.trim().length > 100) {
      alert("Please enter a valid course name.")
      return
    }
    if (!isValidCourseId(formData.course_id)) {
      alert("ID must be in the format COSCxxxx where x is a digit.")
      return
    }
    try {
      await courseService.createCourse(formData.course_id.trim(), formData.name.trim());
      const updatedCourses = await courseService.getCourses()
      setCourses(updatedCourses)
      // id defaults to -1 (it is never used, an id of -1 in the database will reveal the existance of a problem)
      setFormData({ id: -1, course_id: "", name: "" })
    }
    catch (error) {
      console.error("Error creating course:", error)
    }
  };

  // saves values of the specific course and opens modal window
  const handleEdit = (course: Course) => {
    setSelectedCourse(course)
    setEditName(course.name)
    setEditCourseId(course.course_id)
    setisModalOpen(true)
  };

  // saves the edit
  const handleSaveEdit = async () => {
    if (!selectedCourse) return
    if (!editName.trim() || editName.trim().length > 100) {
      alert("Please enter a valid course name.")
      return
    }
    if (!isValidCourseId(editCourseId)) {
      alert("ID must be in the format COSCxxxx where x is a digit.")
      return
    }
    try {
      await courseService.updateCourse(selectedCourse.id, editCourseId.trim(), editName.trim());
      setisModalOpen(false)
      const updatedCourses = await courseService.getCourses()
      setCourses(updatedCourses)
    } 
    catch (error) {
      console.error("Error updating course: ", error)
    }
  };

  // function for deleting a course
  const handleDelete = async (course: Course) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${course.name}"?`);
    if (!confirmed) return;
    try {
      await courseService.deleteCourse(course.id);
      const updatedCourses = await courseService.getCourses();
      setCourses(updatedCourses);
    } 
    catch (error) {
      console.error("Error deleting course: ", error);
    }
  }

  // logic used in two places, pull out of bigger code blocks
  const isValidCourseId = (input: string) => /^COSC\d{4}$/.test(input.trim())

  return (
    <>
      <Box className="box">
        <FormControl>
          <FormLabel fontWeight="bold">Add Course</FormLabel>
          <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="gray.600">Name</FormLabel>
          <Input
            placeholder="Course Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="gray.600">ID</FormLabel>
          <Input
            type="string"
            value={formData.course_id}
            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
          />
        </FormControl>
        <br/>
        <Button onClick={handleSubmit}>Create Course</Button>
      </Box>

      <br/>
      <Box className="box">
        <h1><strong>All Courses</strong></h1>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>ID</Th>
                <Th/>
                <Th/>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map((course) => (
                <Tr key={course.id}>
                  <Td>{course.name}</Td>
                  <Td>{course.course_id}</Td>
                  <Td><Button onClick={() => handleEdit(course)}>Edit</Button></Td>
                  <Td><Button colorScheme="red" onClick={() => handleDelete(course)}>Delete</Button></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {courses.length === 0 && <p>Loading courses. If this is taking more than a couple seconds, please refresh the page.</p>}
      </Box>
      
      {/* modal for edit button */}
      <Modal isOpen={isModalOpen} onClose={() => setisModalOpen(false)}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Edit Course</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="gray.600">Name</FormLabel>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)}/>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="gray.600">ID</FormLabel>
              <Input value={editCourseId} onChange={(e) => setEditCourseId(e.target.value)}/>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setisModalOpen(false)} mr={3}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSaveEdit}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
