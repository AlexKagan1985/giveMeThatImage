import express from "express";
import { loginUser, registerUser, changePassword, getUserInfo, setUserInfo } from "../controllers/user.js";
import { checkLogin } from "../middlewares/auth.js";
export const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/changePassword", checkLogin, changePassword);

userRouter.get("/info", checkLogin, getUserInfo);
userRouter.put("/info", checkLogin, setUserInfo);
