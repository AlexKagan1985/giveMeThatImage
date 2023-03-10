import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
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
  const providers = ["Pixabay", "ArtStation", /* "DeviantArt", */ "Unsplash"];
  const searchResultsAtom = searchHistoryFamily(queryId);
  const searchResults = useAtomValue(searchResultsAtom);
  const navigate = useNavigate();

  const realProviders = useMemo(() => {
    if (searchResults.state !== "hasData") {
      return [];
    }
    return searchResults.data.map(val => providers.find(pName => val.providerName === pName.toLowerCase()));
  }, [searchResults])

  console.log("current results are ", searchResults);

  const setCurrentProviderIdx = (pIdx) => {
    navigate(`/user-history/${queryId}/${pIdx}/1`);
  }

  const handleChangePageNumber = (newPageNumber) => {
    navigate(`/user-history/${queryId}/${currentProviderIdx}/${newPageNumber}`);
  }

  return (
    <div>
      <div className={classes.providers}>
        {realProviders.map((provider, idx) => (
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