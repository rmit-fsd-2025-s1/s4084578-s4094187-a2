import { Tutor, tutorService } from "@/services/api";
import { Box, Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Home() {

  const [tutors, setTutors] = useState<Tutor[]>([])

  useEffect(() => {
    tutorService.getTutors().then(setTutors)
  }, [])

  const handleToggleBlock = async (tutorId: string, currentlyBlocked: boolean) => {
    try {
      // pass !currentlyBlocked to pass the opposite value, switching it
      await tutorService.toggleTutorBlock(tutorId, !currentlyBlocked)
      // update state
      setTutors(prev => prev.map(tutor => tutor.id === tutorId ? { ...tutor, blocked: !currentlyBlocked } : tutor))
    } catch (error) {
      console.error("Failed to toggle blocked status:", error);
    }
  }

  return (
    <div>
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <h1><strong>All Candidates</strong></h1>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Availability</Th>
                <Th>Skills List</Th>
                <Th>Academic Credentials</Th>
                <Th/>
              </Tr>
            </Thead>
            <Tbody>
              {tutors.map((tutor) => (
                <Tr key={tutor.id}>
                  <Td>{tutor.name}</Td>
                  <Td>{tutor.availableFullTime ? "Full Time" : "Part Time"}</Td>
                  <Td>{tutor.skillsList}</Td>
                  <Td>{tutor.academicCredentials}</Td>
                  <Td>
                    <Button
                      colorScheme={tutor.blocked ? "green" : "red"}
                      onClick={() => handleToggleBlock(tutor.id, tutor.blocked)}
                    >
                      {tutor.blocked ? "Unblock" : "Block"}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {tutors.length === 0 && <p>Loading tutors. If this is taking more than a couple seconds, please refresh the page.</p>}
      </Box>
    </div>
  );
}
