import { Button, FormControl, FormLabel, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Course, courseService, CREATE_COURSE } from "@/services/api";
import { useMutation } from "@apollo/client";


export default function Home() {

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    courseService.getCourses().then(setCourses);
  }, []);

  const [formData, setFormData] = useState<Course>({
    course_id: 0,
    name: ""
  });

  console.log('CREATE_COURSE =', CREATE_COURSE);
  const [createCourse, { loading }] = useMutation(CREATE_COURSE);

  const handleSubmit = async () => {
    if (!formData.name.trim() || formData.course_id <= 0) {
      alert("Please enter a valid course name and course ID.");
      return;
    }
    try {
      await createCourse({
        variables: {
          course_id: formData.course_id,
          name: formData.name,
        },
      });
      const updatedCourses = await courseService.getCourses();
      setCourses(updatedCourses);
      setFormData({ course_id: 0, name: "" });
    } 
    catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <>
      <div>
        <h1>Courses</h1>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>ID</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map((Course) => (
                <Tr>
                  <Td>{Course.name}</Td>
                  <Td>{Course.course_id}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {courses.length === 0 && <p>There are no courses in the database.</p>}
      </div>
      <br/>
      <div className='courseForm'>
        <FormControl>
          <FormLabel>Create New Course</FormLabel>
          <div className='courseFormInputRow'>
            <Input 
              placeholder='Course Name'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              type="number"
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: Number(e.target.value) })}
            />
          </div>
        </FormControl>
        <Button onClick={handleSubmit} isLoading={loading}>Create Course</Button>
      </div>

    </>
  );
}
