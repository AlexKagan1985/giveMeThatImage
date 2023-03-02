import { useParams } from "react-router-dom";
import { useState } from "react";
import { searchHistoryFamily } from "../atoms/search";
import classes from "./SearchPage.module.scss";
import SearchResultCards from "./SearchResultCards";
import { Button } from "react-bootstrap";
import { useAtomValue } from "jotai";

function SearchHistoryDetailedPage() {
  const { queryId } = useParams();
  const [currentProviderIdx, setCurrentProviderIdx] = useState(0); //index in the providers array, from 0 to 3
  const providers = ["Pixabay", "ArtStation", "DeviantArt", "Unsplash"];
  const searchResultsAtom = searchHistoryFamily(queryId);
  const searchResults = useAtomValue(searchResultsAtom);

  console.log("current results are ", searchResults);

  return (
    <div>
      <p className={classes.settings}>We have query: {queryId}</p>
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
  )
}

export default SearchHistoryDetailedPage;