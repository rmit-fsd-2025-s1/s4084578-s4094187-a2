import { AppDataSource } from './data-source';
import { Tutor } from "./entity/Tutor";
import { Lecturer } from "./entity/Lecturer";

const sampleLecturers = [
      {
        email: "AidenCobb@rmit.edu.au",
        password: "wlCO5g06~2S(",
        name: "Aiden Cobb",
        lecturerCourses: []
      },
      {
        email: "AustinCordova@rmit.edu.au",
        password: "]9u6X5K44rc$",
        name: "Austin Cordova",
        lecturerCourses: []
      },
      {
        email: "MayMullen@rmit.edu.au",
        password: "1+83Wk[QQ}0a",
        name: "May Mullen",
        lecturerCourses: []
      },
      {
        email: "AllenSantos@rmit.edu.au",
        password: "JweJ<},uC859",
        name: "Allen Santos",
        lecturerCourses: []
      },
      {
        email: "GabrielWalters@rmit.edu.au",
        password: "-))rKdS59f4]",
        name: "Gabriel Walters",
        lecturerCourses: []
      }
    ];

const sampleTutors = [
      {
        email: "JohnDoe@rmit.edu.au",
        password: "aO!}4a442ks!",
        name: "John Doe",
        skillsList: "Time Management, Research",
        academicCredentials: "Bachelor of Computer Science",
        courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
        availableFullTime: false,
        timesSelected: 0,
        blocked: false,
        tutorApplications: []
      },
      {
        email: "LilySmith@rmit.edu.au",
        password: "712xY1Z`HKS2",
        name: "Lily Smith",
        skillsList: "Computer Skills, Critical Thinking",
        academicCredentials: "Bachelor of Software Engineering",
        courses: "Algorithms and Analysis, Full Stack Development",
        availableFullTime: false,
        timesSelected: 2,
        blocked: false,
        tutorApplications: []
      },
      {
        email: "MaxPayne@rmit.edu.au",
        password: ".gU*=O0e@m17",
        name: "Max Payne",
        skillsList: "Problem Solving, Independence",
        academicCredentials: "Bachelor of IT",
        courses: "Full Stack Development, Software Engineering Fundamentals",
        availableFullTime: true,
        timesSelected: 3,
        blocked: false,
        tutorApplications: []
      },
      {
        email: "RichardMiles@rmit.edu.au",
        password: "62FA0p>,63]r",
        name: "Richard Miles",
        skillsList: "Research, Critical Thinking",
        academicCredentials: "Bachelor of Software Engineering",
        courses: "Full Stack Development, Algorithms and Analysis",
        availableFullTime: true,
        timesSelected: 2,
        blocked: false,
        tutorApplications: []
      },
      {
        email: "SteveJoes@rmit.edu.au",
        password: "o6~£d1C4b6Mw",
        name: "Steve Joes",
        skillsList: "Computer Skills, Independence",
        academicCredentials: "Bachelor of Computer Science",
        courses: "Software Engineering Fundamentals, Algorithms and Analysis",
        availableFullTime: false,
        timesSelected: 5,
        blocked: false,
        tutorApplications: []
      },
      {
        email: "BallGates@rmit.edu.au",
        password: "[8>3q'8q6PAs",
        name: "Ball Gates",
        skillsList: "Problem Solving, Time Management",
        academicCredentials: "Bachelor of IT",
        courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
        availableFullTime: false,
        timesSelected: 4,
        blocked: false,
        tutorApplications: []
      }
    ];

AppDataSource.initialize().then(async () => {
  const tutorRepo = AppDataSource.getRepository(Tutor);
  const lecturerRepo = AppDataSource.getRepository(Lecturer);

  // Insert tutors
  for (const tutor of sampleTutors) {
    const newTutor = tutorRepo.create(tutor);
    await tutorRepo.save(newTutor);
  }

  // Insert lecturers
  for (const lecturer of sampleLecturers) {
    const newLecturer = lecturerRepo.create(lecturer);
    await lecturerRepo.save(newLecturer);
  }

  console.log("Sample users inserted.");
  process.exit(0);
}).catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});