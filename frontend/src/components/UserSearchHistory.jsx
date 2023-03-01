/* eslint-disable no-unused-vars */
import { useAtomValue } from "jotai"
import { useLocation, useNavigate } from "react-router-dom";
import { loggedInUser, loggedInUserToken } from "../atoms/auth.js"
import { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import classes from "./UserSearchHistory.module.scss";

const HistoryItem = ({ item }) => {

  const SearchQueryElement = <div className={classes.item_query}>
    <div>{item.query_string}</div>
    <div className={classes.creation_date}>{item.creation_date}</div>
  </div>;

  const QueryStatsElement = <div className={classes.item_stats}>
    <div>Artstation: {item.result_preview.my_pages.find(p => p.provider === "artstation").maxPages} pages</div>
    <div>DeviantArt: {item.result_preview.my_pages.find(p => p.provider === "deviantart").maxPages} pages</div>
    <div>Unsplash: {item.result_preview.my_pages.find(p => p.provider === "unsplash").maxPages} pages</div>
    <div>Pixabay: {item.result_preview.my_pages.find(p => p.provider === "artstation").maxPages} pages</div>
  </div>

  /* const largestResult = useMemo(() => item.result_preview.my_pages.reduce((prevVal, currentVal) => {
    if (prevVal.maxPages > currentVal.maxPages) {
      return prevVal;
    }
    return currentVal;
  }), [item]); */

  const largestResult = item.result_preview.my_pages[0];

  const PicsPreviewElement = <div className={classes.item_preview}>
    <img src={largestResult.data[0].preview_url} />
    <img src={largestResult.data[1].preview_url} />
    <img src={largestResult.data[2].preview_url} />
    <img src={largestResult.data[3].preview_url} />
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
