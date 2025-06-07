import gql from "graphql-tag"

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
    availableFullTime: Boolean!
    skillsList: String!
    academicCredentials: String!
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
    courses: [Course!]!
    lecturers: [Lecturer!]!
    tutors: [Tutor!]!
    # finds all courses that a lecturer is assigned to by their id
    lecturerCourses(lecturerId: ID!): [Lecturer_Course!]!
  }

  type Mutation {
    createCourse(course_id: Int!, name: String!): Course!
    updateCourse(id: ID!, course_id: Int, name: String): Course!
    deleteCourse(id: ID!): Boolean!
    assignCourseToLecturer(lecturerId: ID!, courseId: ID!): Lecturer_Course!
    deleteLecturerCourse(lecturerCourseId: ID!): Boolean!
  }
`
