import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Course } from "./Course";

@Entity()
@Unique(["lecturer", "course"])
export class Lecturer_Course {
    @PrimaryGeneratedColumn({type: "int"})
    lecturer_course_id: string;

    @ManyToOne(() => Lecturer, lecturer => lecturer.lecturerCourses, { onDelete: "CASCADE" })
    lecturer: Lecturer;

    @ManyToOne(() => Course, course => course.lecturerCourses, { onDelete: "CASCADE" })
    course: Course;
}