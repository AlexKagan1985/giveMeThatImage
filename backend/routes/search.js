import express from "express";
export const searchRouter = express.Router();
import { getSearchResults, getPreviousQueries, getQueryResults } from '../controllers/search.js';
import { userInfo, checkLogin } from '../middlewares/auth.js'

searchRouter.get("/search", userInfo, getSearchResults);
searchRouter.get("/previous_queries", checkLogin, getPreviousQueries);
searchRouter.get("/query_info", checkLogin, getQueryResults);
