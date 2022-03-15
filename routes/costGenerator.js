// module imports
import express from "express";
//controller imports
import { generateCost } from "../controllers/costGenerator.js";

const router = express.Router();

router.post("/", generateCost);

export default router;
