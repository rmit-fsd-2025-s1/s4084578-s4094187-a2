import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: "S4094187",
  password: "S4094187",
  database: "S4094187",
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});