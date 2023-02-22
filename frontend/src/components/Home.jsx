import React from "react";
import Navigationbar from "./Navigationbar";
import classes from './Home.module.css'

function Home() {
  return (
    <>
      <Navigationbar style={{ width: "100%" }} />

      <form action="" method="get" className="form-example">
        <input type="text" placeholder="Search" className={classes.searchBar} />
        <input type="submit" value="Send Request" />
      </form>
    </>
  );
}

export default Home;
