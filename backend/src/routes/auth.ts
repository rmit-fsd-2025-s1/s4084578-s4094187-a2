import express from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const router = express.Router();
const userRepo = AppDataSource.getRepository(User);

router.post("/login", async(req, res) => {
  const { email, password } = req.body;

  const user = await userRepo.findOneBy({ email });

  if (!user || user.password !== password) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

    res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    lecturer: user.lecturer,
  });
});

router.get("/profile", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await userRepo.findOneBy({ email: email as string });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/tutors", async (req, res) => {
  try {
    const tutors = await userRepo.find();
    res.json(tutors);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  let { searchTerm } = req.query;

  
  try {
    // If no searchTerm, return all tutors
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      const allTutors = await userRepo.find();
      res.json(allTutors);
      return;
    }

    // Lowercase the searchTerm safely
    searchTerm = searchTerm.toLowerCase();
    
    const tutors = await userRepo
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

export default router;
