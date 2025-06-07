import { Lecturer } from "../entity/Lecturer"
import { AppDataSource } from "../data-source"
import { Course } from "../entity/Course"
import { Lecturer_Course } from "../entity/Lecturer_Course"

const courseRepository = AppDataSource.getRepository(Course)
const lecturerRepostiory = AppDataSource.getRepository(Lecturer)
const lecturerCourseRepository = AppDataSource.getRepository(Lecturer_Course)

export const resolvers = {

  Query: {
    courses: async () => {
      return await courseRepository.find()
    },

    lecturers: async () => {
      return await lecturerRepostiory.find()
    },

    lecturerCourses: async (
      _: unknown, 
      { lecturerId }: { lecturerId: string }
    ) =>
      lecturerCourseRepository.find({
        where: { lecturer: { id: lecturerId } },
        relations: { course: true, lecturer: true }
      }),
  },

  Mutation: {
    createCourse: async (
      _: unknown,
      { course_id, name }: { course_id: number; name: string }
    ) => {
      const course = courseRepository.create({ course_id, name })
      return await courseRepository.save(course);
    },

    updateCourse: async (
      _: unknown,
      args: {id: string; course_id?: number; name?: string}
    ) => {
      const {id, course_id, name} = args
      // find related course
      const course = await courseRepository.findOneBy({ id })
      // error if course doesn't exist
      if (!course) throw new Error(`Course with id ${id} not found`)
      
      // update values in correct course
      if (typeof course_id === "number") course.course_id = course_id
      if (typeof name === "string") course.name = name
      return await courseRepository.save(course)
    },

    deleteCourse: async (
      _: unknown,
      { id }: { id: string }
    ) => {
      const result = await courseRepository.delete({ id })
      // error if course doesn't exist
      if (!result.affected) throw new Error(`Course with id ${id} not found`)
      return true
    },

    assignCourseToLecturer: async (
      _: unknown, 
      { lecturerId, courseId }: { lecturerId: string; courseId: string }
    ) => {
      const [lecturer, course] = await Promise.all([
        lecturerRepostiory.findOneByOrFail({ id: lecturerId }),
        courseRepository.findOneByOrFail({ id: courseId })
      ]);
      const lecturerCourse = lecturerCourseRepository.create({ lecturer, course })
      return lecturerCourseRepository.save(lecturerCourse)
    },
  },
}