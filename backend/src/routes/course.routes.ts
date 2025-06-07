import express from "express"
import { CourseController } from "../controller/CourseController"

const router = express.Router()
const controller = new CourseController()

router.get("/", async (req, res) => {
  await controller.getAll(req, res)
})

export default router