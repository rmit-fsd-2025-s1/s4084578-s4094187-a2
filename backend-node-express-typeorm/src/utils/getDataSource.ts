import { AppDataSource } from "../data-source";
import { TestDataSource } from "../test-data-source";

export const getDataSource = () => {
  return process.env.NODE_ENV === "test" ? TestDataSource : AppDataSource;
};
