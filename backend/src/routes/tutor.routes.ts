import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Tutor } from "../entity/Tutor";

const router = express.Router()
const databaseTutors = AppDataSource.getRepository(Tutor)

router.get("/", async (req: Request, res: Response) => {
  try {
    const tutor = await databaseTutors.find()
    res.json(tutor)
  }
  catch (err) {
    console.error("Failed to fetch tutor: ", err)
    res.status(500).json({ error: "Internal Server Error"})
  }
})

router.get("/profile", async (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) {
    res.status(400).json({ error: "Attempted to fetch tutor profile without supplying an email." });
    return
  }
  try {
    const tutor = await databaseTutors.findOne({ where: { email } });
    if (!tutor) {
      res.status(404).json({ error: "Tutor not found" });
      return
    }
    res.json(tutor);
  } 
  catch (err) {
    console.error("Error fetching tutor by email:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

export default router