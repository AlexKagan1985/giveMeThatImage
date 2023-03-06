import { useParams, useNavigate } from "react-router-dom";
import { searchHistoryFamily } from "../atoms/search";
import classes from "./SearchPage.module.scss";
import SearchResultCards from "./SearchResultCards";
import { Button } from "react-bootstrap";
import { useAtomValue } from "jotai";

function SearchHistoryDetailedPage() {
  const { queryId, provider, page } = useParams();
  const pageNumber = page === undefined ? 1 : parseInt(page);
  const currentProviderIdx = provider !== undefined ? parseInt(provider) : 0;
  // const [currentProviderIdx, setCurrentProviderIdx] = useState(0); //index in the providers array, from 0 to 3
  const providers = ["Pixabay", "ArtStation", "DeviantArt", "Unsplash"];
  const searchResultsAtom = searchHistoryFamily(queryId);
  const searchResults = useAtomValue(searchResultsAtom);
  const navigate = useNavigate();

  console.log("current results are ", searchResults);

  const setCurrentProviderIdx = (pIdx) => {
    navigate(`/user-history/${queryId}/${pIdx}/1`);
  }

  const handleChangePageNumber = (newPageNumber) => {
    navigate(`/user-history/${queryId}/${currentProviderIdx}/${newPageNumber}`);
  }

  return (
    <div>
      <p className={classes.settings}>We have query: {queryId}</p>
      <div className={classes.settings}>Settings</div>
      <div className={classes.providers}>
        {providers.map((provider, idx) => (
          <Button
            variant={idx !== currentProviderIdx ? "outline-dark" : "dark"}
            key={provider}
            className={classes.button}
            onClick={() => setCurrentProviderIdx(idx)}
          >
            {provider}
          </Button>
        ))}
      </div>
      {
        searchResults.state === "hasData" ? 
        <SearchResultCards 
          currentData={searchResults.data[currentProviderIdx]} 
          pageNumber={pageNumber} 
          setCurrentPage={handleChangePageNumber}
        /> : "Loading..."
      }
    </div>
  )
}

export default SearchHistoryDetailedPage;