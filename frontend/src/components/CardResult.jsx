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
  const results = [];

  if (totalPages < 7) {
    for (let i = 1; i < totalPages; i++) {
      results.push(
        <Pagination.Item onClick={() => setCurrentPage(i)}> i </Pagination.Item>
      );
    }
  } else {
    results.push(
      <>
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item onClick={() => setCurrentPage(1)}>{1}</Pagination.Item>
        <Pagination.Ellipsis />

        {Array.from({ length: 5 }).map((_, idx) => (
          <Pagination.Item
            key={idx}
            onClick={() => setCurrentPage(currentPage - idx + 3)}
          >
            {currentPage - idx + 3}
          </Pagination.Item>
        ))}

        <Pagination.Ellipsis />
        <Pagination.Item onClick={() => setCurrentPage(10)}>
          {10}
        </Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </>
    );
  }
  return results;
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
      {pageData.state === "hasData"
        ? pageData.data.map((data) => (
            <Card style={{ width: "18rem" }} key={data.id}>
              <Card.Img
                variant="top"
                src={data.preview_url}
                className={classes.img}
              />
              <Card.Body className={classes.body}>
                <Card.Title>{data.title}</Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>{`providor: ${currentData.provider}`}</ListGroup.Item>
              </ListGroup>
              <Card.Body className={classes.body}>
                <Card.Link href={data.img_url}>Card Link</Card.Link>
              </Card.Body>
            </Card>
          ))
        : "Loading..."}
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
