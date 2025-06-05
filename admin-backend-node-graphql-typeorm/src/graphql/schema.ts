import gql from "graphql-tag";

export const typeDefs = gql`
  type Course {
    id: ID!
    course_id: Int!
    name: String!
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

  type Query { 
    hello: String!
    courses: [Course!]!
  }

  type Mutation {
    createCourse(course_id: Int!, name: String!): Course
  }
`;
