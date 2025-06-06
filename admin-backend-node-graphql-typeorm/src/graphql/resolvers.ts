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
    createCourse: async (
      _: unknown,
      { course_id, name }: { course_id: number; name: string }
    ) => {
      const course = courseRepository.create({ course_id, name });
      return await courseRepository.save(course);
    },

    updateCourse: async (
      _: unknown,
      args: {id: number; course_id?: number; name?: string}
    ) => {
      const {id, course_id, name} = args
      // find related course
      const course = await courseRepository.findOneBy({id})
      // error if course doesn't exist
      if (!course) throw new Error(`Course with id ${id} not found`)
      
      // update values in correct course
      if (typeof course_id === "number") course.course_id = course_id
      if (typeof name === "string") course.name = name;
      return await courseRepository.save(course)
    },

    deleteCourse: async (
      _: unknown,
      { id }: { id: number }
    ) => {
      const result = await courseRepository.delete({ id });
      // error if course doesn't exist
      if (!result.affected) throw new Error(`Course with id ${id} not found`);
      return true;
    }
  }
};