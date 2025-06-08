import { client } from "./apollo-client"
import { gql } from "@apollo/client"

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
    id: string;
    name: string;
    email: string;
  }
  course: {
    id: string;
    course_id: number;
    name: string;
  }
}

export interface CourseWithSelectedTutors extends Course {
  tutorApplications: TutorApplication[];
}

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      course_id
      name
    }
  }
`

const GET_LECTURERS = gql`
  query GetLecturers {
    lecturers {
      id
      email
      name
    }
  }
`

const GET_TUTORS = gql`
  query GetTutors {
    tutors {
      id
      name
      availableFullTime
      skillsList
      academicCredentials
      blocked
    }
  }
`

const TOGGLE_TUTOR_BLOCK = gql`
  mutation ToggleTutorBlock($id: ID!, $blocked: Boolean!) {
    updateTutorBlock(id: $id, blocked: $blocked) {
      id
      blocked
    }
  }
`

const CREATE_COURSE = gql`
  mutation CreateCourse($course_id: Int!, $name: String!) {
    createCourse(course_id: $course_id, name: $name) {
      id
      course_id
      name
    }
  }
`

const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($id: ID!, $course_id: Int, $name: String) {
    updateCourse(id: $id, course_id: $course_id, name: $name) {
      id
      course_id
      name
    }
  }
`

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`

const ASSIGN_COURSE = gql`
  mutation AssignCourse($lecturerId: ID!, $courseId: ID!) {
    assignCourseToLecturer(lecturerId: $lecturerId, courseId: $courseId) {
      lecturer_course_id
      course { id name }
    }
  }
`

const GET_LECTURER_COURSES = gql`
  query GetLecturerCourses($lecturerId: ID!) {
    lecturerCourses(lecturerId: $lecturerId) {
      lecturer_course_id
      lecturer {
        id
      }
      course {
        id
        course_id
        name
      }
    }
  }
`

const UNASSIGN_COURSE = gql`
  mutation UnassignCourse($lecturerCourseId: ID!) {
    deleteLecturerCourse(lecturerCourseId: $lecturerCourseId)
  }
`

const GET_SELECTED_TUTOR_APPLICATIONS = gql`
  query GetSelectedTutorApplications {
    courses {
      id
      course_id
      name
      tutorApplications(filter: { selected: true }) {
        tutor_application_id
        selected
        tutor {
          id
          name
          email
        }
        course {
          id
          course_id
          name
        }
      }
    }
  }
`

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
