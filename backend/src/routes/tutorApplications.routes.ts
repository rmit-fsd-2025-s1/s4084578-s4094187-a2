import { Router, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Tutor } from "../entity/Tutor"
import { Course } from "../entity/Course"
import { Tutor_Application } from "../entity/Tutor_Application"

const router = Router()
const tutorRepo  = AppDataSource.getRepository(Tutor)
const courseRepo = AppDataSource.getRepository(Course)
const appRepo    = AppDataSource.getRepository(Tutor_Application)

router.post("/", async (req: Request, res: Response) => {
  const { email, courseId, tutorRole } = req.body as {
    email?: string;
    courseId?: number;
    // true = tutor, false = lab assistant
    tutorRole?: boolean;
  }
  if (tutorRole === undefined) {
    res.status(400).json({ error: "tutorRole required (true/false)" })
    return
  }
  if (!email || !courseId) {
    res.status(400).json({ error: "email and courseId required" })
    return
  }
  try {
    const tutor  = await tutorRepo.findOneByOrFail({ email })
    const course = await courseRepo.findOneByOrFail({ id: courseId })
    const existing = await appRepo.findOne({
      where: { tutor: { id: tutor.id }, course: { id: course.id }, tutorRole }
    });
    if (existing) {
      res.status(409).json({ error: "Application already exists" });
      return 
    }
    const application = appRepo.create({
      selected: false,
      tutorRole,
      tutor,
      course,
    })
    await appRepo.save(application)
    res.status(201).json(application)
  } 
  catch (e: any) {
    console.error(e)
    if (e.name === "EntityNotFoundError") {
      res.status(404).json({ error: "Tutor or course not found" })
      return
    }
    res.status(500).json({ error: "Server error" })
  }
})

export default router
