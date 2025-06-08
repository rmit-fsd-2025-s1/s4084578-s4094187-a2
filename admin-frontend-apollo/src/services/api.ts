import { client } from "./apollo-client"
import { 
  ASSIGN_COURSE, CREATE_COURSE, DELETE_COURSE, GET_COURSES, GET_LECTURER_COURSES, GET_LECTURERS, 
  GET_SELECTED_TUTOR_APPLICATIONS, GET_TUTORS, GET_TUTORS_WITH_MIN_APPLICATIONS, 
  GET_UNSELECTED_TUTORS, TOGGLE_TUTOR_BLOCK, UNASSIGN_COURSE, UPDATE_COURSE_MUTATION 
} from "./queries";

export interface Course {
  id: number;
  course_id: string;
  name: string;
}

export interface Lecturer {
  id: number;
  name: string;
  email: string;
}

export interface Tutor {
  id: number;
  name: string;
  email: string;
  availableFullTime: boolean;
  skillsList: string;
  academicCredentials: string;
  blocked: boolean;
}

export interface LecturerCourse {
  lecturer_course_id: number;
  lecturer: {
    id: number;
  }
  course: {
    id: number;
    course_id: string;
    name: string;
  }
}

export interface TutorApplication {
  tutor_application_id: number;
  selected: boolean;
  tutor: {
    id: number;
    name: string;
    email: string;
  }
  course: {
    id: number;
    course_id: string;
    name: string;
  }
}

export interface CourseWithSelectedTutors extends Course {
  tutorApplications: TutorApplication[];
}

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const { data } = await client.query({ query: GET_COURSES, fetchPolicy: "network-only" })
    return data.courses
  },

  createCourse: async (course_id: string, name: string): Promise<Course> => {
    const { data } = await client.mutate({ mutation: CREATE_COURSE, variables: { course_id, name } })
    return data.createCourse
  },

  updateCourse: async (id: number, course_id: string, name: string): Promise<Course> => {
    const { data } = await client.mutate({ mutation: UPDATE_COURSE_MUTATION, variables: { id, course_id, name } })
    return data.updateCourse
  },

  deleteCourse: async (id: number): Promise<void> => {
    await client.mutate({ mutation: DELETE_COURSE, variables: { id }})
  }
}

export const lecturerService ={
  getLecturers: async (): Promise<Lecturer[]> => {
    const { data } = await client.query({ query: GET_LECTURERS, fetchPolicy: "network-only" })
    return data.lecturers
  }
}

export const tutorService ={
  getTutors: async (): Promise<Tutor[]> => {
    const { data } = await client.query({ query: GET_TUTORS, fetchPolicy: "network-only" })
    return data.tutors
  },

  toggleTutorBlock: async (id: number, blocked: boolean): Promise<void> => {
    await client.mutate({
      mutation: TOGGLE_TUTOR_BLOCK,
      variables: { id, blocked },
    })
  },

  getTutorsWithSelections: async (min: number): Promise<Tutor[]> => {
    const { data } = await client.query({
      query: GET_TUTORS_WITH_MIN_APPLICATIONS,
      variables: { min },
      fetchPolicy: "network-only"
    });
    return data.tutorsWithMinApplications;
  },

  getUnselectedTutors: async (): Promise<Tutor[]> => {
  const { data } = await client.query({
    query: GET_UNSELECTED_TUTORS,
    fetchPolicy: "network-only"
  });
  return data.unselectedTutors;
}

}

export const lecturerCourseService = {
  assignCourse: async (lecturerId: number, courseId: number): Promise<LecturerCourse> => {
    const { data } = await client.mutate({
      mutation: ASSIGN_COURSE,
      variables: { lecturerId, courseId }
    })
    return data.assignCourseToLecturer
  },

  getCoursesByLecturerId: async (lecturerId: number): Promise<LecturerCourse[]> => {
    const { data } = await client.query({
      query: GET_LECTURER_COURSES, 
      variables: {lecturerId},
      fetchPolicy: "network-only"
    })
    return data.lecturerCourses
  },

  deleteLecturerCourse: async (lecturerCourseId: number): Promise<boolean> => {
    const { data } = await client.mutate({
      mutation: UNASSIGN_COURSE,
      variables: { lecturerCourseId }
    })
    return data.deleteLecturerCourse
  }
}

export const tutorApplicationService = {
  getCoursesWithSelectedTutorApplications: async (): Promise<CourseWithSelectedTutors[]> => {
    const { data } = await client.query({
      query: GET_SELECTED_TUTOR_APPLICATIONS,
      fetchPolicy: "network-only"
    });
    return data.courses as CourseWithSelectedTutors[];
  }
}
