import { Router } from "express";
import { createTutorApplication } from "../controller/TutorApplicationController";

const router = Router();

router.post("/", createTutorApplication);

export default router;