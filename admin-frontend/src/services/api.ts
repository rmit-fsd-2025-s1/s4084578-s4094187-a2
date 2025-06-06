import { client } from "./apollo-client";
import { gql } from "@apollo/client";

export interface Course {
  id: string;
  course_id: number;
  name: string;
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

export const CREATE_COURSE = gql`
  mutation CreateCourse($course_id: Int!, $name: String!) {
    createCourse(course_id: $course_id, name: $name) {
      id
      course_id
      name
    }
  }
`;

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($id: ID!, $course_id: Int, $name: String) {
    updateCourse(id: $id, course_id: $course_id, name: $name) {
      id
      course_id
      name
    }
  }
`;

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const { data } = await client.query({ query: GET_COURSES, fetchPolicy: "network-only", });
    return data.courses;
  },
};
