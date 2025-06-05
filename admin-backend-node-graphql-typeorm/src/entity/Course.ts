import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Course {
    @PrimaryGeneratedColumn({ type: "int"})
    id: number;

    @Column({ type: "int"})
    course_id: number;

    @Column({ type: "varchar", length: 255})
    name: string;
}