import { Box, Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Lecturer, lecturerService } from "@/services/api";

export default function Home() {

  const [lecturers, setLecturers] = useState<Lecturer[]>([])


  useEffect(() => {
      lecturerService.getLecturers().then(setLecturers)
    }, []);

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
                  <Td><Button>View Courses</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {lecturers.length === 0 && <p>Loading lecturers. If this is taking more than a couple seconds, please refresh the page.</p>}
      </Box>
    </div>
  )
}
