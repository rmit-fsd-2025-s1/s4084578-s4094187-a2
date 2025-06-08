import { useEffect, useState } from "react";
import { CourseWithSelectedTutors, tutorApplicationService } from "../services/api";

export default function Home() {

  const [coursesAndSelectedTutors, setCoursesAndSelectedTutors] = useState<CourseWithSelectedTutors[]>([])

  useEffect(() => {
    tutorApplicationService.getCoursesWithSelectedTutorApplications().then(setCoursesAndSelectedTutors)
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Selected Tutor Applications Report</h1>
      
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
    </div>
  )
}