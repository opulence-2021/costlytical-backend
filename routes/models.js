// module imports
import express from "express";
//controller imports
import { getModels, createModel } from "../controllers/models.js";

const router = express.Router();

router.get("/getModels", getModels);
router.post("/createModel", createModel);

export default router;
