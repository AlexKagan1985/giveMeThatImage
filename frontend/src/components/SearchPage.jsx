import React from "react";
import Button from "react-bootstrap/Button";
import CardResult from "./CardResult";
import classes from "./SearchPage.module.css";

function SearchPage() {
  const providors = ["DeviantArt", "ArtStation", "Unsplash", "fourth providor"];

  return (
    <div>
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
