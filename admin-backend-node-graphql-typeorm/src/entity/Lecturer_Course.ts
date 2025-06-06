import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Course } from "./Course";

@Entity()
export class Lecturer_Course {
    @PrimaryGeneratedColumn({type: "int"})
    lecturer_course_id: number;

    @ManyToOne(() => Lecturer, lecturer => lecturer.lecturerCourses, { onDelete: "CASCADE" })
    lecturer: Lecturer;

    @ManyToOne(() => Course, course => course.lecturerCourses, { onDelete: "CASCADE" })
    course: Course;
}