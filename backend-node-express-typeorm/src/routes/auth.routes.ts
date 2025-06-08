import express from "express";
import { AuthController } from "../controller/AuthController";

const router = express.Router();
const controller = new AuthController();

router.post("/login", async (req, res) => {
  await controller.login(req, res);
});

router.post("/register/lecturer", async (req, res) => {
  await controller.registerLecturer(req, res);
});

router.post("/register/tutor", async (req, res) => {
  await controller.registerTutor(req, res);
});

router.get("/profile", async (req, res) => {
  await controller.getProfile(req, res);
});

router.get("/tutors", async (req, res) => {
  await controller.getTutors(req, res);
});

router.get("/lecturers", async (req, res) => {
  await controller.getLecturers(req, res);
});

router.get("/search", async (req, res) => {
  await controller.searchTutors(req, res);
});

router.put("/tutors/:id", async (req, res) => {
  await controller.updateTutor(req, res);
});

export default router;
