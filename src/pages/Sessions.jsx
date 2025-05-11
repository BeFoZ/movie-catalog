import { useEffect, useState } from "react";
import tmdbApi from "../services/tmdbApi";

const timeSlots = ["09:00", "12:00", "15:00", "18:00", "21:00"];
const partsOfDay = {
  morning: ["09:00", "12:00"],
  afternoon: ["15:00"],
  evening: ["18:00", "21:00"],
};

const generateRandomSessions = (movie) => {
  const today = new Date();
  const sessions = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const showtimes = timeSlots
      .sort(() => 0.5 - Math.random()) // Random order
      .slice(0, Math.floor(Math.random() * 3) + 2); // 2–4 times

    showtimes.forEach((time) => {
      sessions.push({
        movie,
        date: date.toISOString().split("T")[0],
        time,
      });
    });
  }

  return sessions;
};

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    genre: "",
    partOfDay: "",
  });

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await tmdbApi.getPopularMovies();
        const movies = data.results;

        const genreList = new Set();
        const allSessions = [];

        for (const movie of movies) {
          const details = await tmdbApi.getMovieDetails(movie.id);
          details.genres?.forEach((g) => genreList.add(g.name));
          const movieSessions = generateRandomSessions(details);
          allSessions.push(...movieSessions);
        }

        setGenres(Array.from(genreList));
        setSessions(allSessions);
        setFilteredSessions(allSessions);
      } catch (error) {
        console.error("Error loading sessions:", error);
      }
    };

    loadSessions();
  }, []);

  useEffect(() => {
    let result = [...sessions];

    if (filters.date) {
      result = result.filter((s) => s.date === filters.date);
    }

    if (filters.genre) {
      result = result.filter((s) =>
        s.movie.genres.some((g) => g.name === filters.genre)
      );
    }

    if (filters.partOfDay) {
      result = result.filter((s) =>
        partsOfDay[filters.partOfDay].includes(s.time)
      );
    }

    setFilteredSessions(result);
  }, [filters, sessions]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Sessions</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="bg-gray-800 text-white p-2 rounded-lg"
          />

          <select
            name="genre"
            value={filters.genre}
            onChange={handleChange}
            className="bg-gray-800 text-white p-2 rounded-lg"
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            name="partOfDay"
            value={filters.partOfDay}
            onChange={handleChange}
            className="bg-gray-800 text-white p-2 rounded-lg"
          >
            <option value="">Any time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        {/* List of sessions */}
        <div className="grid grid-cols-1 gap-6">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session, index) => (
              <div
                key={`${session.movie.id}-${index}`}
                className="bg-gray-800 p-4 rounded-xl shadow flex flex-col md:flex-row items-center gap-4"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${session.movie.poster_path}`}
                  alt={session.movie.title}
                  className="w-28 h-40 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{session.movie.title}</h2>
                  <p className="text-gray-300">
                    {session.movie.genres.map((g) => g.name).join(", ")}
                  </p>
                  <p>
                    📅 {session.date} — 🕒 {session.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No sessions found for the given filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
