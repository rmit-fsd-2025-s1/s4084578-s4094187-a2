import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  lecturer: boolean;

  @Column({ default: false })
  selected: boolean;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  skills: string;

  @Column({ nullable: true })
  creds: string;

  @Column({ nullable: true })
  courses: string;

  @Column({ nullable: true })
  available: string;

  @Column({ default: 0 })
  timesSelected: number;
}
