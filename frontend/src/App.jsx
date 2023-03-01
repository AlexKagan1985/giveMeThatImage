import classes from "./App.module.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import SearchPage from "./components/SearchPage";
import Profile from "./components/Profile";
import ImageDetails from "./components/ImageDetails";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import UserSearchHistory from "./components/UserSearchHistory";
import { QueryClient, QueryClientProvider } from "react-query";
import Navigationbar from "./components/Navigationbar";

function MainLayout () {
  return (
    <>
      <Navigationbar />
      <main className={classes["main-element"]}>
        <QueryClientProvider client={queryClient} >
          <Outlet />
        </QueryClientProvider>
      </main>
    </>
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
        path: "/search/:query",
        element: <SearchPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/image/:id",
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
        element: <UserSearchHistory />
      }
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
