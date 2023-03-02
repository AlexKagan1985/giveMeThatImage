/* eslint-disable no-unused-vars */
import { useAtomValue } from "jotai";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Pagination } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
// eslint-disable-next-line no-unused-vars
import { PaginatedSearchResult } from "../atoms/search";
import classes from "./SearchResultCards.module.css";

const Paginated = ({ totalPages, setCurrentPage, currentPage }) => {
  let result = null;

  if (totalPages < 7) {
    result = Array.from({ length: totalPages }).map((_val, i) => (
      <Pagination.Item onClick={() => setCurrentPage(i + 1)} key={i}>
        {" "}
        {i + 1}{" "}
      </Pagination.Item>
    ));
  } else {
    result = (
      <>
        <Pagination.First
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {currentPage > 3 && <Pagination.Ellipsis />}
        {Array.from({ length: 5 }).map((_, idx) => {
          const linksToPage = currentPage - 2 + idx;
          return linksToPage >= 1 && linksToPage <= totalPages ? (
            <Pagination.Item
              key={idx}
              onClick={() => setCurrentPage(linksToPage)}
              active={linksToPage === currentPage}
            >
              {linksToPage}
            </Pagination.Item>
          ) : null;
        })}

        {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
        <Pagination.Next
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </>
    );
  }
  return result;
};

function SearchResultCard({ data, provider }) {
  const thisCard = useRef();

  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const mouseMoveHandler = (e) => {
      if (!thisCard.current) {
        return;
      }
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      //console.log("x, ", mouseX, "y, ", mouseY);
      console.log("the card is ", thisCard.current);

      const x_diff = 0.017 * (mouseX - centerX);
      const y_diff = 0.017 * (mouseY - centerY);

      console.log("x", x_diff, "y", y_diff);

      thisCard.current.style.setProperty("--rotateX", -y_diff + "deg");
      thisCard.current.style.setProperty("--rotateY", x_diff + "deg");
    };
    // after mount
    addEventListener("mousemove", mouseMoveHandler);

    return () => {
      // before unmount
      removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return (
    <Card className={classes.card} ref={thisCard}>
      <Card.Img variant="top" src={data.preview_url} className={classes.img} />
      <Card.Body className={classes.card_body}>
        <Card.Title>{data.title}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>{`provider: ${provider}`}</ListGroup.Item>
      </ListGroup>
      <Card.Body className={classes.card_body}>
        <Card.Link href={data.img_url}>Card Link</Card.Link>
      </Card.Body>
    </Card>
  );
}

/**
 * @typedef {object} CardResultProps
 * @property {PaginatedSearchResult} currentData
 *
 * @param {CardResultProps} param
 */
function SearchResultCards({ currentData }) {
  const [currentPage, setCurrentPage] = useState(1);

  // If currentData changes, reset the currentPage
  useEffect(() => {
    console.log("resetting current page");
    setCurrentPage(1);
  }, [currentData]);

  const pageAtom = useMemo(() => {
    return currentData.pageAtom(currentPage);
  }, [currentPage, currentData]);

  const pageData = useAtomValue(pageAtom);

  console.log("see current data: ", currentData);
  console.log("see page data: ", pageData);

  return (
    <>
      <div className={classes.cards}>
        {pageData.state === "hasData"
          ? pageData.data?.map((data) => (
              <SearchResultCard
                data={data}
                provider={currentData.provider}
                key={data.id}
              />
            ))
          : pageData.state === "loading"
          ? "Loading..."
          : "We have some error here, try to go back and redo the search again"}
      </div>
      <Pagination className={classes.center_this}>
        <Paginated
          totalPages={currentData.totalPages}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </Pagination>
    </>
  );
}

export default SearchResultCards;
