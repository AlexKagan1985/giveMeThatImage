const axios = require('axios');

const DAERROR = 1; // error in a deviant art request
const ASERROR = 2; // error in artstation request
const USERROR = 3; // error in Unsplash request
const PBERROR = 4; // error in Pixabay request

class SearchError extends Error {
  constructor(ty, msg) {
    super(msg);
    this.type = ty;
  }
}

let DAToken = null;
let DATokenIssuedAt = null;

const cl_id = process.env.DA_CLIENT_ID;
const cl_secret = process.env.DA_CLIENT_SECRET;

async function getDAAuth() {
  let initToken = false;
  if (!DAToken) {
    // first call of the function, reinitialize authToken
    initToken = true;
  }

  if (Date.now() - DATokenIssuedAt > 45 * 60 * 1000) {
    // 45 minutes have passed, reinit token
    initToken = true;
  }

  if (initToken) {
    const res = await axios.get(`https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=${cl_id}&client_secret=${cl_secret}`)
    console.log("got da authentication: ", res.data);
    DAToken = res.data.access_token;
  }
  return DAToken;
}

async function retrieveDAResults(query) {
  // First we need to authenticate ourselves
  const authToken = await getDAAuth();
  console.log("authenticate with ", authToken)
  const res = await axios.get(`https://www.deviantart.com/api/v1/oauth2/browse/popular?q=${query}`,
    { headers: { "Authorization": `BEARER ${authToken}` } });

  // now that we have results from DA, reformat them to be the general searchResult
  const resultsArray = res.data.results;
  if (!resultsArray) {
    throw new SearchError(DAERROR, "unexpected result from deviant art endpoint");
  }

  const searchResultArray = resultsArray.map((val) => ({
    img_url: val.url,
    title: val.title,
    author_id: val.author.userid,
    author_name: val.author.username,
    preview_url: val.preview.src,
    id: val.deviationid,
    mature_content: val.is_mature,
    api_data: {
      DeviantArt: val,
    }
  }));

  return searchResultArray;
}

async function getSearchResults(req, res) {
  const { q } = req.query;

  try {
    const daResults = await retrieveDAResults(q);
    res.send(daResults);
  } catch (err) {
    res.status(401).send(err);
    return;
  }
}

module.exports = {
  getSearchResults,
}
