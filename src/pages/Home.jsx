import React from "react";
import { Link } from "react-router-dom";

export default function Home({ movies }) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Movie Grid */}
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
      </div>
    </div>
  );
}
