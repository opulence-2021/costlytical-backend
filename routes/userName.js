// module imports
import express from "express";
//controller imports
import { getUserName } from "../controllers/userName.js";

const router = express.Router();

router.get("/", getUserName);
// router.post("/", createUserName);

export default router;
