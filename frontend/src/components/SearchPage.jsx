import { useAtomValue } from "jotai";
import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate/* , useParams */ } from "react-router";
import { searchResultsFamily } from "../atoms/search";
import SearchResultCards from "./SearchResultCards";
import classes from "./SearchPage.module.scss";

function SearchPage({query, provider, page}) {
  // const { query, provider, page } = useParams();
  const pageNumber = page === undefined ? 1 : parseInt(page);
  const currentProviderIdx = provider !== undefined ? parseInt(provider) : 0;
  //const [currentProviderIdx, setCurrentProviderIdx] = useState(provider !== undefined ? parseInt(provider) : 0); //index in the providers array, from 0 to 3
  const searchResultsAtom = searchResultsFamily(query);
  const searchResults = useAtomValue(searchResultsAtom);
  const navigate = useNavigate();
  const providers = ["Pixabay", "ArtStation", /* "DeviantArt", */ "Unsplash"];

  console.log("search result atom content: ", searchResults);

  useEffect(() => {
    return () => {
      if (searchResults.state === "hasError") {
        console.log("error detected. Attempting cleanup...");
        searchResultsFamily.remove(query);
      }
    };
  });

  const setCurrentProviderIdx = (pIdx) => {
    navigate(`/search/${encodeURIComponent(query)}/${pIdx}/1`);
  }

  const handleChangePageNumber = (newPageNumber) => {
    navigate(`/search/${encodeURIComponent(query)}/${currentProviderIdx}/${newPageNumber}`);
  }

  return (
    <div>
      {/* <p className={classes.settings}>We have query: {query}</p> */ }
      <div className={classes.providers}>
        {providers.map((provider, idx) => (
          <Button
            variant={idx !== currentProviderIdx ? "outline-dark" : "dark"}
            key={provider}
            className={classes.button}
            onClick={() => setCurrentProviderIdx(idx)}
          >
            {provider}
          </Button>
        ))}
      </div>

      {searchResults.state === "hasData" ? <SearchResultCards 
        currentData={searchResults.data[currentProviderIdx]} 
        pageNumber={pageNumber} 
        setCurrentPage={handleChangePageNumber}/> : "Loading..."}

    </div>
  );
}

export default SearchPage;
