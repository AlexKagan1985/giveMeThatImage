import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { D } from "../utils/d.js";

const JWT_SECRET = process.env.JWT_SECRET;
console.log("secret: ", JWT_SECRET);
/**
 * registers a new user in the database
 * @param {Request} req
 * @param {Response} res
 */
export async function registerUser(req, res, next) {
  try {
    const { email, password, login } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);
    console.log("hashed pass is ", hashedPass);

    const user = await UserModel.create({
      email, pass: hashedPass, login, description: ""
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
}

/**
 * logs a user into the application
 * @param {Request} req
 * @param {Response} res
 */
export async function loginUser(req, res) {
  const { password, login } = req.body;

  const user = await UserModel.find({ login });
  if (user.length === 0) {
    // no user with specified login was found
    res.status(400).send("Login failure.")
    return;
  }
  const myUser = user[0];

  const compRes = await bcrypt.compare(password, D(myUser.pass));
  if (!compRes) {
    res.status(400).send("Login failure.");
    return;
  }

  const token = jwt.sign({
    login
  }, JWT_SECRET, {
    expiresIn: "30d",
  })

  res.send(token);
}
