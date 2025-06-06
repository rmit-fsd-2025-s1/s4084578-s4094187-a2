import { useEffect, useState } from "react";
import { Course, courseService } from "@/services/api";

export default function Home() {

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    courseService.getCourses().then(setCourses);
  }, []);

  return (
    <div>
      {courses.map((Course) => (
        <p>{Course.course_id}: {Course.name}</p>
      ))}
    </div>
  )
}
