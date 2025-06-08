import express from "express";
import cors from "cors";
import request from "supertest";
import authRouter from "../src/routes/auth.routes";
import { TestDataSource } from "../src/test-data-source";
import { Tutor } from "../src/entity/Tutor";
import { Lecturer } from "../src/entity/Lecturer";
import { sampleLecturers, sampleTutors } from "../src/sampleData";

// setup test environment
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

beforeAll(async () => {
  await TestDataSource.initialize();
});

afterAll(async () => {
  await TestDataSource.destroy();
});

afterEach(async () => {
  await TestDataSource.getRepository(Lecturer).clear();
  await TestDataSource.getRepository(Tutor).clear();
});

describe("POST /api/auth/login", () => {
  it("should return 404 if credentials are invalid", async () => {
    // attempt login
    const res = await request(app).post("/api/auth/login").send({
      email: "wrongemail@rmit.edu.au",
      password: "wrongpassword"
    })
    // expect login attempt to fail
    expect(res.status).toBe(404)
    expect(res.body.message).toBe("User not found")
  })

  it("should login to the correct lecturer when supplied correct credentials", async () => {
    // load sample lecturers into the test database
    const lecturerRepo = TestDataSource.getRepository(Lecturer)
    for (const lecturer of sampleLecturers) {
      const newLecturer = lecturerRepo.create(lecturer);
      await lecturerRepo.save(newLecturer);
    }
    // attempt login
    const res = await request(app).post("/api/auth/login").send({
      email: "MayMullen@rmit.edu.au",
      password: "1+83Wk[QQ}0a"
    })
    expect(res.status).toBe(200)
    expect(res.body.role).toBe("lecturer")
  })

  it("should login to the correct tutor when supplied correct credentials", async () => {
    // load sample lecturers into the test database
    const tutorRepo = TestDataSource.getRepository(Tutor)
    for (const tutor of sampleTutors) {
      const newLecturer = tutorRepo.create(tutor);
      await tutorRepo.save(newLecturer);
    }
    // attempt login
    const res = await request(app).post("/api/auth/login").send({
      email: "RichardMiles@rmit.edu.au",
      password: "62FA0p>,63]r"
    })
    expect(res.status).toBe(200)
    expect(res.body.role).toBe("tutor")
  })

  it("should allow a lecturer to sign up", async () => {
    // create user
    const res = await request(app)
      .post("/api/auth/register/lecturer")
      .send({
        email: "testLecturer@rmit.edu.au",
        password: "zJ077>z?s#kK",
        name: "Test Lecturer"
      });
    expect(res.status).toBe(201);

    // check that lecturer is corect
    const lecturer = await TestDataSource.getRepository(Lecturer).findOneBy({ email: "testLecturer@rmit.edu.au" })
    expect(lecturer).toBeDefined()
    expect(lecturer?.name).toBe("Test Lecturer")
  })

  it("should allow a tutor to sign up", async () => {
    // create user
    const res = await request(app)
      .post("/api/auth/register/tutor")
      .send({
        email: "testTutor@rmit.edu.au",
        password: "r(t64SU7Ed[£",
        name: "Test Tutor",
        availableFullTime: true,
        skillsList: "yeah",
        academicCredentials: "Information Technology"
      });
    expect(res.status).toBe(201);

    // check that user is correct
    const tutor = await TestDataSource.getRepository(Tutor).findOneBy({ email: "testTutor@rmit.edu.au" })
    expect(tutor).toBeDefined()
    if (tutor) {
      expect(tutor.name).toBe("Test Tutor")
      expect(tutor.availableFullTime).toBe(1)
      expect(tutor.skillsList).toBe("yeah")
      expect(tutor.academicCredentials).toBe("Information Technology")
    }
  })
});
