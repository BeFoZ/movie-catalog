import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Movies from "./pages/Movies.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import MoviesListTop from "./pages/MoviesListTop.jsx";
import MoviesListMain from "./pages/MoviesListMain.jsx";
import { MOVIE_LISTS, TOP_LISTS } from '../constants.js';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Movies />,
        },
        ...TOP_LISTS.map(el => ({
          path: el.url,
          element: <MoviesListTop />,
        })),
        ...MOVIE_LISTS.map(el => ({
          path: el.url,
          element: <MoviesListMain />,
        })),
        {
          path: "/movie/:id",
          element: <MovieDetails />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
