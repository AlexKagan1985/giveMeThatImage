import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import SearchPage from "./components/SearchPage";
import Profile from "./components/Profile";
import ImageDetails from "./components/ImageDetails";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";

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
  }
]);

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
