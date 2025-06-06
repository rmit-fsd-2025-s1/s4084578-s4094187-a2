import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from "typeorm";
import { Tutor } from "./Tutor";
import { Course } from "./Course";

@Entity()
@Unique(["tutor", "course"])
export class Tutor_Application {
    @PrimaryGeneratedColumn({type: "int"})
    tutor_course_id: number;

    @Column({ type: "tinyint"})
    selected: boolean;

    @ManyToOne(() => Tutor, tutor => tutor.tutorApplications, { onDelete: "CASCADE" })
    tutor: Tutor;

    @ManyToOne(() => Course, course => course.tutorApplications, { onDelete: "CASCADE" })
    course: Course;
}
