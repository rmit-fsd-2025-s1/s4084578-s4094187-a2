import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Lecturer {
    @PrimaryGeneratedColumn({ type: "int"})
    id: number;

    @Column({ type: "varchar", length: 255})
    email: string;

    @Column({ type: "varchar", length: 255})
    password: string;
}