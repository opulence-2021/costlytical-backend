// module imports
import express from "express";
//controller imports
import { getUser, postLogin } from "../controllers/user.js";

const router = express.Router();

router.get("/me", getUser);
router.post("/login", postLogin);

export default router;
