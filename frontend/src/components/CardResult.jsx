/* eslint-disable no-unused-vars */
import { useAtomValue } from "jotai";
import React, { useMemo, useState } from "react";
import { Pagination } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
// eslint-disable-next-line no-unused-vars
import { PaginatedSearchResult } from "../atoms/search";
import testData from "../mock_data/out.json";
import classes from "./CardResult.module.css";

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
      {pageData.state === "hasData" ? pageData.data.map((data) => (
        <Card style={{ width: "18rem" }} key={data.id}>
          <Card.Img variant="top" src={data.preview_url} className={classes.img} />
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
      )) : "Loading..."}
      <Pagination>
        <Pagination.Item onClick={() => setCurrentPage(1)}> 1 </Pagination.Item>
        <Pagination.Item onClick={() => setCurrentPage(2)}> 2 </Pagination.Item>
        <Pagination.Item onClick={() => setCurrentPage(3)}> 3 </Pagination.Item>
      </Pagination>
    </>
  );
}

export default CardResult;
