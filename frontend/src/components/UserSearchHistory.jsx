/* eslint-disable no-unused-vars */
import { useAtomValue } from "jotai"
import { useLocation, useNavigate } from "react-router-dom";
import { loggedInUserToken } from "../atoms/auth.js"
import { useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const UserSearchHistory = () => {
  const userToken = useAtomValue(loggedInUserToken);
  const navigate = useNavigate();
  const location = useLocation();
  const { data, error, isLoading } = useQuery(['userHistory', userToken],
    () => axios.get("http://localhost:3001/previous_queries", {
      headers: {
        Authorization: `BEARER ${userToken}`
      }
    }))

  console.log("current path name: ", location.pathname);
  data && console.log("we have new data: ", data);

  // last queries will contain an array of last made queries
  /** @type {{_id: string, creation_date: string, query_string: string, user_id: string}[]} */
  const lastQueries = data?.data ?? [];

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
    <div>
      User search history goes here!
      <p> Your user token is: {userToken} </p>
      {isLoading && <p>We are loading data...</p>}
      <ul>
        {lastQueries.map(val => (
          <li key={val._id}>&quot;{val.query_string}&quot; made on {val.creation_date} </li>
        ))}
      </ul>
    </div>
  )
}

export default UserSearchHistory
