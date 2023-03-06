import React, { useState, useCallback } from "react";
import classes from "./Home.module.scss";
// import Commonkeywords from "./Commonkeywords";
import { useNavigate, useParams } from "react-router";
import SearchPage from "./SearchPage";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const {query, provider, page} = useParams();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  }, [searchQuery])

  return (
    <div className={`${classes.form_container} ${!query && classes.form_centered} `}>
      <form onSubmit={handleSubmit} action="" method="get" className={`${classes.form}`}>
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search" className={classes.searchBar} />
        <input
          type="submit"
          value="Send Request"
          className={classes.searchButton}
        />
      </form>
      {/* <div className={classes.keywords} >
        <Commonkeywords />
      </div> */}
      {query && <SearchPage query={query} provider={provider} page={page} />}
    </div>
  );
}

export default Home;
