import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tutor_Application } from "./Tutor_Application"

@Entity()
export class Tutor {
    @PrimaryGeneratedColumn({ type: "int"})
    id: string;

    @Column({ type: "varchar", length: 255})
    email: string;

    @Column({ type: "varchar", length: 255})
    password: string;

    @Column({ type: "varchar", length: 255})
    name: string;

    @Column({ type: "tinyint"})
    availableFullTime: boolean;

    @Column({ type: "varchar", length: 255})
    skillsList: string;

    @Column({ type: "varchar", length: 255})
    academicCredentials: string;

    @Column({ type: "tinyint"})
    blocked: boolean;

    @OneToMany(() => Tutor_Application, tutorApplication => tutorApplication.tutor)
    tutorApplications: Tutor_Application[];
}