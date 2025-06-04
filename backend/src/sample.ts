import { AppDataSource } from './data-source';
import { User } from './entity/User';

const sampleUsers = [
      {
        //Admin Login Data, Registered as both lecturer and tutor for testing.
        email: "Admin@rmit.edu.au",
        password: "password",
        lecturer: true,
        selected: false,
        name: "Admin",
        skills: "All",
        creds: "All",
        courses: "All",
        available: "Full Time",
        timesSelected: 0
      },
      {
        //Lecturer Login Data
        email: "Lecturer@rmit.edu.au",
        password: "password",
        lecturer: true,
        selected: false,
        name: "Lecturer",
        skills: "All",
        creds: "All",
        courses: "All",
        available: "Full Time",
        timesSelected: 0
      },
      {
        email: "JohnDoe@rmit.edu.au",
        password: "password",
        lecturer: false,
        selected: false,
        name: "John Doe",
        skills: "Time Management, Research",
        creds: "Bachelor of Computer Science",
        courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
        available: "Part Time",
        timesSelected: 0
      },
      {
        email: "LilySmith@rmit.edu.au",
        password: "p455w0rd",
        lecturer: false,
        selected: false,
        name: "Lily Smith",
        skills: "Computer Skills, Critical Thinking",
        creds: "Bachelor of Software Engineering",
        courses: "Algorithms and Analysis, Full Stack Development",
        available: "Part Time",
        timesSelected: 2
      },
      {
        email: "MaxPayne@rmit.edu.au",
        password: "rockstar",
        lecturer: false,
        selected: false,
        name: "Max Payne",
        skills: "Problem Solving, Independence",
        creds: "Bachelor of IT",
        courses: "Full Stack Development, Software Engineering Fundamentals",
        available: "Full Time",
        timesSelected: 3
      },
      {
        email: "RichardMiles@rmit.edu.au",
        password: "carfan77",
        lecturer: false,
        selected: false,
        name: "Richard Miles",
        skills: "Research, Critical Thinking",
        creds: "Bachelor of Software Engineering",
        courses: "Full Stack Development, Algorithms and Analysis",
        available: "Full Time",
        timesSelected: 2
      },
      {
        email: "SteveJoes@rmit.edu.au",
        password: "ApplesTasteGood",
        lecturer: false,
        selected: false,
        name: "Steve Joes",
        skills: "Computer Skills, Independence",
        creds: "Bachelor of Computer Science",
        courses: "Software Engineering Fundamentals, Algorithms and Analysis",
        available: "Part Time",
        timesSelected: 5
      },
      {
        email: "BallGates@rmit.edu.au",
        password: "Win10Forever",
        lecturer: false,
        selected: false,
        name: "Ball Gates",
        skills: "Problem Solving, Time Management",
        creds: "Bachelor of IT",
        courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
        available: "Part Time",
        timesSelected: 4
      }
    ];

AppDataSource.initialize().then(async () => {
  const userRepository = AppDataSource.getRepository(User);

  for (const user of sampleUsers) {
    const newUser = userRepository.create(user);
    await userRepository.save(newUser);
  }

  console.log("Sample users inserted.");
  process.exit(0);
}).catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});