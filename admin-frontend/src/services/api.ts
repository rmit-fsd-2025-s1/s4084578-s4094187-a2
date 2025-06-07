import { client } from "./apollo-client"
import { gql } from "@apollo/client"

export interface Course {
  id: string;
  course_id: number;
  name: string;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
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

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const { data } = await client.query({ query: GET_COURSES, fetchPolicy: "network-only" })
    return data.courses
  },

  createCourse: async (course_id: number, name: string): Promise<Course> => {
    const { data } = await client.mutate({ mutation: CREATE_COURSE, variables: { course_id, name } })
    return data.createCourse
  },

  updateCourse: async (id: string, course_id: number, name: string): Promise<Course> => {
    const { data } = await client.mutate({ mutation: UPDATE_COURSE_MUTATION, variables: { id, course_id, name } })
    return data.updateCourse
  },

  deleteCourse: async (id: string): Promise<void> => {
    await client.mutate({ mutation: DELETE_COURSE, variables: { id }})
  }
}

export const lecturerService ={
  getLecturers: async (): Promise<Lecturer[]> => {
    const { data } = await client.query({ query: GET_LECTURERS, fetchPolicy: "network-only" })
    return data.lecturers
  },
}