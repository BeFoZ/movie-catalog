import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Skeleton from "../components/Skeleton";
import ErrorMessage from "../components/ErrorMessage";
import tmdbApi from "../services/tmdbApi";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const movieData = await tmdbApi.getMovieDetails(id);
        if (!movieData) {
          throw new Error('Movie not found');
        }
        setMovie(movieData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  useEffect(() => {
  const loadCredits = async () => {
    if (movie) {
      const credits = await tmdbApi.getMovieCredits(movie.id);
      setCast(credits.cast?.slice(0, 8) || []); // 8 actors
    }
  };

  loadCredits();
}, [movie]);

  useEffect(() => {
    if (movie) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setIsFavorite(favorites.some((f) => f.id === movie.id));
    }
  }, [movie]);

  useEffect(() => {
    const loadTrailer = async () => {
      if (movie) {
        const trailerUrl = await tmdbApi.getMovieTrailer(movie.id);
        setMovie((prev) => ({ ...prev, trailer: trailerUrl }));
      }
    };

    loadTrailer();
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
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-2xl shadow-lg object-cover w-full h-[450px]"
        />

        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-bold">{movie.title}</h1>

          {/* Rating + Year */}
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full flex items-center">
              <Star className="h-4 w-4 mr-1" /> {movie.vote_average.toFixed(1)}
            </span>
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>•</span>
            <span>{movie.genres?.map(genre => genre.name).join(", ")}</span>
          </div>

          {/* Description */}
          <p className="text-gray-300">{movie.overview}</p>

          {/* Runtime */}
          <p>
            <span className="text-white font-semibold">Duration:</span>{" "}
            {movie.runtime} minutes
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
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </button>
        </div>
      </div>

      {/* Trailer */}
{movie.trailer && (
  <div className="max-w-6xl mx-auto mt-12">
    <h2 className="text-2xl font-semibold mb-2">Trailer</h2>
    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={movie.trailer}
        title="Trailer"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  </div>
)}
       {/* Cast */}
{cast.length > 0 && (
  <div className="max-w-6xl mx-auto mt-12">
    <h2 className="text-2xl font-semibold mb-4">Actors</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cast.map((actor) => (
        <div key={actor.id} className="flex flex-col items-center text-center">
          <img
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                : "https://via.placeholder.com/185x278?text=No+Image"
            }
            alt={actor.name}
            className="w-[120px] h-[180px] object-cover rounded-lg shadow mb-2"
          />
          <p className="text-white font-medium">{actor.name}</p>
          <p className="text-sm text-gray-400">{actor.character}</p>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
};

export default MovieDetails;


