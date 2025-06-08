import { Lecturer } from "../entity/Lecturer"
import { AppDataSource } from "../data-source"
import { Course } from "../entity/Course"
import { Lecturer_Course } from "../entity/Lecturer_Course"
import { Tutor } from "../entity/Tutor"
import { Tutor_Application } from "../entity/Tutor_Application"
import { In } from "typeorm"

const courseRepository = AppDataSource.getRepository(Course)
const lecturerRepository = AppDataSource.getRepository(Lecturer)
const lecturerCourseRepository = AppDataSource.getRepository(Lecturer_Course)
const tutorRepository = AppDataSource.getRepository(Tutor)
const tutorApplicationRepository = AppDataSource.getRepository(Tutor_Application)

export const resolvers = {

  Query: {
    courses: async () => {
      return await courseRepository.find()
    },

    lecturers: async () => {
      return await lecturerRepository.find()
    },

    tutors: async () => {
      return await tutorRepository.find()
    },

    lecturerCourses: async (
      _: unknown, 
      { lecturerId }: { lecturerId: number }
    ) =>
    lecturerCourseRepository.find({
      where: { lecturer: { id: lecturerId } },
      relations: { course: true, lecturer: true }
    }),

    tutorsWithMinApplications: async (
      _: unknown,
      { min }: { min: number }
    ) => {
      const tutorsWithMinSelections = await tutorApplicationRepository
        .createQueryBuilder("currentTutorApplication")
        .leftJoin("currentTutorApplication.tutor", "tutor")
        .leftJoin("currentTutorApplication.course", "course")
        .where("currentTutorApplication.selected = :selected", { selected: true })
        .select("tutor.id", "tutorId")
        .groupBy("tutor.id")
        .having("COUNT(DISTINCT course.id) >= :min", { min })
        .getRawMany<{ tutorId: number }>();

      const tutorIds = tutorsWithMinSelections.map(row => row.tutorId);
      if (tutorIds.length === 0) return [];
      return tutorRepository.findBy({ id: In(tutorIds) });
    },

    unselectedTutors: async () => {
      const selectedTutorRows = await tutorApplicationRepository
        .createQueryBuilder("tutorApplication")
        .select("tutorApplication.tutorId", "tutorId")
        .where("tutorApplication.selected = :selected", { selected: true })
        .groupBy("tutorApplication.tutorId")
        .getRawMany<{ tutorId: number }>();

      const selectedTutorIds = selectedTutorRows.map(row => row.tutorId);

      const query = tutorRepository.createQueryBuilder("tutor");

      if (selectedTutorIds.length > 0) {
        query.where("tutor.id NOT IN (:...selectedTutorIds)", { selectedTutorIds });
      }

      return query.getMany();
    }
  },

  Mutation: {
    createCourse: async (
      _: unknown,
      { course_id, name }: { course_id: string; name: string }
    ) => {
      const course = courseRepository.create({ course_id, name })
      return await courseRepository.save(course);
    },

    updateCourse: async (
      _: unknown,
      args: {id: number; course_id?: string; name?: string}
    ) => {
      const {id, course_id, name} = args
      // find related course
      const course = await courseRepository.findOneBy({ id })
      // error if course doesn't exist
      if (!course) throw new Error(`Course with id ${id} not found`)
      
      // update values in correct course
      if (typeof course_id === "string") course.course_id = course_id
      if (typeof name === "string") course.name = name
      return await courseRepository.save(course)
    },

    deleteCourse: async (
      _: unknown,
      { id }: { id: number }
    ) => {
      const result = await courseRepository.delete({ id })
      // error if course doesn't exist
      if (!result.affected) throw new Error(`Course with id ${id} not found`)
      return true
    },

    assignCourseToLecturer: async (
      _: unknown, 
      { lecturerId, courseId }: { lecturerId: number; courseId: number }
    ) => {
      // find related lecturer and course
      const [lecturer, course] = await Promise.all([
        lecturerRepository.findOneByOrFail({ id: lecturerId }),
        courseRepository.findOneByOrFail({ id: courseId })
      ])
      // look for existing row in database
      let existing = await lecturerCourseRepository.findOne({
        where: { lecturer: { id: lecturerId }, course: { id: courseId } },
        relations: { lecturer: true, course: true }
      })
      // if the row already exists, return it
      if (existing) return existing
      // otherwise, save a new row in the database
      const lecturerCourse = lecturerCourseRepository.create({ lecturer, course })
      return lecturerCourseRepository.save(lecturerCourse)
    },

    // unassign lecturer from a course
    deleteLecturerCourse: async (
      _: unknown,
      { lecturerCourseId }: { lecturerCourseId: number }
    ) => {
      const result = await lecturerCourseRepository.delete({ lecturer_course_id: lecturerCourseId })
      if (!result.affected) {
        throw new Error(`Lecturer_Course row ${lecturerCourseId} not found`)
      }
      return true
    },

    // block and unblock tutors
    updateTutorBlock: async (_: any, { id, blocked }: { id: number, blocked: boolean }) => {
      const tutor = await tutorRepository.findOneBy({ id });
      if (!tutor) {
        throw new Error("Tutor not found");
      }
      tutor.blocked = blocked;
      await tutorRepository.save(tutor);
      return tutor;
    }
  },

  // add a course resolver to grab tutor applications relative to the course
  Course: {
    // ensure functionality to filter by selected
    tutorApplications: async (
      parent: Course,
      args: { filter?: { selected?: boolean } }
    ) => {
      // find parent course
      const parentCourse: any = { course: { id: parent.id } };
      // filter if the argument was passed into the function
      if (args.filter?.selected !== undefined) {
        parentCourse.selected = args.filter.selected;
      }
      return await tutorApplicationRepository.find({
        where: parentCourse,
        relations: { tutor: true, course: true }
      });
    }
  },

  Tutor_Application: {
  course: async (parent: Tutor_Application) => {
    return await courseRepository.findOneBy({ id: parent.course.id });
  },
  tutor: async (parent: Tutor_Application) => {
    return await tutorRepository.findOneBy({ id: parent.tutor.id });
  }
}
}