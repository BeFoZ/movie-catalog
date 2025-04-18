import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Layout";
import Movies from "./pages/Movies/Movies";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import MoviesListTop from "./pages/MoviesListTop/MoviesListTop";
import MoviesListMain from "./pages/MoviesListMain/MoviesListMain";
import { MOVIE_LISTS, TOP_LISTS } from './constants';

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
