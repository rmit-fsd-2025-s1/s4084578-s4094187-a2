// src/controllers/AuthController.ts
import { Request, Response } from "express";
import { getDataSource } from "../utils/getDataSource";
import { Lecturer } from "../entity/Lecturer";
import { Tutor } from "../entity/Tutor";
import { Lecturer_Course } from "../entity/Lecturer_Course";
import { Course } from "../entity/Course";

export class AuthController {
  private lecturerRepo = getDataSource().getRepository(Lecturer);
  private tutorRepo = getDataSource().getRepository(Tutor);
  private lecCourseRepo = getDataSource().getRepository(Lecturer_Course);
  private courseRepo = getDataSource().getRepository(Course);

  private isValidEmail = (email: string) => email.endsWith("@rmit.edu.au");
  private isValidPassword = (password: string) => {
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber && hasSpecial;
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const lecturer = await this.lecturerRepo.findOneBy({ email: email as string });
    if (lecturer) {
      if (lecturer.password !== password) {
        res.status(404).json({ message: "Incorrect Password" });
        return;
      }

      res.json({ ...lecturer, role: "lecturer" });
      return;
    }

    const tutor = await this.tutorRepo.findOneBy({ email: email as string });
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
  };

  registerLecturer = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!this.isValidEmail(email) || !this.isValidPassword(password)) {
      res.status(400).json({ error: "Invalid email or password format" });
      return;
    }

    try {
      await this.lecturerRepo.query(
        'INSERT INTO lecturer (email, password, name) VALUES (?, ?, ?)',
        [email, password, name]
      );
      res.sendStatus(201);
    } catch (err) {
      console.error("Lecturer registration failed:", err);
      res.status(500).json({ error: "Could not register lecturer" });
    }
  };

  registerTutor = async (req: Request, res: Response) => {
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

    if (!this.isValidEmail(email) || !this.isValidPassword(password)) {
      res.status(400).json({ error: "Invalid email or password format" });
      return;
    }

    try {

    await this.tutorRepo.query(
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
  };

  getProfile = async (req: Request, res: Response) => {
    const { email } = req.query;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    try {
      const lecturer = await this.lecturerRepo.findOneBy({ email: email as string });

      if (!lecturer) {
        const tutor = await this.tutorRepo.findOneBy({ email: email as string });
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
  };

  getTutors = async (req: Request, res: Response) => {
    try {
      const tutors = await this.tutorRepo.find();
      res.json(tutors);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  getLecturers = async (req: Request, res: Response) => {
    try {
      const lecturers = await this.lecturerRepo.find();
      res.json(lecturers);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  searchTutors = async (req: Request, res: Response) => {
    let rawSearchTerm = req.query.searchTerm;
    const searchTerm = (rawSearchTerm || "").toString().toLowerCase().trim();

    try {
      const query = this.tutorRepo
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
  };

  updateTutor = async (req: Request, res: Response) => {
    const tutorId = parseInt(req.params.id);
    const { comments, timesSelected } = req.body;

    try {
      const tutor = await this.tutorRepo.findOneBy({ id: tutorId });
      if (!tutor) {
        res.status(404).json({ message: 'Tutor not found' });
        return;
      }

      // Update fields
      if (comments !== undefined) tutor.comments = comments;
      if (timesSelected !== undefined) tutor.timesSelected = timesSelected;

      const savedTutor = await this.tutorRepo.save(tutor);
      res.json(savedTutor);
    } catch (error) {
      console.error('Failed to update tutor:', error);
      res.status(500).json({ message: 'Error updating tutor' });
    }
  };

  getLecCourses = async (req: Request, res: Response) => {
    const lecturerId = req.query.lecturerId;

    if (!lecturerId) {
      res.status(400).json({ message: "lecturerId is required" });
      return;
    }

    try {
      const courses = await this.lecCourseRepo.find({
        where: {
          lecturer: {
            id: Number(lecturerId),
          },
        },
        relations: ['course'],
      });

      const courseList = courses.map(c => c.course);
      res.json(courseList);
    } catch (err) {
      console.error("Error fetching lecturer courses:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
