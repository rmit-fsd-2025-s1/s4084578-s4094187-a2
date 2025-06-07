import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";

export class CourseController {
  private courseRepository = AppDataSource.getRepository(Course);

  // retrive all courses
  async getAll(_: Request, response: Response) {
    const courses = await this.courseRepository.find();
    return response.json(courses);
  }
}
