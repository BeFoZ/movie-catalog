import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Favorites from "./pages/Favorites.jsx";
import moviesData from "../movies.json";

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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
