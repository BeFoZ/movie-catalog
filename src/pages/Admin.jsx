import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import tmdbApi from '../services/tmdbApi';
import {
  fetchSessions,
  addSession,
  updateSession,
  deleteSession,
} from '../services/sessionsApi';

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({ movieId: '', date: '', time: '', price: '' });
  const [movieSearch, setMovieSearch] = useState('');

  useEffect(() => {
    fetchSessions().then(setSessions).catch(console.error);
    tmdbApi.getPopularMovies(1)
        .then(res => setMovies(res.results || []))
        .catch(() => setMovies([]));
  }, []);

  const handleSessionFormChange = (e) => {
    setSessionForm({ ...sessionForm, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setSessionForm({ movieId: '', date: '', time: '', price: '' });
    setEditingSession(null);
    setIsAddingSession(true);
  };

  const handleEditClick = (session) => {
    setSessionForm({
      movieId: session.movie_id,
      date: session.date,
      time: session.time,
      price: session.price,
    });
    setEditingSession(session.id);
    setIsAddingSession(true);
  };

  const handleDeleteClick = async (id) => {
    await deleteSession(id);
    setSessions(await fetchSessions());
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingSession) {
      await updateSession(editingSession, sessionForm);
    } else {
      await addSession(sessionForm);
    }
    setIsAddingSession(false);
    setEditingSession(null);
    setSessions(await fetchSessions());
  };

  const filteredMovies = movies.filter((m) =>
      m.title.toLowerCase().includes(movieSearch.toLowerCase())
  );

  if (loading) return <div>Loading…</div>;
  if (!user?.user_metadata?.is_admin) return <Navigate to='/' replace />;

  return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md border-b mb-8">
          <div className="max-w-4xl mx-auto px-4 flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Admin Panel
            </h1>
            <button
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sessions</h2>
            <button
                onClick={handleAddClick}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              Add Session
            </button>
          </div>

          {isAddingSession && (
              <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-xl shadow mb-8 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Movie</label>
                  <input
                      type="text"
                      placeholder="Search movie..."
                      value={movieSearch}
                      onChange={(e) => setMovieSearch(e.target.value)}
                      className="w-full mb-2 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                      name="movieId"
                      value={sessionForm.movieId}
                      onChange={handleSessionFormChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select movie</option>
                    {filteredMovies.map((m) => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={sessionForm.date}
                        onChange={handleSessionFormChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Time</label>
                    <input
                        type="time"
                        name="time"
                        value={sessionForm.time}
                        onChange={handleSessionFormChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Price (UAH)</label>
                    <input
                        type="number"
                        name="price"
                        value={sessionForm.price}
                        onChange={handleSessionFormChange}
                        required
                        min={1}
                        className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                      type="button"
                      onClick={() => { setIsAddingSession(false); setEditingSession(null); }}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                  >
                    {editingSession ? 'Save Changes' : 'Add'}
                  </button>
                </div>
              </form>
          )}

          <div className="space-y-4">
            {sessions.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No sessions available.</div>
            ) : (
                sessions.map((session) => {
                  const movie = movies.find((m) => m.id === session.movie_id);
                  return (
                      <div key={session.id} className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:items-center md:gap-6">
                        <div className="flex-1 flex items-center gap-4">
                          {movie && (
                              <img
                                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                  alt={movie.title}
                                  className="w-20 h-28 object-cover rounded-lg shadow"
                              />
                          )}
                          <div>
                            <div className="font-bold text-lg text-gray-900">{movie ? movie.title : 'Movie not found'}</div>
                            <div className="text-gray-500 text-sm">{session.date} • {session.time}</div>
                            <div className="text-blue-600 font-semibold mt-1">{session.price} UAH</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                              onClick={() => handleEditClick(session)}
                              className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                              onClick={() => handleDeleteClick(session.id)}
                              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                  );
                })
            )}
          </div>
        </main>
      </div>
  );
}