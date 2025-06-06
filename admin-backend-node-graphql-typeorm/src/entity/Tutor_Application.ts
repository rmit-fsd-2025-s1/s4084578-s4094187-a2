import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Tutor } from "./Tutor";
import { Course } from "./Course";

@Entity()
export class Tutor_Application {
    @PrimaryGeneratedColumn({type: "int"})
    tutor_course_id: number;

    @ManyToOne(() => Tutor, tutor => tutor.tutorApplications, { onDelete: "CASCADE" })
    tutor: Tutor;

    @ManyToOne(() => Course, course => course.lecturerCourses, { onDelete: "CASCADE" })
    course: Course;
}
