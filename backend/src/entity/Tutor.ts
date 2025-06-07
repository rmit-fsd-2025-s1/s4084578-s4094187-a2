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
    availableFullTime: boolean;

    @Column({ type: "varchar", length: 255})
    skillsList: string;

    @Column({ type: "varchar", length: 255})
    academicCredentials: string;

    @Column({type: "int", default: 0})
    timesSelected: number;

    @Column({default: false, type: "tinyint"})
    blocked: boolean;

    @Column({ nullable: true, type: "varchar", length: 255})
    comments: string;

    @OneToMany(() => Tutor_Application, tutorApplication => tutorApplication.tutor)
    tutorApplications: Tutor_Application[];
}