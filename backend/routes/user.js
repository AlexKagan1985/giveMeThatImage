import express from "express";
import { loginUser, registerUser } from "../controllers/user.js";
export const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
