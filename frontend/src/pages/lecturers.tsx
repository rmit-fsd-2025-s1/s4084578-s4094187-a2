import { useEffect, useState } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Checkbox,
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, useDisclosure, Input, Box, Text, SimpleGrid
} from '@chakra-ui/react';
import Layout from '../components/Layout';

export default function Home() {
  type Tutor = {
    id: number;
    name: string;
    availableFullTime: boolean;
    skillsList: string;
    academicCredentials: string;
    Selected?: boolean;
    timesSelected: number;
    blocked: boolean;
    comments?: string;
    courses?: string;
    course?: string;
  };

  type Course = { 
    id: number;
    course_id: string;
    name: string;
  }

  const flattenTutorsByCourse = (tutors: Tutor[]) => {
    const flatList: Tutor[] = [];
    tutors.forEach(tutor => {
      const courseList = tutor.courses?.split(',').map(c => c.trim()) || [''];
      courseList.forEach(course => {
        flatList.push({ ...tutor, course });
      });
    });
    return flatList;
  };

  const getUniqueTutors = (tutors: Tutor[]) => {
    const map = new Map<number, Tutor>();
    tutors.forEach(t => {
      if (!map.has(t.id)) {
        map.set(t.id, t);
      }
    });
    return Array.from(map.values());
  };

  const fetchLecturerCourses = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/lecCourses?lecturerId=${localStorage.ID}`);
      const courses = await response.json();
      console.log('Courses fetched for lecturer:', courses);
      setAllowedCourses(courses.map((course: Course) => course.name));
    } catch (error) {
      console.error("Error fetching lecturer courses:", error);
    }
  };

  const [tutors, setTutors] = useState<Tutor[]>([]); //Hold tutor data
  const { isOpen, onOpen, onClose } = useDisclosure(); //Modal control
  const [rankings, setRankings] = useState<{ [tutorId: number]: number }>({});
  const [comments, setComments] = useState<{ [tutorId: number]: string }>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null); //Choose which column to sort with
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); //Choose if sorting is ascending or descending
  const [searchTerm, setSearchTerm] = useState(''); //Search bar input
  const [lecturerLoginExists, setLecturerLoginExists] = useState(false); //Check if user has lecturer permissions
  const [allowedCourses, setAllowedCourses] = useState<string[]>([]);

  useEffect(() => {
    // setup login validation
    const lecturerLoginCheck = localStorage.getItem("login");
    if (lecturerLoginCheck == "lecturer" || lecturerLoginCheck == "admin") {
      setLecturerLoginExists(true)
      fetchLecturerCourses();
    }

    const fetchTutors = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/search?searchTerm=${encodeURIComponent(searchTerm)}`);
        
        const data = await response.json();
        const flatData = flattenTutorsByCourse(data);
        setTutors(flatData);

        const initialComments: { [id: number]: string } = {};
        data.forEach((t: Tutor) => {
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
          const flatData = flattenTutorsByCourse(data);
          setTutors(flatData);
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
  
    const valA = a[sortColumn as keyof Tutor];
    const valB = b[sortColumn as keyof Tutor];
  
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
              <Th onClick={() => handleSort('course')} cursor="pointer">
                Courses {sortColumn === 'Courses' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </Th>
              <Th onClick={() => handleSort('availableFullTime')} cursor="pointer">
                Availability {sortColumn === 'availableFullTime' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {/*Iterate through tutors*/}
            {sortedTutors
              .filter(tutor => allowedCourses.includes(tutor.course || ''))
              .map((tutor, i) => (
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
                <Td>{tutor.course || 'N/A'}</Td>
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
                    <Th onClick={() => handleSort('course')} cursor="pointer">
                      Courses {sortColumn === 'Courses' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </Th>
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
                        <Td>{tutor.course || 'N/A'}</Td>
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
                    TimesSelected: (tutor.timesSelected || 0) + 1,
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
                
                const deselectedData = data.map((t: Tutor) => ({
                  ...t,
                  Selected: false,
                }));

                setTutors(deselectedData);

                const updatedComments: { [id: number]: string } = {};
                data.forEach((t: Tutor) => {
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
              const uniqueTutors = getUniqueTutors(tutors);
              const maxSelected = Math.max(...uniqueTutors.map(t => t.timesSelected || 0));
              const mostSelected = uniqueTutors.filter(t => (t.timesSelected || 0) === maxSelected && maxSelected > 0);
              return mostSelected.length > 0 ? mostSelected.map((t, i) => (
                <Text key={i}> {t.name} ({t.timesSelected} times)</Text>
              )) : <Text>No data.</Text>;
            })()}
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold" mb={2}>Least Selected (but at least once)</Text>
            {(() => {
              const uniqueTutors = getUniqueTutors(tutors);
              const filtered = uniqueTutors.filter(t => t.timesSelected && t.timesSelected > 0);
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
              const uniqueTutors = getUniqueTutors(tutors);
              const neverSelected = uniqueTutors.filter(t => !t.timesSelected);
              return neverSelected.length > 0 ? neverSelected.map((t, i) => (
                <Text key={i}> {t.name}</Text>
              )) : <Text>Everyone has been selected!</Text>;
            })()}
          </Box>
        </SimpleGrid>

        {/* Bar Graph */}
        <Box mt={10} p={4} borderWidth="1px" borderRadius="lg">
          <Text fontWeight="bold" mb={4}>Times Selected Per Tutor</Text>
          {tutors.length === 0 ? (
            <Text>No tutors found.</Text>
          ) : (
            <Box>
              {(() => {
                const uniqueTutors = getUniqueTutors(tutors);
                const maxTimes = Math.max(...uniqueTutors.map(t => t.timesSelected || 0)) || 1; // avoid divide by 0
                return uniqueTutors.map((t, i) => (
                  <Box key={i} mb={2}>
                    <Text fontSize="sm">{t.name} ({t.timesSelected || 0})</Text>
                    <Box bg="gray.100" h="6" borderRadius="md" overflow="hidden">
                      <Box
                        h="100%"
                        bg="teal.500"
                        width={`${((t.timesSelected || 0) / maxTimes) * 100}%`}
                        transition="width 0.3s ease"
                      />
                    </Box>
                  </Box>
                ));
              })()}
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
