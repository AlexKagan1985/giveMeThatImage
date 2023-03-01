/* eslint-disable no-unused-vars */
import { useAtomValue } from "jotai"
import { useLocation, useNavigate } from "react-router-dom";
import { loggedInUser, loggedInUserToken } from "../atoms/auth.js"
import { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import classes from "./UserSearchHistory.module.scss";

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

const UserSearchHistory = () => {
  const userToken = useAtomValue(loggedInUserToken);
  const userState = useAtomValue(loggedInUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: rawData, error, isLoading } = useQuery(['userHistory', userToken],
    () => axios.get("http://localhost:3001/previous_queries", {
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
  }, [])

  return (
    <div className={classes.container}>
      User search history goes here!
      <p> Your username is: {userState.login}</p>
      {isLoading && <p>We are loading data...</p>}
      <ul className={classes.history_list}>
        {lastQueries.map(val => (
          <HistoryItem item={val} key={val._id} />
        ))}
      </ul>
    </div>
  )
}

export default UserSearchHistory
