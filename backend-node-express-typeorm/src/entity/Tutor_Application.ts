import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from "typeorm";
import { Tutor } from "./Tutor";
import { Course } from "./Course";

@Entity()
@Unique(["tutor", "course", "tutorRole"])
export class Tutor_Application {
    @PrimaryGeneratedColumn({type: "int"})
    tutor_application_id: number;

    @Column({ type: "tinyint", default: false})
    selected: boolean;

    @Column({ type: "tinyint", default: false})
    tutorRole: boolean;

    @ManyToOne(() => Tutor, tutor => tutor.tutorApplications, { onDelete: "CASCADE" })
    tutor: Tutor;

    @ManyToOne(() => Course, course => course.tutorApplications, { onDelete: "CASCADE" })
    course: Course;
}
