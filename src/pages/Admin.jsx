import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tmdbApi from '../services/tmdbApi';

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    movieId: '',
    date: '',
    time: '',
    price: '',
  });
  // Login state
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });
  const [movieSearch, setMovieSearch] = useState("");

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    if (!token || !sessionExpiry || new Date().getTime() > parseInt(sessionExpiry)) {
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('sessionExpiry');
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Завантаження фільмів з TMDB API
  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await tmdbApi.getPopularMovies(1);
        setMovies(response.results || []);
      } catch {
        setMovies([]);
      }
    }
    fetchMovies();
    const storedSessions = JSON.parse(localStorage.getItem('sessions')) || [];
    setSessions(storedSessions);
  }, []);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    try {
      const correctUsername = 'admin';
      const correctPassword = 'Admin123!';
      if (loginForm.username === correctUsername && loginForm.password === correctPassword) {
        const token = Math.random().toString(36).substring(7);
        const sessionExpiry = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('sessionExpiry', sessionExpiry.toString());
        setIsAuthenticated(true);
        navigate('/admin');
      } else {
        setLoginError('Incorrect username or password');
      }
    } catch {
      setLoginError('Login error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('sessionExpiry');
    navigate('/admin');
  };

  // Сеанси CRUD
  const handleSessionFormChange = (e) => {
    setSessionForm({ ...sessionForm, [e.target.name]: e.target.value });
  };

  const handleAddSession = () => {
    setSessionForm({ movieId: '', date: '', time: '', price: '' });
    setEditingSession(null);
    setIsAddingSession(true);
  };

  const handleEditSession = (session) => {
    setSessionForm({
      movieId: session.movieId,
      date: session.date,
      time: session.time,
      price: session.price,
    });
    setEditingSession(session.id);
    setIsAddingSession(true);
  };

  const handleDeleteSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const handleSessionSubmit = (e) => {
    e.preventDefault();
    if (editingSession) {
      setSessions(sessions.map((s) => (s.id === editingSession ? { ...sessionForm, id: editingSession } : s)));
    } else {
      setSessions([...sessions, { ...sessionForm, id: Date.now() }]);
    }
    setIsAddingSession(false);
    setEditingSession(null);
    setSessionForm({ movieId: '', date: '', time: '', price: '' });
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(movieSearch.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.02]">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Panel Login</h1>
          {loginError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md border-b border-gray-100 mb-8">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sessions</h2>
          <button
            onClick={handleAddSession}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Add session
          </button>
        </div>
        {isAddingSession && (
          <form onSubmit={handleSessionSubmit} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Movie</label>
              <input
                type="text"
                placeholder="Search movie..."
                value={movieSearch}
                onChange={e => setMovieSearch(e.target.value)}
                className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="movieId"
                value={sessionForm.movieId}
                onChange={handleSessionFormChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select movie</option>
                {filteredMovies.map((movie) => (
                  <option key={movie.id} value={movie.id}>{movie.title}</option>
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setIsAddingSession(false); setEditingSession(null); }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                {editingSession ? 'Save changes' : 'Add'}
              </button>
            </div>
          </form>
        )}
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No sessions yet.</div>
          ) : (
            sessions.map((session) => {
              const movie = movies.find((m) => m.id === session.movieId);
              return (
                <div key={session.id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:gap-6">
                  <div className="flex-1 flex items-center gap-4">
                    {movie && (
                      <img
                        src={movie.posterUrl}
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
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => handleEditSession(session)}
                      className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
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
