import { atom, getDefaultStore } from "jotai";
import { atomFamily, loadable } from "jotai/utils";
import { loggedInUser } from "./auth";
import axios from "axios";

const backendUrl = "http://localhost:3001";

export class PaginatedSearchResult {
  constructor(totalPages, firstPage, pageProvider, providerName) {
    this.totalPages = totalPages;
    this.pageMap = new Map([[1, firstPage]]);
    this.pageProvider = pageProvider;
    this.pageAtoms = new Map();
    this.providerName = providerName;
  }

  async page(pageNumber) {
    // see if we have this page already, and if we do, just return it
    if (this.pageMap.has(pageNumber)) {
      return this.pageMap.get(pageNumber);
    }

    const newPage = await this.pageProvider(pageNumber);
    this.pageMap.set(pageNumber, newPage);
    return newPage;
  }

  pageAtom(pageNumber) {
    if (this.pageAtoms.has(pageNumber)) {
      return this.pageAtoms.get(pageNumber);
    }

    const newAtom = loadable(atom(async () => this.page(pageNumber)));
    this.pageAtoms.set(pageNumber, newAtom);
    return newAtom;
  }

  get provider() {
    return this.providerName;
  }
}

function createPageProvider(provider, query, queryId) {
  return async (pageNumber) => {
    const resultData = await axios.get(backendUrl + "/search", {
      params: {
        q: query,
        page: pageNumber,
        type: provider,
        queryId
      }
    });

    const myResult = resultData.data.results.find(val => val.provider === provider);
    return myResult.data;
  }
}

export const searchResultsFamily = atomFamily((query) => {
  const defaultStore = getDefaultStore();
  const resAsync = atom(async () => {
    const userToken = defaultStore.get(loggedInUser);
    console.log("See user token: ", userToken);
    const resultData = await axios.get(backendUrl + "/search", {
      params: {
        q: query,
      },
      headers: {
        Authorization: `BEARER ${userToken}`,
      }
    });
    /** @type {{maxPages: number, page: number, provider: string, data: object[]}[]} */
    const rawSearchResults = resultData.data.results;
    const queryId = resultData.data._id;
    const pixabayResult = rawSearchResults.find(val => val.provider === "pixabay");
    const asResult = rawSearchResults.find(val => val.provider === "artstation");
    const daResult = rawSearchResults.find(val => val.provider === "deviantart");
    const unsplashResult = rawSearchResults.find(val => val.provider === "unsplash");

    return [
      new PaginatedSearchResult(pixabayResult.maxPages, pixabayResult.data, createPageProvider("pixabay", query, queryId), "pixabay"),
      new PaginatedSearchResult(asResult.maxPages, asResult.data, createPageProvider("artstation", query, queryId), "artstation"),
      new PaginatedSearchResult(daResult.maxPages, daResult.data, createPageProvider("deviantart", query, queryId), "deviantart"),
      new PaginatedSearchResult(unsplashResult.maxPages, unsplashResult.data, createPageProvider("unsplash", query, queryId), "unsplash"),
    ]
  });
  return loadable(resAsync);
});

