import { atom, getDefaultStore } from "jotai";
import { atomFamily, loadable } from "jotai/utils";
import { loggedInUserToken } from "./auth";
import axios from "../axios";

const backendUrl = "";

export class PaginationError extends Error {
  constructor(provider, pageNumber) {
    super(`Page ${pageNumber} from ${provider} doesnt exist or cant get`);
    this.provider = provider;
    this.page = pageNumber;
  }
}

export class PaginationSolution {
  constructor(first, last, prev, next) {
    this.first = first;
    this.last = last;
    this.prev = prev;
    this.next = next;
  }

  nextPageNumber(pageNumber) {
    return this.next(pageNumber);
  }

  previousPageNumber(pageNumber) {
    return this.prev(pageNumber);
  }

  firstPageNumber() {
    return this.first;
  }

  lastPageNumber() {
    return this.last;
  }
}

export class PaginatedSearchResult {
  constructor(maxPageNumber, pageCount, firstPage, pageProvider, providerName) {
    this.maxPageNumber = maxPageNumber;
    this.pageCount = pageCount;
    this.pageMap = firstPage ? new Map([[1, firstPage]]) : new Map();
    const [pageProvFn, paginator] = pageProvider;
    console.log("found", pageProvFn, paginator);
    this.pageProvider = pageProvFn;
    this.paginator = paginator;
    this.pageAtoms = new Map();
    this.providerName = providerName;
  }

  async page(pageNumber) {
    if (!this.pageAvailable(pageNumber)) {
      console.error("Seeing nonexistent page number in PaginatedSearchResult.page() function");
      return;
    }
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

  pageAvailable(pageNumber) {
    return (pageNumber >= 1 && pageNumber <= this.maxPageNumber);
  }

  get provider() {
    return this.providerName;
  }
}

function historicalPageProvider(provider, pagesArray) {
  const filteredPages = pagesArray.filter(p => p.provider === provider);
  let minPageNumber = Infinity;
  let maxPageNumber = 0;
  filteredPages.forEach(p => {
    minPageNumber = Math.min(minPageNumber, p.page);
    maxPageNumber = Math.max(maxPageNumber, p.page);
  })
  return [async (pageNumber) => {
    const resultData = filteredPages.find(p => p.page === pageNumber);
    if (! resultData) {
      throw new PaginationError(provider, pageNumber);
    }
    return resultData.data;
  }, new PaginationSolution(minPageNumber, maxPageNumber, (pageNumber) => {
      // get page number that is less than pageNumber
      let pageCandidate = 0;
      filteredPages.forEach(p => {
        pageCandidate = p.page >= pageNumber ? pageCandidate : Math.max(pageCandidate, p.page);
      });
      if (pageCandidate === 0) {
        return null;
      }
      return pageCandidate;
    }, (pageNumber) => {
      // get the first page number that is greater than pageNumber
      let pageCandidate = Infinity;
      filteredPages.forEach(p => {
        pageCandidate = p.page <= pageNumber ? pageCandidate : Math.min(pageCandidate, p.page);
      });
      if (pageCandidate === Infinity) {
        return null;
      }
      return pageCandidate;
    })
  ];
}

function createPageProvider(provider, query, queryId, maxPages) {
  return [async (pageNumber) => {
    const resultData = await axios.get(backendUrl + "/search", {
      params: {
        q: query,
        page: pageNumber,
        type: provider,
        queryId
      }
    });

    const myResult = resultData.data.results.find(val => val.provider === provider);
    if (!myResult) {
      throw new PaginationError(provider, pageNumber);
    }
    return myResult.data;
  }, new PaginationSolution(1, maxPages, (pageNumber) => {
      return pageNumber === 1 ? null : pageNumber - 1;
    }, (pageNumber) => {
      return pageNumber >= maxPages ? null : pageNumber + 1;
    })
  ];
}

export const searchResultsFamily = atomFamily((query) => {
  const defaultStore = getDefaultStore();
  const resAsync = atom(async () => {
    const userToken = defaultStore.get(loggedInUserToken);
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
    // const daResult = rawSearchResults.find(val => val.provider === "deviantart");
    const unsplashResult = rawSearchResults.find(val => val.provider === "unsplash");

    const resultArray = [];
    for (const [prov, data] of [["pixabay", pixabayResult], ["artstation", asResult], ["unsplash", unsplashResult]]) {
      if (data && data.maxPages > 0) {
        resultArray.push(new PaginatedSearchResult(data.maxPages, data.maxPages, data.data, createPageProvider(prov, query, queryId, data.maxPages), prov));
      }
    }

    return resultArray;
  });
  return loadable(resAsync);
});

export const searchHistoryFamily = atomFamily((queryId) => {
  const defaultStore = getDefaultStore();
  return loadable(atom(async() => {
    const userToken = defaultStore.get(loggedInUserToken);
    const result = await axios.get(backendUrl + "/query_info", {
      params: {
        queryId,
      }, 
      headers: {
        Authorization: `BEARER ${userToken}`,
      },
    });
    console.log("retrieved pages with", result.data);
    const pages = result.data.pages;

    const pageCountMap = new Map([["pixabay", 0], ["artstation", 0], /* ["deviantart", 0], */ ["unsplash", 0]]);
    const maxPagesMap = new Map([["pixabay", Infinity], ["artstation", Infinity], /* ["deviantart", Infinity], */ ["unsplash", Infinity]]);
    result.data.pages.forEach(p => {
      pageCountMap.set(p.provider, pageCountMap.get(p.provider) + 1);
      maxPagesMap.set(p.provider, Math.min(p.maxPages, maxPagesMap.get(p.provider)));
    });

    const resultArray = [];
    for (const prov of ["pixabay", "artstation", "unsplash"]) {
      if ( maxPagesMap.get(prov) !== Infinity && maxPagesMap.get(prov) > 0 ) {
        resultArray.push(new PaginatedSearchResult(maxPagesMap.get(prov), pageCountMap.get(prov), null, historicalPageProvider(prov, pages), prov))
      }
    }

    return resultArray;
  }));
})

