import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Lecturer_Course } from "./Lecturer_Course";

@Entity()
export class Course {
    @PrimaryGeneratedColumn({ type: "int"})
    id: number;

    @Column({ type: "int"})
    course_id: number;

    @Column({ type: "varchar", length: 255})
    name: string;

    @OneToMany(() => Lecturer_Course, lecturerCourse => lecturerCourse.course)
    lecturerCourses: Lecturer_Course[];
}