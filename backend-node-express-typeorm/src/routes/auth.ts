import express from "express";
import { AppDataSource } from "../data-source";
import { Tutor } from "../entity/Tutor";
import { Lecturer } from "../entity/Lecturer";

const router = express.Router();
const tutorRepo = AppDataSource.getRepository(Tutor);
const lecturerRepo = AppDataSource.getRepository(Lecturer);

const isValidEmail = (email: string) => email.endsWith("@rmit.edu.au");
const isValidPassword = (password: string) => {
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= 8 && hasLetter && hasNumber && hasSpecial;
};

router.post("/login", async(req, res) => {
  const { email, password } = req.body;

  const lecturer = await lecturerRepo.findOneBy({ email: email as string });
    if (lecturer) {
      if (lecturer.password !== password) {
        res.status(404).json({ message: "Incorrect Password" });
        return;
      }

      res.json({ ...lecturer, role: "lecturer" });
      return;
    }

    const tutor = await tutorRepo.findOneBy({ email: email as string });
    if (!tutor) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (tutor.password !== password) {
      res.status(404).json({ message: "Incorrect Password" })
      return
    }
    if (tutor.blocked) {
      res.status(403).json({ message: "This user has been blocked. Please contact the system admin." });
      return;
    }
    res.json({...tutor, role: "tutor"});
    return;


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

  if (!isValidEmail(email) || !isValidPassword(password)) {
    res.status(400).json({ error: "Invalid email or password format" });
    return;
  }

  try {
    await lecturerRepo.query(
      'INSERT INTO lecturer (email, password, name) VALUES (?, ?, ?)',
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

  if (!isValidEmail(email) || !isValidPassword(password)) {
    res.status(400).json({ error: "Invalid email or password format" });
    return;
  }

  try {

    await tutorRepo.query(
      `INSERT INTO tutor
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
  let rawSearchTerm = req.query.searchTerm;
  const searchTerm = (rawSearchTerm || "").toString().toLowerCase().trim();

  try {
    const query = tutorRepo
      .createQueryBuilder("tutor")
      .leftJoin("tutor_application", "app", "app.tutorId = tutor.id")
      .leftJoin("course", "course", "course.id = app.courseId")
      .select([
        "tutor.id AS id",
        "tutor.name AS name",
        "tutor.skillsList AS skillsList",
        "tutor.academicCredentials AS academicCredentials",
        "tutor.availableFullTime AS availableFullTime",
        "tutor.timesSelected AS timesSelected",
        "tutor.blocked AS blocked",
        "tutor.comments AS comments",
        "GROUP_CONCAT(DISTINCT course.name SEPARATOR ', ') AS courses"
      ])
      .groupBy("tutor.id");

    if (searchTerm !== "") {
      query.where(`
        LOWER(tutor.name) LIKE :searchTerm OR
        LOWER(tutor.skillsList) LIKE :searchTerm OR
        LOWER(tutor.academicCredentials) LIKE :searchTerm OR
        LOWER(course.name) LIKE :searchTerm
      `, { searchTerm: `%${searchTerm}%` });
    }

    const result = await query.getRawMany();
    res.json(result);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ message: "Internal server error" });
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