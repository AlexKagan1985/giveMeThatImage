import { useAtomValue } from "jotai";
import React from "react";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router";
import { searchResultsFamily } from "../atoms/search";
import CardResult from "./CardResult";
import classes from "./SearchPage.module.css";

function SearchPage() {
  const { query } = useParams();
  const searchResultsAtom = searchResultsFamily(query);
  const searchResults = useAtomValue(searchResultsAtom);
  const providors = ["DeviantArt", "ArtStation", "Unsplash", "fourth providor"];

  console.log("search result atom content: ", searchResults);

  return (
    <div>
      <p>We have query: {query}</p>
      <div className={classes.settings}>Settings</div>
      <div className={classes.providors}>
        {providors.map((providor) => (
          <Button
            variant="outline-dark"
            key={providor}
            className={classes.button}
          >
            {providor}
          </Button>
        ))}
      </div>
      <div className={classes.card}>
        <CardResult />
      </div>
    </div>
  );
}

export default SearchPage;
