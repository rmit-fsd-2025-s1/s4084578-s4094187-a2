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

export default router;
