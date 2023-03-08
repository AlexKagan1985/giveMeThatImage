/* eslint-disable no-unused-vars */
import { useAtom, useAtomValue, atom } from "jotai";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Pagination } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import { selectedImageAtom } from "../atoms/imageDetails";
// eslint-disable-next-line no-unused-vars
import { PaginatedSearchResult } from "../atoms/search";
import classes from "./SearchResultCards.module.scss";

const nullAtom = atom(() => null);

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

function SearchResultCard({ data, provider, placeholder }) {
  const thisCard = useRef();
  const navigate = useNavigate();
  const [, setCurrentImage] = useAtom(selectedImageAtom);
  const [imageLoaded, setImageLoaded] = useState(false);

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
    if (placeholder) {
      // do nothing if it's a placeholder image
      return;
    }
    setCurrentImage(data);
    navigate("/image");
  }

  return (
    <div className={classes.card} ref={thisCard}>
      { !placeholder && 
      <a href="#" onClick={handleSeeImage} >
      <div className={classes.image_block}>
        { !imageLoaded && <Card.Img variant="top" className={`${classes.img} placeholder placeholder-wave ${classes.placeholder_under}`} />}
        <Card.Img variant="top" src={data.preview_url} className={classes.img} onLoad={() => setImageLoaded(true)} />
      </div>
      </a>
      }
      { placeholder &&
      <>
        <Card.Img variant="top" className={`${classes.img} placeholder placeholder-wave`} />
      </> 
      }
      <div className={classes.card_data} >
        { !placeholder &&
        <>
          <div className={`${classes.card_body} ${classes.hidden_unfocused}`}>
            <div className={classes.card_title}>{data.title}</div>
          </div>
          <div className={`list-group-flush ${classes.hidden_unfocused}`}>
            <span>{`provider: ${provider}`}</span>
          </div> 
        </>
        }
        <div className={`${classes.card_body} ${classes.hidden_unfocused}`}>
          {!placeholder && <a href={data.img_url}>Card Link</a> }
        </div>
      </div>
    </div>
  );
}

/**
 * @typedef {object} CardResultProps
 * @property {PaginatedSearchResult} currentData
 *
 * @param {CardResultProps} param
 */
function SearchResultCards({ currentData, pageNumber, setCurrentPage, placeholder }) {
  // const [currentPage, setCurrentPage] = useState(pageNumber);

  // If currentData changes, reset the currentPage
  // useEffect(() => {
  //   console.log("resetting current page");
  //   setCurrentPage(1);
  // }, [currentData]);

  const pageAtom = useMemo(() => {
    if (placeholder) {
      return null;
    }
    return currentData.pageAtom(pageNumber);
  }, [pageNumber, currentData, placeholder]);

  const pageData = placeholder ? useAtomValue(nullAtom) : useAtomValue(pageAtom);

  console.log("see current data: ", currentData);
  console.log("see page data: ", pageData);

  return (
    <>
      <div className={classes.cards}>
        {!placeholder && pageData.state === "hasData"
          ? pageData.data?.filter(data => !data.mature_content).map((data) => (
              <SearchResultCard
                data={data}
                provider={currentData.provider}
                key={data.id}
              />
            ))
          : placeholder || pageData.state === "loading"
          ? Array.from({length: 20}).map((_, idx) => (
            <SearchResultCard placeholder={true} key={idx} />
          ))
          : "We have some error here, try to go back and redo the search again"}
      </div>
      {!placeholder && <Pagination className={classes.center_this}>
        <Paginated
          pageCount={currentData.pageCount}
          paginator={currentData.paginator}
          setCurrentPage={setCurrentPage}
          currentPage={pageNumber}
        />
      </Pagination>}
    </>
  );
}

export default SearchResultCards;
