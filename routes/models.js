// module imports
import express from "express";
//controller imports
import { getModel, createModel } from "../controllers/models.js";

const router = express.Router();

router.get("/", getModel);
router.post("/createModel", createModel);

export default router;
