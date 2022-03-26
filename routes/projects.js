// module imports
import express from "express";
//controller imports
import {
  getProject,
  createProject,
  uploadModels,
  getProjectStatus, 
} from "../controllers/projects.js";

const router = express.Router();

router.get("/", getProject);
router.post("/createProject", createProject);
router.post("/uploadModel", uploadModels);
router.get("/projectStatus", getProjectStatus); 
export default router;
