import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { D } from "../utils/d.js";

const JWT_SECRET = process.env.JWT_SECRET;
console.log("secret: ", JWT_SECRET);

function createUserInfo(user) {
  return {
    login: user.login,
    email: user.email,
    description: user.description,
  }
}

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
    if (err.code === 11000) {
      // value with given login already exists
      next({
        message: `User ${req.body.login} already exists.`
      });
      return;
    }
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
  console.log(password, login);

  const user = await UserModel.find({ login });
  if (user.length === 0) {
    // no user with specified login was found
    console.log("user not found");
    res.status(400).send("Login failure.")
    return;
  }
  const myUser = user[0];

  const compRes = await bcrypt.compare(password, D(myUser.pass));
  if (!compRes) {
    console.log("password compare failed");
    res.status(400).send("Login failure.");
    return;
  }

  const token = jwt.sign({
    login
  }, JWT_SECRET, {
    expiresIn: "30d",
  })

  res.send({
    ...createUserInfo(myUser),
    token,
  });
}

/**
 * Changes user's password
 * @param {Request} req 
 * @param {Response} res 
 */
export async function changePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  try {
    const result = await bcrypt.compare(currentPassword, user.pass);
    if (!result) {
      console.log("password compare failed");
      res.status(400).send("password check failure.");
      return;
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.pass = hashedPass;
    await user.save();

    res.send({ status: "success" });
  } catch (err) {
    next(err);
  }
}

export async function getUserInfo(req, res, next) {
  const user = req.user;

  res.send(createUserInfo(user));
}

export async function setUserInfo(req, res, next) {
  const user = req.user;

  const {description, email} = req.body;

  if (description) {
    user.description = description;
  }
  if (email) {
    user.email = email;
  }

  try {
    await user.save();
  } catch (err) {
    next(err);
    return;
  }

  res.send(createUserInfo(user));
}
