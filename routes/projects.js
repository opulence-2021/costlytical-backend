// module imports
import express from "express";
//controller imports
import { getProject, createProject } from "../controllers/projects.js";

const router = express.Router();

router.get("/", getProject);
router.post("/", createProject);

export default router;
