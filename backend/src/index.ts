import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user.routes";
import courseRouter from "./routes/course.routes"
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRouter)

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
