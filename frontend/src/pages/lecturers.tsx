import { useEffect, useState } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Checkbox,
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, useDisclosure, Input, Box, Text, SimpleGrid
} from '@chakra-ui/react';
import Layout from '../components/Layout';

export default function Home() {
  const [tutors, setTutors] = useState<any[]>([]); //Hold tutor data
  const { isOpen, onOpen, onClose } = useDisclosure(); //Modal control
  const [rankings, setRankings] = useState<{ [tutorId: number]: number }>({});
  const [comments, setComments] = useState<{ [tutorId: number]: string }>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null); //Choose which column to sort with
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); //Choose if sorting is ascending or descending
  const [searchTerm, setSearchTerm] = useState(''); //Search bar input
  const [lecturerLoginExists, setLecturerLoginExists] = useState(false); //Check if user has lecturer permissions

  useEffect(() => {
    // setup login validation
    const lecturerLoginCheck = localStorage.getItem("login");
    if (lecturerLoginCheck == "lecturer" || lecturerLoginCheck == "admin") {
      setLecturerLoginExists(true)
    }

    const fetchTutors = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/search?searchTerm=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setTutors(data);

        const initialComments: { [id: number]: string } = {};
        data.forEach((t: any) => {
          initialComments[t.id] = t.comments || '';
        });
        setComments(initialComments);
      
        console.log('Fetched tutor data:', data);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    if (searchTerm) {
      fetchTutors();
    } else {
      // Fetch all tutors if no search term is provided
      fetch('http://localhost:5050/api/search')
        .then(res => res.json())
        .then(data => {
          setTutors(data);
        })
        .catch(error => {
          console.error('Error fetching tutors:', error);
        });
    }
  }, [searchTerm]);

  //Message if not logged in
  if (!lecturerLoginExists) {
    return (
      <Layout>
        <p>No lecturer login found, please login.</p>
      </Layout>
    )
  }

  // Handle checkbox toggle
  const handleCheckboxChange = async (name: string) => {
    const updatedTutors = tutors.map(tutor =>
      tutor.name === name ? { ...tutor, Selected: !tutor.Selected } : tutor
    );
    setTutors(updatedTutors);

    const updatedTutor = updatedTutors.find(t => t.name === name);
    if (updatedTutor) {
      try {
        await fetch(`http://localhost:5050/api/tutors/${updatedTutor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTutor)
        });
      } catch (error) {
        console.error('Error updating tutor:', error);
      }
    }
  };

  // Function to filter selected tutors
  const selectedTutors = tutors.filter(tutor => tutor.Selected);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  //Sort tutors in this function according to search and give a sorted array
  const sortedTutors = [...tutors].sort((a, b) => {
    if (!sortColumn) return 0;
  
    const valA = a[sortColumn];
    const valB = b[sortColumn];
  
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
  
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
  
    return 0;
  });

  return (
    <Layout>
      {/*Create search bar*/}
      <Input
        placeholder="Search tutor details"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
        data-testid="lecturer-search-bar"
      />
      {/*Create tutor table*/}
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Available Tutors</TableCaption>
          <Thead>
            <Tr>
              {/*Clickable headers to sort table*/}
              <Th>Select</Th>
              <Th onClick={() => handleSort('name')} cursor="pointer">
                Applicant {sortColumn === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </Th>
              <Th onClick={() => handleSort('skillsList')} cursor="pointer">
                Skills {sortColumn === 'skillsList' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </Th>
              <Th onClick={() => handleSort('academicCredentials')} cursor="pointer">
                Credentials {sortColumn === 'academicCredentials' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </Th>
              {/*<Th onClick={() => handleSort('Courses')} cursor="pointer">
                Courses {sortColumn === 'Courses' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </Th>*/}
              <Th onClick={() => handleSort('availableFullTime')} cursor="pointer">
                Availability {sortColumn === 'availableFullTime' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {/*Iterate through tutors*/}
            {sortedTutors.map((tutor, i) => (
              <Tr key={i}>
              <Td><Checkbox isChecked={tutor.Selected} 
                            onChange={() => handleCheckboxChange(tutor.name)} 
                            data-testid = 'lecturer-tutor-checkbox'/></Td>
                <Td>{tutor.name}</Td>
                <Td>
                  {tutor.skillsList.split(',').map((skill: string, idx: number) => (
                    <div key={idx}>{skill.trim()}</div>
                  ))}
                </Td>
                <Td>{tutor.academicCredentials}</Td>
                {/*<Td>
                  {tutor.courses.split(',').map((course: string, idx: number) => (
                    <div key={idx}>{course.trim()}</div>
                  ))}
                </Td>*/}
                <Td>
                  {tutor.availableFullTime ? "Full-time" : "Part-time"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/*Modal to show selected tutors*/}
      <Modal isOpen={isOpen} onClose={onClose} size="x1">
      <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Selected Tutors
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {/*Clickable headers to sort table*/}
                    <Th>Rank</Th>
                    <Th onClick={() => handleSort('name')} cursor="pointer">
                      Applicant {sortColumn === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </Th>
                    <Th onClick={() => handleSort('skillsList')} cursor="pointer">
                      Skills {sortColumn === 'skillsList' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </Th>
                    <Th onClick={() => handleSort('academicCredentials')} cursor="pointer">
                      Credentials {sortColumn === 'academicCredentials' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </Th>
                    {/*<Th onClick={() => handleSort('Courses')} cursor="pointer">
                      Courses {sortColumn === 'Courses' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </Th>*/}
                    <Th onClick={() => handleSort('availableFullTime')} cursor="pointer">
                      Availability {sortColumn === 'availableFullTime' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </Th>
                    <Th>Comments</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/*Message if none selected*/}
                  {selectedTutors.length === 0 ? (
                    <Tr>
                      <Td colSpan={6}>No tutors selected.</Td>
                    </Tr>
                  ) : (
                    sortedTutors
                      .map((tutor, index) => ({ tutor, index }))
                      .filter(({ tutor }) => tutor.Selected)
                      .map(({ tutor, index }) => (
                      <Tr key={index}>
                         <Td>
                          <select
                            value={rankings[tutor.id] || ''}
                            onChange={(e) =>
                              setRankings({ ...rankings, [tutor.id]: parseInt(e.target.value) })
                            }
                          >
                            <option value="">Rank</option>
                            {[1, 2, 3, 4, 5].map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </Td>
                        <Td>{tutor.name}</Td>
                        <Td>
                          {tutor.skillsList.split(',').map((skill: string, idx: number) => (
                            <div key={idx}>{skill.trim()}</div>
                          ))}
                        </Td>
                        <Td>{tutor.academicCredentials}</Td>
                        {/*<Td>{tutor.courses.split(',').map((course: string, idx: number) => (
                          <div key={idx}>{course.trim()}</div>
                          ))}
                        </Td>*/}
                        <Td>
                          {tutor.availableFullTime ? "Full-time" : "Part-time"}
                        </Td>
                        <Td>
                          <textarea
                            value={comments[tutor.id] ?? tutor.comments ?? ''}
                            onChange={(e) =>
                              setComments({ ...comments, [tutor.id]: e.target.value })
                            }
                            rows={2}
                            style={{ width: '100%' }}
                          />
                      </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            {/*Submit button to submit rankings and update localStorage*/}
          <Button
            onClick={async () => {
              const updated = [...tutors];

              for (const tutor of selectedTutors) {
                const index = tutors.findIndex(t => t.id === tutor.id);
                if (index !== -1) {
                  const updatedTutor = {
                    ...tutor,
                    Comment: comments[tutor.id] || '',
                    Selected: false,
                    TimesSelected: (tutor.TimesSelected || 0) + 1,
                  };

                  updated[index] = updatedTutor;

                  try {
                    console.log('Sending updated tutor:', updatedTutor);
                    await fetch(`http://localhost:5050/api/tutors/${updatedTutor.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updatedTutor),
                    });
                  } catch (error) {
                    console.error(`Failed to update tutor ${updatedTutor.name}:`, error);
                  }
                }
              }

              try {
                const response = await fetch('http://localhost:5050/api/search');
                const data = await response.json();
                
                const deselectedData = data.map((t: any) => ({
                  ...t,
                  Selected: false,
                }));

                setTutors(deselectedData);

                const updatedComments: { [id: number]: string } = {};
                data.forEach((t: any) => {
                  updatedComments[t.id] = t.comments || '';
                });
                setComments(updatedComments);
              } catch (error) {
                console.error('Error re-fetching tutors after update:', error);
              }

              setRankings({});
              onClose();
            }}>
            Submit Rankings
          </Button>
          <Button onClick={onClose}>
            Cancel
          </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/*Button to open modal*/}
      <Button onClick={onOpen} data-testid = 'view-selected-tutors'>
        View Selected Tutors
      </Button>
      {/* Visual Summary of Tutor Selections */}
      <Box mt={10}>
        <Text fontWeight="bold" mb={2}>Tutor Selection Summary</Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold" mb={2}>Most Selected</Text>
            {(() => {
              const maxSelected = Math.max(...tutors.map(t => t.timesSelected || 0));
              const mostSelected = tutors.filter(t => (t.timesSelected || 0) === maxSelected && maxSelected > 0);
              return mostSelected.length > 0 ? mostSelected.map((t, i) => (
                <Text key={i}> {t.name} ({t.timesSelected} times)</Text>
              )) : <Text>No data.</Text>;
            })()}
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold" mb={2}>Least Selected (but at least once)</Text>
            {(() => {
              const filtered = tutors.filter(t => t.timesSelected && t.timesSelected > 0);
              const minSelected = Math.min(...filtered.map(t => t.timesSelected || 0));
              const leastSelected = filtered.filter(t => (t.timesSelected || 0) === minSelected);
              return leastSelected.length > 0 ? leastSelected.map((t, i) => (
                <Text key={i}> {t.name} ({t.timesSelected} time{t.timesSelected > 1 ? 's' : ''})</Text>
              )) : <Text>No data.</Text>;
            })()}
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold" mb={2}>Never Selected</Text>
            {(() => {
              const neverSelected = tutors.filter(t => !t.timesSelected);
              return neverSelected.length > 0 ? neverSelected.map((t, i) => (
                <Text key={i}> {t.name}</Text>
              )) : <Text>Everyone has been selected!</Text>;
            })()}
          </Box>
        </SimpleGrid>
      </Box>
    </Layout>
  );
}
