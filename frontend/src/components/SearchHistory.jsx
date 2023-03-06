/* eslint-disable no-unused-vars */
import { useAtomValue } from "jotai"
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { loggedInUser, loggedInUserToken } from "../atoms/auth.js"
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import classes from "./SearchHistory.module.scss";
import { ButtonGroup, Button } from "react-bootstrap";

const HISTORY_PAGE_SIZE = 7; // see also the constant in backend/controllers/search.js

/**
 * Shuffles array in place. ES6 version
 * From: stackoverflow https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const HistoryItem = ({ item }) => {

  const SearchQueryElement = <div className={classes.item_query}>
    <div>{item.query_string}</div>
    <div className={classes.creation_date}>{item.creation_date}</div>
    <NavLink to={`/user-history/${encodeURIComponent(item._id)}`}>Historical results</NavLink>
    <NavLink to={`/search/${encodeURIComponent(item.query_string)}`} >Search again</NavLink>
  </div>;

  const asPages = item.result_preview.pages?.find(p => p.provider === "artstation");
  const daPages = item.result_preview.pages?.find(p => p.provider === "deviantart");
  const usPages = item.result_preview.pages?.find(p => p.provider === "unsplash");
  const paPages = item.result_preview.pages?.find(p => p.provider === "pixabay");

  const QueryStatsElement = <div className={classes.item_stats}>
    {asPages && <div>Artstation: {asPages.maxPages} pages</div>}
    {daPages && <div>DeviantArt: {daPages.maxPages} pages</div>}
    {usPages && <div>Unsplash: {usPages.maxPages} pages</div>}
    {paPages && <div>Pixabay: {paPages.maxPages} pages</div>}
  </div>

  const largestResult = useMemo(() => item.result_preview.pages.reduce((prevVal, currentVal) => {
    if (prevVal.maxPages > currentVal.maxPages) {
      return prevVal;
    }
    return currentVal;
  }), [item]);

  const shuffledResult = useMemo(() => {
    const temp = [...largestResult.data];
    shuffle(temp);
    return temp;
  }, [largestResult]);

  const PicsPreviewElement = <div className={classes.item_preview}>
    <img src={shuffledResult[0].preview_url} />
    <img src={shuffledResult[1].preview_url} />
    <img src={shuffledResult[2].preview_url} />
    <img src={shuffledResult[3].preview_url} />
  </div>

  console.log("item is ", item);
  return (
    <li className={classes.history_item}>
      {SearchQueryElement}
      {PicsPreviewElement}
      {QueryStatsElement}
    </li>
  )
}

const SearchHistory = () => {
  const userToken = useAtomValue(loggedInUserToken);
  const userState = useAtomValue(loggedInUser);
  const [afterItem, setAfterItem] = useState(null);
  const [afterItemsQueue, setAfterItemsQueue] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: rawData, error, isLoading } = useQuery(['userHistory', userToken, afterItem],
    () => axios.get("http://localhost:3001/previous_queries", {
      params: afterItem ? {
        after: afterItem
      } : {},
      headers: {
        Authorization: `BEARER ${userToken}`
      }
    }));

  console.log("current path name: ", location.pathname);
  rawData && console.log("we have new data: ", rawData);

  // last queries will contain an array of last made queries
  /** @type {{_id: string, creation_date: string, query_string: string, user_id: string}[]} */
  const lastQueries = rawData?.data ?? [];

  if (error) {
    console.log("error in fetch: ", error);
  }

  useEffect(() => {
    if (!userToken) {
      // log in first if you dont have real user token
      navigate(`/login/${encodeURIComponent(location.pathname)}`);
    }
  }, [userToken])

  const handlePreviousPage = () => {
    const newAfter = afterItemsQueue.at(-1);
    setAfterItem(newAfter);
    setAfterItemsQueue(afterItemsQueue.filter((_val, idx) => idx !== afterItemsQueue.length - 1));
  }

  const handleNextPage = () => {
    const after = lastQueries.at(-1).creation_date;
    setAfterItem(after);
    setAfterItemsQueue([...afterItemsQueue, afterItem]);
  }

  return (
    <div className={classes.container}>
      User search history goes here!
      {userState && <p> Your username is: {userState.login}</p>}
      {isLoading && <p>We are loading data...</p>}
      {error && <p>We have an error, Scotty!</p>}
      <ul className={classes.history_list}>
        {lastQueries.map(val => (
          <HistoryItem item={val} key={val._id} />
        ))}
      </ul>
      <ButtonGroup className="justify-content-center d-flex">
        {afterItemsQueue.length > 0 && <Button onClick={handlePreviousPage} className="flex-grow-0">&lt; previous</Button>}
        {lastQueries.length === HISTORY_PAGE_SIZE && <Button onClick={handleNextPage} className="flex-grow-0">next &gt;</Button>}
      </ButtonGroup>
    </div>
  )
}

export default SearchHistory
