import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tutor_Application } from "./Tutor_Application"

@Entity()
export class Tutor {
    @PrimaryGeneratedColumn({ type: "int"})
    id: number;

    @Column({ type: "varchar", length: 255})
    email: string;

    @Column({ type: "varchar", length: 255})
    password: string;

    @Column({ type: "varchar", length: 255})
    name: string;

    @Column({ type: "tinyint"})
    available_full_time: boolean;

    @Column({ type: "varchar", length: 255})
    skills_list: string;

    @Column({ type: "varchar", length: 255})
    credentials: string;

    @Column({ type: "tinyint"})
    blocked: boolean;

    @OneToMany(() => Tutor_Application, tutorApplication => tutorApplication.tutor)
    tutorApplications: Tutor_Application[];
}