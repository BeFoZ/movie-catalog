import { useParams } from "react-router-dom";
import moviesData from "../../movies.json";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Skeleton from "./Skeleton";
import ErrorMessage from "./ErrorMessage";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Імітуємо затримку завантаження
        await new Promise(resolve => setTimeout(resolve, 1000));
        const foundMovie = moviesData.find((m) => String(m.id) === id);
        if (!foundMovie) {
          throw new Error('Фільм не знайдено');
        }
        setMovie(foundMovie);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  useEffect(() => {
    if (movie) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setIsFavorite(favorites.some((f) => f.id === movie.id));
    }
  }, [movie]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const updated = isFavorite
      ? favorites.filter((f) => f.id !== movie.id)
      : [...favorites, movie];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Poster */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="rounded-2xl shadow-lg object-cover w-full h-[450px]"
        />

        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-bold">{movie.title}</h1>

          {/* Rating + Year */}
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full flex items-center">
              <Star className="h-4 w-4 mr-1" /> {movie.rating}
            </span>
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.genre}</span>
          </div>

          {/* Description */}
          <p className="text-gray-300">{movie.description}</p>

          {/* Cast */}
          <p>
            <span className="text-white font-semibold">Актори:</span>{" "}
            {movie.cast?.join(", ")}
          </p>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className={`mt-4 py-2 px-4 rounded-xl text-white font-semibold transition ${
              isFavorite
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {isFavorite ? "Видалити з обраного" : "Додати до обраного"}
          </button>
        </div>
      </div>

      {/* Trailer */}
      {movie.trailer && (
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold mb-2">Трейлер</h2>
          <iframe
            width="100%"
            height="400"
            src={movie.trailer}
            title="Трейлер"
            frameBorder="0"
            allowFullScreen
            className="rounded-lg shadow"
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetails;

