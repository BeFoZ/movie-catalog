import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layout from './Layout';
import Movies from './pages/Movies/Movies';
import MovieDetails from './pages/MovieDetails/MovieDetails';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Movies />
        },
        {
          path: "/movie/:id",
          element: <MovieDetails />
        } 
      ]
    },
  ]);

  return <RouterProvider router={router} />
}

export default App
