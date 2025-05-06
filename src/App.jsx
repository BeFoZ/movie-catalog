import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Favorites from "./pages/Favorites.jsx";
import moviesData from "../movies.json";
import SearchResults from "./pages/SearchResults.jsx";
import Sessions from "./pages/Sessions.jsx";
import Admin from "./pages/Admin.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home movies={moviesData} />,
          loader: () => moviesData,
        },
        { path: "/favorites", element: <Favorites /> },
        { path: "/movie/:id", element: <MovieDetails /> },
        { path: "/search", element: <SearchResults /> },
        { path: "/sessions", element: <Sessions /> },
        { path: "/admin", element: <Admin /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
