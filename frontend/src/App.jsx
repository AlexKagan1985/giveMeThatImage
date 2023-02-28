import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import SearchPage from "./components/SearchPage";
import Profile from "./components/Profile";
import ImageDetails from "./components/ImageDetails";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import UserSearchHistory from "./components/UserSearchHistory";
import { QueryClient, QueryClientProvider } from "react-query";

const router = createBrowserRouter([
  {
    path: "/",
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
]);

const queryClient = new QueryClient();

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient} >
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
