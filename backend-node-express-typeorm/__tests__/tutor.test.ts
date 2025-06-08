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

// delete test database after all tests are done
afterAll(async () => {
  await TestDataSource.destroy();
});

// wipe database between each test
afterEach(async () => {
  await TestDataSource.getRepository(Tutor).clear();
});

describe("GET /api/tutors", () => {
  
  it("should return 404 if tutor does not exist", async () => {
    const res = await request(app).get("/api/tutors/wrongemail@rmit.edu.au")
    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Controller unable to find tutor")
  })

  it("should return the correct tutor", async () => {
    const testTutorRepo = TestDataSource.getRepository(Tutor)

    // insert all tutors into the database so we know we're grabbing the right one
    await Promise.all(sampleTutors.map((tutor) => {
      const newTutor = testTutorRepo.create(tutor);
      return testTutorRepo.save(newTutor);
    }))

    const res = await request(app).get("/api/tutors/JohnDoe@rmit.edu.au")
    expect(res.status).toBe(200)
  });
});
