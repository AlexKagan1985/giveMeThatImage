import { useAtomValue } from "jotai";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router";
import { searchResultsFamily } from "../atoms/search";
import CardResult from "./CardResult";
import classes from "./SearchPage.module.css";

function SearchPage() {
  const { query } = useParams();
  const [currentProviderIdx, setCurrentProviderIdx] = useState(0); //index in the providers array, from 0 to 3
  const searchResultsAtom = searchResultsFamily(query);
  const searchResults = useAtomValue(searchResultsAtom);
  const providers = ["Pixabay", "ArtStation", "DeviantArt", "Unsplash"];

  console.log("search result atom content: ", searchResults);

  return (
    <div>
      <p>We have query: {query}</p>
      <div className={classes.settings}>Settings</div>
      <div className={classes.providers}>
        {providers.map((provider, idx) => (
          <Button
            variant="outline-dark"
            key={provider}
            className={classes.button}
            onClick={() => setCurrentProviderIdx(idx)}
          >
            {provider}
          </Button>
        ))}
      </div>
      {searchResults.state === "hasData" ? <CardResult currentData={searchResults.data[currentProviderIdx]} /> : "Loading..."}
    </div>
  );
}

export default SearchPage;
