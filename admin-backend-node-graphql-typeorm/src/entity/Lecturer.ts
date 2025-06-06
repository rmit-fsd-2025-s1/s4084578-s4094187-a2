import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Lecturer_Course } from "./Lecturer_Course";

@Entity()
export class Lecturer {
    @PrimaryGeneratedColumn({ type: "int"})
    id: number;

    @Column({ type: "varchar", length: 255})
    email: string;

    @Column({ type: "varchar", length: 255})
    password: string;

    @Column({ type: "varchar", length: 255})
    name: string;

    @OneToMany(() => Lecturer_Course, lecturerCourse => lecturerCourse.lecturer)
    lecturerCourses: Lecturer_Course[];
}