import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import ErrorMessage from "../components/ErrorMessage";
import tmdbApi from "../services/tmdbApi";

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let response;
        if (searchQuery) {
          response = await tmdbApi.searchMovies(searchQuery, page);
        } else {
          response = await tmdbApi.getPopularMovies(page);
        }
        
        if (response.results.length === 0 && searchQuery) {
          throw new Error('Фільми не знайдено');
        }
        
        setMovies(response.results);
        setTotalPages(response.total_pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [searchQuery, page]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-screen-lg mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index}>
                <Skeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-screen-lg mx-auto px-4 py-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Movie Poster */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />

              {/* Movie Details */}
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {movie.title}
                </h3>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 text-sm">
                    {new Date(movie.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center bg-blue-500 text-white px-2 py-1 rounded text-sm">
                    ★ {movie.vote_average.toFixed(1)}
                  </span>
                </div>

                <p className="text-gray-300 text-sm line-clamp-3">
                  {movie.overview}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Пагінація */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-600"
          >
            Попередня
          </button>
          <span className="px-4 py-2 text-white">
            Сторінка {page} з {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-600"
          >
            Наступна
          </button>
        </div>
      </div>
    </div>
  );
}
