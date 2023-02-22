const axios = require('axios');

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
    console.log("got da authentication: ", res);
    DAToken = res.access_token;
  }
  return DAToken;
}

async function retrieveDAResults(query) {
  // First we need to authenticate ourselves
  const authToken = await getDAAuth();
  const res = await axios.get(`https://www.deviantart.com/api/v1/oauth2/browse/popular?q=${query}`,
    { headers: { "Authorization": `Bearer ${authToken}` } });

}

function getSearchResults(req, res) {
  const { query } = req.query;

  res.send({
    receivedQuery: query
  })
}

module.exports = {
  getSearchResults,
}
