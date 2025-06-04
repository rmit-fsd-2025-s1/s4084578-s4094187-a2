import express from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const router = express.Router();

router.post("/login", async(req, res) => {
  const { email, password } = req.body;

  const userRepo = AppDataSource.getRepository(User);
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
    const userRepo = AppDataSource.getRepository(User);
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

export default router;
