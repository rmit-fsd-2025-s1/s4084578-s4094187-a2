import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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

    @Column({ type: "tinyint", length: 1})
    available_full_time: boolean;

    @Column({ type: "varchar", length: 255})
    skills_list: string;

    @Column({ type: "varchar", length: 255})
    credentials: string;

    @Column({ type: "tinyint", length: 1})
    blocked: boolean;
}