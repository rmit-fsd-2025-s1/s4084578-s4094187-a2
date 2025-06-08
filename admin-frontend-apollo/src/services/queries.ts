import { gql } from "@apollo/client"

export const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      course_id
      name
    }
  }
`

export const GET_LECTURERS = gql`
  query GetLecturers {
    lecturers {
      id
      email
      name
    }
  }
`

export const GET_TUTORS = gql`
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

export const TOGGLE_TUTOR_BLOCK = gql`
  mutation ToggleTutorBlock($id: ID!, $blocked: Boolean!) {
    updateTutorBlock(id: $id, blocked: $blocked) {
      id
      blocked
    }
  }
`

export const CREATE_COURSE = gql`
  mutation CreateCourse($course_id: String!, $name: String!) {
    createCourse(course_id: $course_id, name: $name) {
      id
      course_id
      name
    }
  }
`

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($id: ID!, $course_id: String, $name: String) {
    updateCourse(id: $id, course_id: $course_id, name: $name) {
      id
      course_id
      name
    }
  }
`

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`

export const ASSIGN_COURSE = gql`
  mutation AssignCourse($lecturerId: ID!, $courseId: ID!) {
    assignCourseToLecturer(lecturerId: $lecturerId, courseId: $courseId) {
      lecturer_course_id
      course { id name }
    }
  }
`

export const GET_LECTURER_COURSES = gql`
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

export const UNASSIGN_COURSE = gql`
  mutation UnassignCourse($lecturerCourseId: ID!) {
    deleteLecturerCourse(lecturerCourseId: $lecturerCourseId)
  }
`

export const GET_SELECTED_TUTOR_APPLICATIONS = gql`
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

export const GET_TUTORS_WITH_MIN_APPLICATIONS = gql`
  query GetTutorsWithMinApplications($min: Int!) {
    getTutorsWithSelections(min: $min) {
      id
      name
      email
      availableFullTime
      skillsList
      academicCredentials
      blocked
    }
  }
`

export const GET_UNSELECTED_TUTORS = gql`
  query GetUnselectedTutors {
    unselectedTutors {
      id
      name
      email
      availableFullTime
      skillsList
      academicCredentials
      blocked
    }
  }
`
