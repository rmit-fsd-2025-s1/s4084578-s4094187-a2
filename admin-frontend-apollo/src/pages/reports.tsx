import { useEffect, useState } from "react";
import { CourseWithSelectedTutors, Tutor, tutorApplicationService, tutorService } from "../services/api";
import { Box } from "@chakra-ui/react";

export default function Home() {

  const [coursesAndSelectedTutors, setCoursesAndSelectedTutors] = useState<CourseWithSelectedTutors[]>([])
  const [candidateMoreThan3, setCandidateMoreThan3] = useState<Tutor[]>([])
  const [unselected, setUnselected] = useState<Tutor[]>([])

  useEffect(() => {
    tutorApplicationService.getCoursesWithSelectedTutorApplications().then(setCoursesAndSelectedTutors)
    tutorService.getTutorsWithSelections(3).then(setCandidateMoreThan3)
    tutorService.getUnselectedTutors().then(setUnselected)
  }, []);

  return (
    <div>
      <Box className="box">
        <h1>Selected candidates by course</h1>
        <br/>
        {coursesAndSelectedTutors.length === 0 ? (
          <p>No selected tutor applications found.</p>
        ) : (
          coursesAndSelectedTutors.map((course) => (
            <div key={course.id}>
              <h2>{course.course_id} - {course.name}</h2>
              {course.tutorApplications.length === 0 ? (
                <p>No tutors selected for this course.</p>
              ) : (
                <ul>
                  {course.tutorApplications.map((app) => (
                    <li key={app.tutor_application_id}>{app.tutor.name} ({app.tutor.email})</li>
                  ))}
                </ul>
              )}
              <br/>
            </div>
          ))
        )}
      </Box>

      <br/>
      <Box className="box">
        <h1>Candidates selected by more than three courses</h1>
        {candidateMoreThan3.length === 0 ? (
          <p> There are no candidates selected by more than three courses.</p>
        ) : (
          <ul>
            {candidateMoreThan3.map((tutor) => (
              <li key={tutor.id}>{tutor.name} ({tutor.email})</li>
            ))}
          </ul>
        )
        }
      </Box>

      <br/>
      <Box className="box">
        <h1>Candidates who have not been chosen for any course.</h1>
        {unselected.length === 0 ? (
          <p> There are no candidates selected by more than three courses.</p>
        ) : (
          <ul>
            {unselected.map((tutor) => (
              <li key={tutor.id}>{tutor.name} ({tutor.email})</li>
            ))}
          </ul>
        )
        }
      </Box>

    </div>
  )
}