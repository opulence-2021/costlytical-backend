// module imports
import express from "express";
//controller imports
import { getModels, updateModels, createModel } from "../controllers/models.js";

const router = express.Router();

router.get("/getModels", getModels);
router.post("/createModel", createModel);
router.put("/updateModels", updateModels);

export default router;
