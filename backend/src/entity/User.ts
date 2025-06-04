import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  lecturer: boolean;

  @Column({ unique: true })
  selected: boolean;

  @Column()
  name: string;

  @Column()
  skills: string;

  @Column()
  creds: string;

  @Column()
  courses: string;

  @Column()
  available: string;

  @Column()
  timesSelected: number;
}
