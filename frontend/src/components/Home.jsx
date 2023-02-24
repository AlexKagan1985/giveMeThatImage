import React from "react";
import Navigationbar from "./Navigationbar";
import classes from "./Home.module.css";
import Commonkeywords from "./Commonkeywords";

function Home() {
  return (
    <div>
      <Navigationbar style={{ width: "100%" }} />

      <form action="" method="get" className={classes.form}>
        <input type="text" placeholder="Search" className={classes.searchBar} />
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
