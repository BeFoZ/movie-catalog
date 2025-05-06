import React, { useState } from "react";
import moviesData from "../../movies.json";

const AdminPage = () => {
  const [movies, setMovies] = useState(moviesData);
  const [newMovie, setNewMovie] = useState({
    title: "",
    time: "",
    ticketPrice: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  const addMovie = () => {
    if (!newMovie.title || !newMovie.time || !newMovie.ticketPrice) return;

    setMovies((prev) => [
      ...prev,
      { ...newMovie, id: Date.now().toString() },
    ]);
    setNewMovie({ title: "", time: "", ticketPrice: "" });
  };

  const deleteMovie = (id) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMovie = (id, key, value) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [key]: value } : m))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Add New Movie */}
      <div className="mb-8 space-y-2">
        <h2 className="text-xl font-semibold">Add New Movie</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            name="title"
            placeholder="Title"
            value={newMovie.title}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <input
            name="time"
            placeholder="Session Time (e.g., 18:00)"
            value={newMovie.time}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <input
            name="ticketPrice"
            placeholder="Ticket Price"
            value={newMovie.ticketPrice}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <button
            onClick={addMovie}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Movie List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Movies List</h2>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white shadow p-4 rounded space-y-2"
          >
            <input
              value={movie.title}
              onChange={(e) =>
                updateMovie(movie.id, "title", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
            <input
              value={movie.time}
              onChange={(e) =>
                updateMovie(movie.id, "time", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
            <input
              value={movie.ticketPrice}
              onChange={(e) =>
                updateMovie(movie.id, "ticketPrice", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
            <button
              onClick={() => deleteMovie(movie.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
