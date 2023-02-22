const searchRouter = require('express').Router();
const { getSearchResults } = require('../controllers/search.js')

searchRouter.get("/search", getSearchResults);

module.exports = {
  searchRouter
}
