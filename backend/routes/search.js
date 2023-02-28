import express from "express";
export const searchRouter = express.Router();
import { getSearchResults } from '../controllers/search.js';
import { userInfo } from '../middlewares/auth.js'

searchRouter.get("/search", userInfo, getSearchResults);

