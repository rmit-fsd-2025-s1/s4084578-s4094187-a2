// npm run sample

import { AppDataSource } from './data-source';
import { Tutor } from "./entity/Tutor";
import { Lecturer } from "./entity/Lecturer";
import { Course } from "./entity/Course";
import { Tutor_Application } from './entity/Tutor_Application';
import { Lecturer_Course } from './entity/Lecturer_Course';
import { sampleCourses, sampleLecturerCourses, sampleLecturers, sampleTutorApplications, sampleTutors } from './sampleData';

AppDataSource.initialize().then(async () => {
  const tutorRepo = AppDataSource.getRepository(Tutor);
  const lecturerRepo = AppDataSource.getRepository(Lecturer);
  const courseRepo = AppDataSource.getRepository(Course);
  const tutAppRepo = AppDataSource.getRepository(Tutor_Application);
  const lecCourseRepo = AppDataSource.getRepository(Lecturer_Course);

  // Insert tutors
  for (const tutor of sampleTutors) {
    const newTutor = tutorRepo.create(tutor);
    await tutorRepo.save(newTutor);
  }

  // Insert lecturers
  for (const lecturer of sampleLecturers) {
    const newLecturer = lecturerRepo.create(lecturer);
    await lecturerRepo.save(newLecturer);
  }

  // Insert courses
  for (const course of sampleCourses) {
    const newCourse = courseRepo.create(course);
    await courseRepo.save(newCourse);
  }

  const tutors = await tutorRepo.find();
  const lecturers = await lecturerRepo.find();
  const courses = await courseRepo.find();

  // Insert tutor applications
  for (const app of sampleTutorApplications) {
    const tutor = tutors[app.tutor - 1];
    const course = courses[app.courseID - 1];

    if (!tutor || !course) continue;

    const newTutApp = tutAppRepo.create({
      selected: app.selected,
      tutorRole: app.tutorRole,
      tutor,
      course
    });

    await tutAppRepo.save(newTutApp);
  }

  // Insert lecturer courses
  for (const lecCourse of sampleLecturerCourses) {
    const lecturer = lecturers[lecCourse.lecturerId - 1];
    const course = courses[lecCourse.courseId - 1];

    if (!lecturer || !course) continue;

    const newLecCourse = lecCourseRepo.create({
      lecturer,
      course
    });

    await lecCourseRepo.save(newLecCourse);
  }

  console.log("Sample users inserted.");
  process.exit(0);
}).catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});