import React, { useState, useCallback } from "react";
import classes from "./Home.module.scss";
import Commonkeywords from "./Commonkeywords";
import { useNavigate } from "react-router";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    },
    [searchQuery]
  );

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        action=""
        method="get"
        className={classes.form}
      >
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search"
          className={classes.searchBar}
        />
        <input type="submit" value="Search" className={classes.searchButton} />
      </form>
      <div className={classes.keywords}>
        <Commonkeywords />
      </div>
    </div>
  );
}

export default Home;
