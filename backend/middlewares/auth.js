import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;

async function user(req) {

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return null;
  }
  if (!authHeader.startsWith("BEARER ")) {
    return null;
  }
  let login = "";
  try {
    const result = jwt.verify(authHeader.substring(7), JWT_SECRET);
    login = result.login;
  } catch (err) {
    return null;
  }

  // now we find user object in the database
  const user = await UserModel.find({ login });
  if (user.length !== 1) {
    return null;
  }
  req.user = user[0];
  return user[0];
}

/**
 * middleware to verify jwt signature
 * @param {Request} req
  * @param {Response} res
  */
export async function checkLogin(req, res, next) {
  const myuser = user(req);
  if (!myuser) {
    res.status(403).send("Forbidden");
    return;
  }
  next();
}

export async function userInfo(req, _res, next) {
  user(req);
  next();
}
