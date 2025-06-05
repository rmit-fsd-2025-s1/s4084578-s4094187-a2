import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";

const courseRepository = AppDataSource.getRepository(Course);

export const resolvers = {

  Query: {
    hello: () => 'Hello World!',
    courses: async () => {
      return await courseRepository.find();
    },
  },

  Mutation: {
    createCourse: async (_: any,{ course_id, name }: { course_id: number; name: string }) => {
      const course = courseRepository.create({ course_id, name });
      return await courseRepository.save(course);
    }
  }
};