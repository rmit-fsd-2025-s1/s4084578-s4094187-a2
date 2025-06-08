import { Request, Response } from "express";
import { Course } from "../entity/Course";
import { getDataSource } from "../utils/getDataSource";

export class CourseController {
  courseRepository = getDataSource().getRepository(Course)

  // retrive all courses
  async getAll(_: Request, response: Response) {
    const courses = await this.courseRepository.find();
    if (courses.length === 0) {
      return response.status(200).json({ message: "No courses found in the database", courses: [] })
    }
    return response.json(courses);
  }
}
