import gql from "graphql-tag";

export const typeDefs = gql`
  type Course {
    id: ID!
    name: String!
  }

  type Lecturer {
    id: ID!
    email: String!
    password: String!
  }

  type Tutor {
    id: ID!
    email: String!
    password: String!
    name: String!
    available_full_time: Boolean!
    skills_list: String!
    academic_credentials: String!
  }

  type Query { 
    hello: String!
  }
`;
