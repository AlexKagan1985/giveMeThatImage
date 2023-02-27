import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * middleware to verify jwt signature
 * @param {Request} req
  * @param {Response} res
  */
export async function checkLogin(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(403).send("Forbidden");
    return;
  }
  if (!authHeader.startsWith("BEARER ")) {
    res.status(400).send("");
    return;
  }
  let login = "";
  try {
    const result = jwt.verify(authHeader.substring(7), JWT_SECRET);
    login = result.login;
  } catch (err) {
    res.status(403).send("Forbidden");
    return;
  }

  // now we find user object in the database
  const user = await UserModel.find({ login });
  if (user.length !== 1) {
    res.status(500).send("database inconsistency. Please contact the administrators.")
    return;
  }
  req.user = user[0];
  next();
}
