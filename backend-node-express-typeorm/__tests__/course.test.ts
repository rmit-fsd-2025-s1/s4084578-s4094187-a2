import express from "express"
import cors from "cors"
import courseRouter from "../src/routes/course.routes"
import request from "supertest"
import { TestDataSource } from "../src/test-data-source"
import { Course } from "../src/entity/Course"
import { sampleCourses } from "../src/sampleData"

// setup test database
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/courses", courseRouter)

beforeAll(async () => {
  await TestDataSource.initialize()
  console.log("DB Type:", TestDataSource.options.type)
})

// delete test database after all tests are done
afterAll(async () => {
  await TestDataSource.destroy();
});

// wipe database between each test
afterEach(async () => {
  await TestDataSource.getRepository(Course).clear();
})

describe("GET api/courses", () => {

  it("should return 200 if no courses exist", async () => {
    const res = await request(app).get("/api/courses")
    expect(res.status).toBe(200)
    expect(res.body.message).toBe("No courses found in the database")
  })

  it("should return courses if they exist", async () => {
    const testCourseRepo = TestDataSource.getRepository(Course)

    await Promise.all(sampleCourses.map((Course) => {
          const newTutor = testCourseRepo.create(Course);
          return testCourseRepo.save(newTutor);
    }))

    const res = await request(app).get("/api/courses/")
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(4)
  })
})