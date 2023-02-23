// import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import SearchPage from "./components/SearchPage";
import Profile from "./components/Profile";

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
