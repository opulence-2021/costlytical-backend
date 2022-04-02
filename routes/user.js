// module imports
import express from "express";
//controller imports
import { getUser, postLogin, createUser } from "../controllers/user.js";

const router = express.Router();

router.get("/me", getUser);
router.post("/login", postLogin);
router.post("/createUser", createUser);

export default router;
