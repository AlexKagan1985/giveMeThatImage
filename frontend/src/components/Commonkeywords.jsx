import React from "react";
import Button from "react-bootstrap/Button";

function Commonkeywords() {
  const commonKeywords = ["first word", "second word", "third word"];
  return commonKeywords.map((keyword) => (
    <Button variant="outline-primary" size="lg" className="m-2" key={keyword}>
      {keyword}
    </Button>
  ));
}

export default Commonkeywords;
