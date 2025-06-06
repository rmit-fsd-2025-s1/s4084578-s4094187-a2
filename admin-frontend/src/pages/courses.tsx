import {
  Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalFooter, 
  ModalHeader, ModalContent, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Course, courseService } from "@/services/api";

export default function Home() {

  const [courses, setCourses] = useState<Course[]>([])
  const [formData, setFormData] = useState<Course>({
    id: "-1",
    course_id: 0,
    name: ""
  });

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [editName, setEditName] = useState("")
  const [editCourseId, setEditCourseId] = useState<number>(0);

  useEffect(() => {
    courseService.getCourses().then(setCourses)
  }, []);

  const handleSubmit = async () => {
    if (!formData.name.trim() || formData.course_id <= 0) {
      alert("Please enter a valid course name and ID.")
      return
    }
    try {
      await courseService.createCourse(formData.course_id, formData.name);
      const updatedCourses = await courseService.getCourses()
      setCourses(updatedCourses)
      setFormData({ id: "-1", course_id: 0, name: "" })
    } 
    catch (error) {
      console.error("Error creating course:", error)
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course)
    setEditName(course.name)
    setEditCourseId(course.course_id)
    setIsEditOpen(true)
  };

  const handleSaveEdit = async () => {
    if (!selectedCourse) return
    try {
      await courseService.updateCourse(selectedCourse.id, editCourseId, editName);
      setIsEditOpen(false)
      const updatedCourses = await courseService.getCourses()
      setCourses(updatedCourses)
    } 
    catch (error) {
      console.error("Error updating course: ", error)
    }
  };

  const handleDelete = async (course: Course) => {
    alert(`deleting ${course.name}`)
  }

  return (
    <>
      <Box p={4} borderWidth="1px" borderRadius="lg">
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
            type="number"
            value={formData.course_id}
            onChange={(e) => setFormData({ ...formData, course_id: Number(e.target.value) })}
          />
        </FormControl>
        <br/>
        <Button onClick={handleSubmit}>Create Course</Button>
      </Box>

      <br/>
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <h1><strong>All Courses</strong></h1>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>ID</Th>
                <Th></Th>
                <Th></Th>
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
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
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
              <Input type="number" value={editCourseId} onChange={(e) => setEditCourseId(Number(e.target.value))}/>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsEditOpen(false)} mr={3}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSaveEdit}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
