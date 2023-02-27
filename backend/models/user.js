import { mongoose } from "../db/index.js";

const userSchema = new mongoose.Schema({
  email: String,
  pass: String,
  login: {
    type: String,
    index: true,
    unique: true,
  },
  description: String,
})

export const UserModel = mongoose.model("users", userSchema);

