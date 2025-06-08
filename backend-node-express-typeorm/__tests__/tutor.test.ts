import request from "supertest";
import { TestDataSource } from "../src/test-data-source";
import { Tutor } from "../src/entity/Tutor";
import express from "express";
import tutorRouter from "../src/routes/tutor.routes";
import cors from "cors";
import { sampleTutors } from "../src/sampleData";

// set up test environment
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/tutors", tutorRouter);

beforeAll(async () => {
  await TestDataSource.initialize();
  console.log("DB Type:", TestDataSource.options.type)
});

afterAll(async () => {
  await TestDataSource.destroy();
});

// wipe database between 
afterEach(async () => {
  await TestDataSource.getRepository(Tutor).clear();
});

describe("GET /api/tutors", () => {
  it("should return 404 if tutor does not exist", async () => {
    const res = await request(app).get("/api/tutors/wrongemail@rmit.edu.au")
    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Controller unable to find tutor")
  })

  it("should return all sample tutors", async () => {
    const testTutorRepo = TestDataSource.getRepository(Tutor)

    await Promise.all(sampleTutors.map((tutor) => {
      const newTutor = testTutorRepo.create(tutor);
      return testTutorRepo.save(newTutor);
    }))

    const res = await request(app).get("/api/tutors/JohnDoe@rmit.edu.au")
    expect(res.status).toBe(200)
  });
});
