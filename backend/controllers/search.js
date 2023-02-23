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
let ASpublicCSRF = null;
let ASprivateCSRF = null;

const cl_id = process.env.DA_CLIENT_ID;
const cl_secret = process.env.DA_CLIENT_SECRET;
const us_client_id = process.env.UNSPLASH_CLIENT_ID;
const pb_key = process.env.PIXABAY_KEY;

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

async function getASAuth() {
  if (ASpublicCSRF && ASprivateCSRF) {
    return [ASpublicCSRF, ASprivateCSRF];
  }

  // get "auth" (LOL) data from ArtStation
  const res = await axios.post("https://www.artstation.com/api/v2/csrf_protection/token.json");

  const pubCSRF = res.data.public_csrf_token;
  console.log("got pubtoken: ", pubCSRF);
  /** @type {string} */
  const CsrfCookies = res.headers["set-cookie"];
  // now actually extract "CSRF" data from the cookie
  console.log("cookie line:", CsrfCookies);
  const beforePart = "PRIVATE-CSRF-TOKEN=";
  const beforeIndex = CsrfCookies[0].indexOf(beforePart) + beforePart.length;
  const afterIndex = CsrfCookies[0].indexOf(";");
  const privCSRF = CsrfCookies[0].substring(beforeIndex, afterIndex);
  console.log("got priv token:", privCSRF);

  if (pubCSRF && privCSRF) {
    ASpublicCSRF = pubCSRF;
    ASprivateCSRF = privCSRF;
    return [pubCSRF, privCSRF];
  }

  throw new SearchError(ASERROR, "cannot get CSRF from ArtStation API");
}

async function retrieveASResults(q) {
  const searchData = {
    additionalFields: [],
    filters: [],
    page: 1,
    per_page: 30,
    pro_first: 1,
    query: q,
    sorting: "relevance"
  };
  const [pubCSRF, privCSRF] = await getASAuth();
  const result = await axios.post("https://www.artstation.com/api/v2/search/projects.json",
    searchData,
    {
      headers: {
        "PUBLIC-CSRF-TOKEN": pubCSRF,
        "Cookie": `PRIVATE-CSRF-TOKEN=${privCSRF}`,
        "Content-Type": "application/json",
      }
    });
  // now that we have the results, transform them into a common format
  const resultsArray = result.data.data;
  if (!resultsArray) {
    throw new SearchError(ASERROR, "unexpected result from artstation endpoint");
  }

  const searchResultArray = resultsArray.map((val) => ({
    img_url: val.url,
    title: val.title,
    author_id: val.user.id,
    author_name: val.user.username,
    preview_url: val.smaller_square_cover_url,
    id: val.id,
    mature_content: val.hide_as_adult,
    api_data: {
      ArtStation: val,
    }
  }));

  return searchResultArray;
}

async function retrieveUnsplashResults(q) {
  const result = await axios.get(`https://api.unsplash.com/search/photos`, {
    params: {
      query: q,
    },
    headers: {
      Authorization: `Client-ID ${us_client_id}`
    }
  });
  const resultsArray = result.data.results;
  if (!resultsArray) {
    throw new SearchError(USERROR, "unexpected result from unsplash endpoint");
  }
  const searchResultArray = resultsArray.map((val) => ({
    img_url: val.urls.full,
    title: val.alt_description ?? val.description,
    author_id: val.user.id,
    author_name: val.user.username,
    preview_url: val.urls.thumb,
    id: val.id,
    mature_content: false,
    api_data: {
      Unsplash: val,
    }
  }));

  return searchResultArray;
}

async function retrievePixabayResults(q) {
  const result = await axios.get(`https://pixabay.com/api/`, {
    params: {
      key: pb_key,
      q: q,
    },
  });
  const resultsArray = result.data.hits;
  if (!resultsArray) {
    throw new SearchError(USERROR, "unexpected result from unsplash endpoint");
  }
  const searchResultArray = resultsArray.map((val) => ({
    img_url: val.largeImageURL,
    title: null,
    author_id: val.user_id,
    author_name: val.user,
    preview_url: val.previewURL,
    id: val.id,
    mature_content: false,
    api_data: {
      Pixabay: val,
    }
  }));

  return searchResultArray;
}

async function getSearchResults(req, res) {
  const { q } = req.query;

  try {
    // const daResults = await retrieveDAResults(q);
    const asAuth = await retrievePixabayResults(q);
    res.send(asAuth);
  } catch (err) {
    res.status(401).send(err);
    return;
  }
}

module.exports = {
  getSearchResults,
}
