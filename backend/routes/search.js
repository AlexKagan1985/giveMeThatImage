import express from "express";
export const searchRouter = express.Router();
import { getSearchResults } from '../controllers/search.js';

searchRouter.get("/search", getSearchResults);

