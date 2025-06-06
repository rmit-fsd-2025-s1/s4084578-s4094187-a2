import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";


const router = Router()
const databaseCourses = AppDataSource.getRepository(Course)

router.get("/", async (req, res) => {
  try {
    const courses = await databaseCourses.find()
    res.json(courses)
  }
  catch (err) {
    console.error("Failed to fetch courses: ", err)
    res.status(500).json({ error: "Internal Server Error"})
  }
})

export default router