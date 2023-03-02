import { useAtomValue } from "jotai";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router";
import { searchResultsFamily } from "../atoms/search";
import SearchResultCards from "./SearchResultCards";
import classes from "./SearchPage.module.scss";

function SearchPage() {
  const { query } = useParams();
  const [currentProviderIdx, setCurrentProviderIdx] = useState(0); //index in the providers array, from 0 to 3
  const searchResultsAtom = searchResultsFamily(query);
  const searchResults = useAtomValue(searchResultsAtom);
  const providers = ["Pixabay", "ArtStation", "DeviantArt", "Unsplash"];

  console.log("search result atom content: ", searchResults);

  useEffect(() => {
    return () => {
      if (searchResults.state === "hasError") {
        console.log("error detected. Attempting cleanup...");
        searchResultsFamily.remove(query);
      }
    }
  })

  return (
    <div>
      <p className={classes.settings}>We have query: {query}</p>
      <div className={classes.settings}>Settings</div>
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
      {searchResults.state === "hasData" ? <SearchResultCards currentData={searchResults.data[currentProviderIdx]} /> : "Loading..."}
    </div>
  );
}

export default SearchPage;
