import React, { useState, useCallback } from "react";
import Navigationbar from "./Navigationbar";
import classes from "./Home.module.css";
import Commonkeywords from "./Commonkeywords";
import { useNavigate } from "react-router";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    navigate(`/search/${searchQuery}`);
  }, [searchQuery])

  return (
    <div>
      <Navigationbar style={{ width: "100%" }} />

      <form onSubmit={handleSubmit} action="" method="get" className={classes.form}>
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search" className={classes.searchBar} />
        <input
          type="submit"
          value="Send Request"
          className={classes.searchButton}
        />
      </form>
      <Commonkeywords />
    </div>
  );
}

export default Home;
