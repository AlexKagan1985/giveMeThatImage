/* eslint-disable no-unused-vars */
import { useAtom, useAtomValue } from "jotai";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Pagination } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import { selectedImageAtom } from "../atoms/imageDetails";
// eslint-disable-next-line no-unused-vars
import { PaginatedSearchResult } from "../atoms/search";
import classes from "./SearchResultCards.module.css";

const Paginated = ({ pageCount, setCurrentPage, currentPage, paginator }) => {
  let result = null;

  const nextNPages = useCallback((n) => {
    const result = [];
    let pn = currentPage;
    for (let i = 0; i < n; ++i) {
      const nextValue = paginator.nextPageNumber(pn);
      if (nextValue === null) {
        // no next page
        break;
      }
      pn = nextValue;
      result.push(nextValue);
    }
    return result;
  }, [currentPage, paginator]);

  const prevNPages = useCallback((n) => {
    const result = [];
    let pn = currentPage;
    for (let i = 0; i < n; ++i) {
      const nextValue = paginator.previousPageNumber(pn);
      if (nextValue === null) {
        // no next page
        break;
      }
      pn = nextValue;
      result.unshift(nextValue);
    }
    return result;
  }, [currentPage, paginator])

  if (pageCount < 7) {
    const nextPages = nextNPages(7);
    const prevPages = prevNPages(7);
    result = [...prevPages, currentPage, ...nextPages].map((i) => (
      <Pagination.Item onClick={() => setCurrentPage(i)} key={i} active={i === currentPage}> {" "}{i}{" "} </Pagination.Item>
    ));
  } else {
    const nextPages = nextNPages(2);
    const prevPages = prevNPages(2);
    const nextPage = paginator.nextPageNumber(currentPage);
    const prevPage = paginator.previousPageNumber(currentPage);
    result = (
      <>
        <Pagination.First onClick={() => setCurrentPage(paginator.firstPageNumber())} disabled={currentPage === paginator.firstPageNumber()} />
        <Pagination.Prev onClick={() => setCurrentPage(prevPage)} disabled={!prevPage}/>
        {currentPage > 3 && <Pagination.Ellipsis />}
        {[...prevPages, currentPage, ...nextPages].map((idx) => {
          const linksToPage = idx;
          return (
            <Pagination.Item
              key={idx}
              onClick={() => setCurrentPage(linksToPage)}
              active={linksToPage === currentPage}
            >
              {linksToPage}
            </Pagination.Item>
          );
        })}

        {currentPage < pageCount - 2 && <Pagination.Ellipsis />}
        <Pagination.Next onClick={() => setCurrentPage(nextPage)} disabled={!nextPage}/>
        <Pagination.Last onClick={() => setCurrentPage(paginator.lastPageNumber())} disabled={currentPage === paginator.lastPageNumber()}/>
      </>
    );
  }
  return result;
};

function SearchResultCard({ data, provider }) {
  const thisCard = useRef();
  const navigate = useNavigate();
  const [, setCurrentImage] = useAtom(selectedImageAtom);

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
      // console.log("the card is ", thisCard.current);

      const x_diff = 0.017 * (mouseX - centerX);
      const y_diff = 0.017 * (mouseY - centerY);

      // console.log("x", x_diff, "y", y_diff);

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

  const handleSeeImage = (e) => {
    e.preventDefault();
    setCurrentImage(data);
    navigate("/image");
  }

  return (
    <Card className={classes.card} ref={thisCard}>
      <a href="#" onClick={handleSeeImage}>
        <Card.Img variant="top" src={data.preview_url} className={classes.img} />
        <Card.Body className={classes.card_body}>
          <Card.Title>{data.title}</Card.Title>
        </Card.Body>
      </a>
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
function SearchResultCards({ currentData, pageNumber, setCurrentPage }) {
  // const [currentPage, setCurrentPage] = useState(pageNumber);

  // If currentData changes, reset the currentPage
  // useEffect(() => {
  //   console.log("resetting current page");
  //   setCurrentPage(1);
  // }, [currentData]);

  const pageAtom = useMemo(() => {
    return currentData.pageAtom(pageNumber);
  }, [pageNumber, currentData]);

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
          pageCount={currentData.pageCount}
          paginator={currentData.paginator}
          setCurrentPage={setCurrentPage}
          currentPage={pageNumber}
        />
      </Pagination>
    </>
  );
}

export default SearchResultCards;
