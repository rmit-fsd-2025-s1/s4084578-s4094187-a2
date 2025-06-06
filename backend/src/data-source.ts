import "reflect-metadata";
import { DataSource } from "typeorm";
import { Tutor } from "./entity/Tutor";
import { Lecturer } from "./entity/Lecturer";
import { Tutor_Application } from "./entity/Tutor_Application";
import { Lecturer_Course } from "./entity/Lecturer_Course";
import { Course } from "./entity/Course";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: "S4084578",
  password: "pepwox-1voqpo-vEdqaq",
  database: "S4084578",
  synchronize: true,
  logging: false,
  entities: [Tutor, Lecturer, Tutor_Application, Lecturer_Course, Course],
  migrations: [],
  subscribers: [],
});