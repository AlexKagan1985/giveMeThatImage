import React from "react";
import Navigationbar from "./Navigationbar";

function Home() {
  return (
    <>
      <Navigationbar style={{ width: "100%" }} />

      <form action="" method="get" className="form-example">
        <input type="text" placeholder="Search" />
        <input type="submit" value="Send Request" />
      </form>
    </>
  );
}

export default Home;
