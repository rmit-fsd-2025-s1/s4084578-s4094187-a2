import gql from "graphql-tag";

export const typeDefs = gql`
  type Course {
    id: ID!
    course_id: Int!
    name: String!
    tutorApplications: [Tutor_Application!]
    lecturerCourses: [Lecturer_Course!]
  }

  type Lecturer {
    id: ID!
    email: String!
    password: String!
    name: String!
  }

  type Tutor {
    id: ID!
    email: String!
    password: String!
    name: String!
    available_full_time: Boolean!
    skills_list: String!
    academic_credentials: String!
    blocked: Boolean!
  }
  
  type Tutor_Application {
    tutor_application_id: ID!
    tutor: Tutor!
    course: Course!
    selected: Boolean!
  }

  type Lecturer_Course {
    lecturer_course_id: ID!
    lecturer: Lecturer!
    course: Course!
  }

  type Query { 
    hello: String!
    courses: [Course!]!
  }

  type Mutation {
    createCourse(course_id: Int!, name: String!): Course!
    updateCourse(id: ID!, course_id: Int, name: String): Course!
    deleteCourse(id: ID!): Boolean!
  }
`;
