import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;

async function user(req) {

  const authHeader = req.headers["authorization"];
  console.log("running user auth check...")

  if (!authHeader) {
    console.log("cant see authorization header");
    return null;
  }
  if (!authHeader.startsWith("BEARER ")) {
    console.log("auth header invalid format")
    return null;
  }
  let login = "";
  try {
    const result = jwt.verify(authHeader.substring(7), JWT_SECRET);
    login = result.login;
  } catch (err) {
    console.log("auth token verification failed")
    return null;
  }

  // now we find user object in the database
  const user = await UserModel.find({ login });
  if (user.length !== 1) {
    console.log("cant find user in db")
    return null;
  }
  req.user = user[0];
  console.log("success, req.user is ", req.user);
  return user[0];
}

/**
 * middleware to verify jwt signature
 * @param {Request} req
  * @param {Response} res
  */
export async function checkLogin(req, res, next) {
  const myuser = await user(req);
  if (!myuser) {
    res.status(403).send("Forbidden");
    return;
  }
  next();
}

export async function userInfo(req, _res, next) {
  await user(req);
  next();
}
