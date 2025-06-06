import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: "S4084578",
  password: "pepwox-1voqpo-vEdqaq",
  database: "S4084578",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});