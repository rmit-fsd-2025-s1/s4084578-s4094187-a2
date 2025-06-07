import express from "express";
import { AppDataSource } from "../data-source";
import { Tutor } from "../entity/Tutor";
import { Lecturer } from "../entity/Lecturer";

const router = express.Router();
const tutorRepo = AppDataSource.getRepository(Tutor);
const lecturerRepo = AppDataSource.getRepository(Lecturer);

router.post("/login", async(req, res) => {
  const { email, password } = req.body;

  const lecturer = await lecturerRepo.findOneBy({ email: email as string });

    if (!lecturer) {
      const tutor = await tutorRepo.findOneBy({ email: email as string });
      if (!tutor) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(tutor);
      return;
    }

    res.json(lecturer);

    /*res.json({
      id: user.id,
      email: user.email,
      name: user.name
  });*/
});

router.post('/register/lecturer', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    await lecturerRepo.query(
      'INSERT INTO lecturers (email, password, name) VALUES (?, ?, ?)',
      [email, password, name]
    );

    res.sendStatus(201);
  } catch (err) {
    console.error("Lecturer registration failed:", err);
    res.status(500).json({ error: "Could not register lecturer" });
  }
});

router.post('/register/tutor', async (req, res) => {
  const {
    email,
    password,
    name,
    availableFullTime,
    skillsList,
    academicCredentials,
    comments
  } = req.body;

  if (!email || !password || !name || skillsList === undefined || academicCredentials === undefined) {
    res.status(400).json({ error: "Missing required tutor fields" });
    return;
  }

  try {

    await tutorRepo.query(
      `INSERT INTO tutors
        (email, password, name, availableFullTime, skillsList, academicCredentials, comments, timesSelected, blocked)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, false)`,
      [
        email,
        password,
        name,
        availableFullTime ? 1 : 0,
        skillsList,
        academicCredentials,
        comments || null
      ]
    );

    res.sendStatus(201);
  } catch (err) {
    console.error("Tutor registration failed:", err);
    res.status(500).json({ error: "Could not register tutor" });
  }
});

router.get("/profile", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const lecturer = await lecturerRepo.findOneBy({ email: email as string });

    if (!lecturer) {
      const tutor = await tutorRepo.findOneBy({ email: email as string });
      if (!tutor) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(tutor);
      return;
    }

    res.json(lecturer);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/tutors", async (req, res) => {
  try {
    const tutors = await tutorRepo.find();
    res.json(tutors);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/lecturers", async (req, res) => {
  try {
    const lecturers = await lecturerRepo.find();
    res.json(lecturers);
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  let { searchTerm } = req.query;

  
  try {
    // If no searchTerm, return all tutors
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      const allTutors = await tutorRepo.find();
      res.json(allTutors);
      return;
    }

    // Lowercase the searchTerm safely
    searchTerm = searchTerm.toLowerCase();
    
    const tutors = await tutorRepo
      .createQueryBuilder('tutor')
      .where('LOWER(tutor.name) LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('LOWER(tutor.skills) LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('LOWER(tutor.creds) LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('LOWER(tutor.available) LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('LOWER(tutor.courses) LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .getMany();

    res.json(tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  });

router.put('/tutors/:id', async (req, res) => {
  const tutorId = parseInt(req.params.id);
  const { Comment, TimesSelected } = req.body;

  try {
    const tutor = await tutorRepo.findOneBy({ id: tutorId });
    if (!tutor) {
      res.status(404).json({ message: 'Tutor not found' });
      return;
    }

    // Update fields
    if (Comment !== undefined) tutor.comments = Comment;
    if (TimesSelected !== undefined) tutor.timesSelected = TimesSelected;

    const savedTutor = await tutorRepo.save(tutor);
    res.json(savedTutor);
  } catch (error) {
    console.error('Failed to update tutor:', error);
    res.status(500).json({ message: 'Error updating tutor' });
  }
});

export default router;
