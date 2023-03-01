/* eslint-disable no-unused-vars */
import { useAtomValue } from "jotai";
import React, { useMemo, useState } from "react";
import { Pagination } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
// eslint-disable-next-line no-unused-vars
import { PaginatedSearchResult } from "../atoms/search";
import classes from "./CardResult.module.css";

const Paginated = ({ totalPages, setCurrentPage, currentPage }) => {
  let result = null;

  if (totalPages < 7) {
    result = Array.from({length: totalPages}).map((_val, i) => (
      <Pagination.Item onClick={() => setCurrentPage(i)} key={i}> i </Pagination.Item>
    ));
  } else {
    result = (
      <>
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage-1)} disabled={currentPage === 1}/>
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
        <Pagination.Next onClick={() => setCurrentPage(currentPage+1)} disabled={currentPage === totalPages}/>
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}/>
      </>
    )
  }
  return result;
};

/**
 * @typedef {object} CardResultProps
 * @property {PaginatedSearchResult} currentData
 *
 * @param {CardResultProps} param
 */
function CardResult({ currentData }) {
  const [currentPage, setCurrentPage] = useState(1);
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
        ? pageData.data.map((data) => (
            <Card key={data.id} className={classes.card}>
              <Card.Img
                variant="top"
                src={data.preview_url}
                className={classes.img}
              />
              <Card.Body className={classes.card_body}>
                <Card.Title>{data.title}</Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>{`provider: ${currentData.provider}`}</ListGroup.Item>
              </ListGroup>
              <Card.Body className={classes.card_body}>
                <Card.Link href={data.img_url}>Card Link</Card.Link>
              </Card.Body>
            </Card>
          ))
        : "Loading..."}
      </div>
      <Pagination>
        <Paginated
          totalPages={currentData.totalPages}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </Pagination>
    </>
  );
}

export default CardResult;
