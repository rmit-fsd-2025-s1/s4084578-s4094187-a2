import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Course } from "./Course";

@Entity()
@Unique(["lecturer", "course"])
export class Lecturer_Course {
    @PrimaryGeneratedColumn({type: "int"})
    lecturer_course_id: number;

    @ManyToOne(() => Lecturer, lecturer => lecturer.lecturerCourses, { onDelete: "CASCADE" })
    @JoinColumn({ name: "lecturerId" })
    lecturer: Lecturer;

    @ManyToOne(() => Course, course => course.lecturerCourses, { onDelete: "CASCADE" })
    @JoinColumn({ name: "courseId" })
    course: Course;
}