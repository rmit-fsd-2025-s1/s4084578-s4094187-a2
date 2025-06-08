import express from "express"
import { TutorController } from "../controller/TutorController"

const router = express.Router()
const tutorController = new TutorController()

router.get("/:email", async (req, res) => {
  await tutorController.getByEmail(req, res)
})

export default router;
