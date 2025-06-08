import gql from "graphql-tag"

export const typeDefs = gql`
  type Course {
    id: ID!
    course_id: String!
    name: String!
    tutorApplications(filter: TutorApplicationFilter): [Tutor_Application!]
    lecturerCourses: [Lecturer_Course!]
  }

  input TutorApplicationFilter {
    selected: Boolean
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
    timeSelected: Int!
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
    lecturerCourses(lecturerId: ID!): [Lecturer_Course!]!
    tutorsWithMinApplications(min: Int = 3): [Tutor!]!
    unselectedTutors: [Tutor!]!
  }

  type Mutation {
    createCourse(course_id: String!, name: String!): Course!
    updateCourse(id: ID!, course_id: String, name: String): Course!
    deleteCourse(id: ID!): Boolean!
    assignCourseToLecturer(lecturerId: ID!, courseId: ID!): Lecturer_Course!
    deleteLecturerCourse(lecturerCourseId: ID!): Boolean!
    updateTutorBlock(id: ID!, blocked: Boolean!): Tutor!
  }
`
