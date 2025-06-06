import "reflect-metadata";
import { DataSource } from "typeorm";
import { Course } from "./entity/Course";
import { Lecturer } from "./entity/Lecturer";
import { Tutor } from "./entity/Tutor";
import { Lecturer_Course } from "./entity/Lecturer_Course";
import { Tutor_Application } from "./entity/Tutor_Application";


export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: "S4084578",
  password: "pepwox-1voqpo-vEdqaq",
  database: "S4084578",
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [Course, Lecturer, Tutor, Lecturer_Course, Tutor_Application],
  migrations: [],
  subscribers: [],
});
