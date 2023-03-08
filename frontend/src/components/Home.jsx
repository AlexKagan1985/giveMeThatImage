import React, { useState, useCallback } from "react";
import classes from "./Home.module.scss";
// import Commonkeywords from "./Commonkeywords";
import { useNavigate, useParams } from "react-router";
import SearchPage from "./SearchPage";
import SearchInputBar from "./SearchInputBar";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const {query, provider, page} = useParams();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    },
    [searchQuery]
  );

  return (
    <>
      <div className={`${classes.form_container} ${!query && classes.form_centered} `}>
        {!query && <div className={classes.hero_section} >give me that image!</div>}
        <form onSubmit={handleSubmit} action="" method="get" className={`${classes.form}`}>
          <SearchInputBar value={searchQuery} setValue={setSearchQuery} />
        </form>
        {/* <div className={classes.keywords} >
          <Commonkeywords />
        </div> */}
        {query && <SearchPage query={query} provider={provider} page={page} />}
      </div>
    </>
  );
}

export default Home;
