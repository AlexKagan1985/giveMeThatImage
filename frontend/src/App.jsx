import classes from "./App.module.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
// import SearchPage from "./components/SearchPage";
import Profile from "./components/Profile";
import ImageDetails from "./components/ImageDetails";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import SearchHistory from "./components/SearchHistory";
import { QueryClient, QueryClientProvider } from "react-query";
import Navigationbar from "./components/Navigationbar";
import SearchHistoryDetailedPage from "./components/SearchHistoryDetailedPage";
import { useRef, useEffect } from "react";

function MainLayout () {
  const navBarRef = useRef();
  const rootRef = useRef();

  useEffect(() => {
    const navHeight = navBarRef.current;

    rootRef.current.style.setProperty("--navbar-real-height", `${navHeight.offsetHeight}px`);
  }, [])

  return (
    <div className={classes["main-container"]} ref={rootRef}>
      <Navigationbar isFixed={true}  ref={navBarRef}/>
      <Navigationbar />
      <main className={classes["main-element"]}>
        <QueryClientProvider client={queryClient} >
          <Outlet />
        </QueryClientProvider>
      </main>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    // element: <Home />,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/search",
        element: <Home />
      },
      {
        path: "/search/:query",
        element: <Home />
      },
      {
        path: "/search/:query/:provider/:page",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/image",
        element: <ImageDetails />,
      },
      {
        path: "/register/:redirect",
        element: <RegistrationPage />
      },
      {
        path: "/login/:redirect",
        element: <LoginPage />
      },
      {
        path: "/user-history",
        element: <SearchHistory />
      },
      {
        path: "/user-history/:queryId",
        element: <SearchHistoryDetailedPage />
      },
      {
        path: "/user-history/:queryId/:provider/:page",
        element: <SearchHistoryDetailedPage />
      },
    ]
  },
]);

const queryClient = new QueryClient();

function App() {
  // const [count, setCount] = useState(0);

  console.log(classes);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
