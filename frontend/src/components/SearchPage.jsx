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
  const providors = ["Pixabay", "ArtStation", "DeviantArt", "Unsplash"];

  console.log("search result atom content: ", searchResults);

  return (
    <div>
      <p>We have query: {query}</p>
      <div className={classes.settings}>Settings</div>
      <div className={classes.providors}>
        {providors.map((providor, idx) => (
          <Button
            variant="outline-dark"
            key={providor}
            className={classes.button}
            onClick={() => setCurrentProviderIdx(idx)}
          >
            {providor}
          </Button>
        ))}
      </div>
      <div className={classes.card}>
        {searchResults.state === "hasData" ? <CardResult currentData={searchResults.data[currentProviderIdx]} /> : "Loading..."}
      </div>
    </div>
  );
}

export default SearchPage;
