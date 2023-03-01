import axios from 'axios';
import { QueryModel, ResultModel } from '../models/searchQuery.js';
import { timed } from '../utils/timed.js';
import { D } from '../utils/d.js';

const DAERROR = 1; // error in a deviant art request
const ASERROR = 2; // error in artstation request
const USERROR = 3; // error in Unsplash request
const PBERROR = 4; // error in Pixabay request

const PAGE_LIMIT = 20;

class SearchError extends Error {
  constructor(ty, msg) {
    super(`${ty}: ${msg}`);
    this.type = ty;
  }
}

/**
* @typedef {object} SearchResult
* @property {string} img_url
* @property {string} title
* @property {string} author_id
* @property {string} author_name
* @property {string} preview_url
* @property {string} id
* @property {boolean} mature_content
* @property {object} api_data
*/

/**
* @typedef {object} PaginationData
* @property {number} maxPages
* @property {number} page
* @property {SearchResult} data
* @property {"deviantart"|"unsplash"|"pixabay"|"artstation"} provider
*/

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

/**
* Gets images from DeviantArt endpoint
* @async
* @param {string} query - search query
* @param {number} pageNumber - #page. Defaults to 1.
* @returns {Promise.<PaginationData[]>}
*/
async function retrieveDAResults(query, pageNumber) {
  // First we need to authenticate ourselves
  pageNumber ??= 1;
  const pageLimit = PAGE_LIMIT;
  const authToken = await getDAAuth();
  console.log("DeviantArt: authenticate with ", authToken)
  const res = await axios.get(`https://www.deviantart.com/api/v1/oauth2/browse/popular?q=${query}`,
    {
      headers: { "Authorization": `BEARER ${authToken}` },
      params: {
        q: query,
        limit: pageLimit,
        offset: (pageNumber - 1) * pageLimit,
      }
    });

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
    api_data: val,
  }));

  return {
    maxPages: Math.ceil(res.data.estimated_total / pageLimit),
    page: pageNumber,
    data: searchResultArray,
    provider: "deviantart",
  };
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

/**
* Gets images from artstation endpoint
* @async
* @param {string} query - search query
* @param {number} pageNumber - #page. Defaults to 1.
* @returns {Promise.<PaginationData[]>}
*/
async function retrieveASResults(q, pageNumber) {
  pageNumber ??= 1;
  const searchData = {
    additionalFields: [],
    filters: [],
    page: pageNumber,
    per_page: PAGE_LIMIT,
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
    api_data: val,
  }));

  return {
    maxPages: Math.ceil(result.data.total_count / PAGE_LIMIT),
    page: pageNumber,
    data: searchResultArray,
    provider: "artstation",
  };
}

/**
* Gets images from Unsplash endpoint
* @async
* @param {string} query - search query
* @param {number} pageNumber - #page. Defaults to 1.
* @returns {Promise.<PaginationData[]>}
*/
async function retrieveUnsplashResults(q, pageNumber) {
  pageNumber ??= 1;
  const result = await axios.get(`https://api.unsplash.com/search/photos`, {
    params: {
      query: q,
      per_page: PAGE_LIMIT,
      page: pageNumber,
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
    api_data: val
  }));

  return {
    maxPages: result.data.total_pages,
    page: pageNumber,
    data: searchResultArray,
    provider: "unsplash",
  };
}

/**
* Gets images from Pixabay endpoint
* @async
* @param {string} query - search query
* @param {number} pageNumber - #page. Defaults to 1.
* @returns {Promise.<PaginationData[]>}
*/
async function retrievePixabayResults(q, pageNumber) {
  pageNumber ??= 1;
  const result = await axios.get(`https://pixabay.com/api/`, {
    params: {
      key: pb_key,
      q: q,
      safesearch: true,
      page: pageNumber,
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
    api_data: val,
  }));

  return {
    maxPages: Math.ceil(Math.min(result.data.total, result.data.totalHits) / PAGE_LIMIT),
    page: pageNumber,
    data: searchResultArray,
    provider: "pixabay",
  };
}

export async function getSearchResults(req, res) {
  const { q, type, page, queryId } = req.query;
  const userData = req.user;
  console.log("current user data: ", userData);
  const PROVIDERS_ARRAY = ["pixabay", "artstation", "deviantart", "unsplash"];
  const types = (() => {
    const temp = type ? type.split(",") : PROVIDERS_ARRAY;
    return temp.filter(val => PROVIDERS_ARRAY.includes(val));
  })();
  const typeFuncsMap = new Map([
    ["pixabay", retrievePixabayResults],
    ["artstation", retrieveASResults],
    ["deviantart", retrieveDAResults],
    ["unsplash", retrieveUnsplashResults],
  ])
  const pageNumber = (() => {
    const temp = parseInt(page);
    return isNaN(temp) ? 1 : temp;
  })();

  console.log("found query with types, ", types, "pageNumber", pageNumber);

  try {
    const resPromises = types.map((val) => timed(D(typeFuncsMap.get(val))(q, pageNumber)));
    const resultModelPromise = queryId && ResultModel.findOne({
      query_id: queryId
    });
    const resultCollection = resultModelPromise && await resultModelPromise;

    // If we have real query id, we dont need to create a new one
    const queryInfoPromise = resultCollection ? null : timed(QueryModel.create({
      user_id: userData?._id,
      query_string: q,
      creation_date: new Date(),
    }));

    const resPromise = queryInfoPromise ? Promise.allSettled([...resPromises, queryInfoPromise]) :
      Promise.allSettled(resPromises);
    const promiseDesc = queryInfoPromise ? [...types, "mongodb"] : types;
    console.log("initiate search...");
    const allResultsTimed = await resPromise;
    console.log("search finished.");
    const queryInfo = queryInfoPromise ? allResultsTimed[allResultsTimed.length - 1].value.result : null;
    const allResultsFinished = [];
    const allResults = allResultsTimed.map(val => ({
      reason: val.reason?.error,
      status: val.status,
      value: val.value?.result,
    }));
    const perfData = allResultsTimed.map((value, index) => ({
      runtime: value.status === "fulfilled" ? value.value.runtime : value.reason.runtime,
      type: promiseDesc[index],
    }));
    // remove the last element - results of mongodb query
    const db_error = queryInfoPromise && allResults.pop().reason;
    // we are now left with provider responses only
    for (const res of allResults) {
      if (res.status === "rejected") {
        // TODO: perhaps signal rejection status to the client
        console.log("the request ", i, " was rejected. Reason ", res.reason);
        continue;
      }
      allResultsFinished.push(res.value);
    }
    if (resultCollection) {
      resultCollection.pages.push(...allResultsFinished);
      await resultCollection.save();
    } else {
      // we have a new query with new ID
      await ResultModel.create({
        query_id: queryInfo._id,
        pages: allResultsFinished,
      });
    }
    res.send({
      results: allResultsFinished,
      performance: perfData,
      ...(queryInfo?._doc ?? { db_error })
    });
  } catch (err) {
    res.status(401).send(err.message);
    return;
  }
}

/**
 * Retrieves previous queries of the current user from the database
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getPreviousQueries(req, res) {
  const userData = req.user;
  const queryAggregationPipeline = [
    {
      '$match': {
        'user_id': userData._id,
      }
    }, {
      '$lookup': {
        'from': 'searchresults',
        'localField': '_id',
        'foreignField': 'query_id',
        'as': 'result_preview'
      }
    }, {
      '$unwind': {
        'path': '$result_preview'
      }
    }, {
      '$set': {
        'result_preview.my_pages': {
          '$slice': [
            '$result_preview.pages', 4
          ]
        }
      }
    }, {
      '$project': {
        'result_preview.pages': 0
      }
    }
  ]
  // find all queries this user initiated
  const queries = await QueryModel.aggregate(queryAggregationPipeline);

  res.send(queries);
}

/**
 * Retrieves previous search results of our query
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getQueryResults(req, res) {
  const userData = req.user;

  const { queryId } = req.query;
  const authStatusRequest = await QueryModel.find({
    _id: queryId
  });

  if (authStatusRequest.length === 0 || !authStatusRequest[0].user_id.equals(userData._id)) {
    console.log("found query", authStatusRequest);
    // you cannot access this query result;
    res.status(403).send("Forbidden");
    return;
  }

  console.log("Finding query details for query id ", queryId);
  const searchResults = await ResultModel.find({
    query_id: queryId,
  });

  res.send(searchResults);
}
