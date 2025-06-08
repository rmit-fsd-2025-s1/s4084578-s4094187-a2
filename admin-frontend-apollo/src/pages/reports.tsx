import { useEffect, useState } from "react";
import { CourseWithSelectedTutors, Tutor, tutorApplicationService, tutorService } from "../services/api";

export default function Home() {

  const [coursesAndSelectedTutors, setCoursesAndSelectedTutors] = useState<CourseWithSelectedTutors[]>([])
  const [candidateMoreThan3, setCandidateMoreThan3] = useState<Tutor[]>([])

  useEffect(() => {
    tutorApplicationService.getCoursesWithSelectedTutorApplications().then(setCoursesAndSelectedTutors)
    tutorService.getTutorsWithMinApplications(3).then(setCandidateMoreThan3)
  }, []);

  return (
    <div>
      <h1>Selected Candidates by Course</h1>
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

      <h1>Candidates Selected by More than Three Courses</h1>
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
    </div>
  )
}