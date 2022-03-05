// module imports
import express from "express";
//controller imports
import {
  getProject,
  createProject,
  uploadModels,
} from "../controllers/projects.js";

const router = express.Router();

router.get("/", getProject);
router.post("/createProject", createProject);
router.post("/uploadModel", uploadModels);
export default router;
