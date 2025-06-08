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
  it("should return 404 if email does not match any user", async () => {

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
});
