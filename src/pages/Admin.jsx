import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [movies, setMovies] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [prices, setPrices] = useState({
    regular: 150,
    vip: 250,
    student: 100,
    child: 80,
  });

  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [isEditingPrices, setIsEditingPrices] = useState(false);

  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    duration: '',
    posterUrl: '',
  });

  const [sessionForm, setSessionForm] = useState({
    movieId: '',
    date: '',
    time: '',
    hall: '',
    price: '',
  });

  const [priceForm, setPriceForm] = useState({ ...prices });

  // Login state
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const correctUsername = 'admin';
      const correctPassword = 'Admin123!';
      
      if (loginForm.username === correctUsername && loginForm.password === correctPassword) {
        const token = Math.random().toString(36).substring(7);
        const sessionExpiry = new Date().getTime() + (0 * 60 * 60 * 1000); // 0 можна змінити на 24 години
        
        localStorage.setItem('adminToken', token);
        localStorage.setItem('sessionExpiry', sessionExpiry.toString());
        
        setIsAuthenticated(true);
        navigate('/admin');
      } else {
        setLoginError('Невірний логін або пароль');
      }
    } catch {
      setLoginError('Помилка при вході. Спробуйте ще раз.');
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

  const handleMovieSubmit = (e) => {
    e.preventDefault();
    if (isAddingMovie) {
      setMovies([...movies, { ...movieForm, id: Date.now() }]);
    }
    setMovieForm({
      title: '',
      description: '',
      duration: '',
      posterUrl: '',
    });
    setIsAddingMovie(false);
  };

  const handleSessionSubmit = (e) => {
    e.preventDefault();
    if (isAddingSession) {
      setSessions([...sessions, { ...sessionForm, id: Date.now() }]);
    }
    setSessionForm({
      movieId: '',
      date: '',
      time: '',
      hall: '',
      price: '',
    });
    setIsAddingSession(false);
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    setPrices(priceForm);
    setIsEditingPrices(false);
  };

  const handleDeleteMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  const handleDeleteSession = (id) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.02]">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Вхід в адмін-панель</h1>
          {loginError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Логін</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Введіть логін"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Пароль</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Введіть пароль"
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
              {isLoading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Адмін-панель
                </h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <button
                  onClick={() => setCurrentSection('dashboard')}
                  className={`${
                    currentSection === 'dashboard'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  Головна
                </button>
                <button
                  onClick={() => setCurrentSection('movies')}
                  className={`${
                    currentSection === 'movies'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  Фільми
                </button>
                <button
                  onClick={() => setCurrentSection('sessions')}
                  className={`${
                    currentSection === 'sessions'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  Сеанси
                </button>
                <button
                  onClick={() => setCurrentSection('prices')}
                  className={`${
                    currentSection === 'prices'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  Ціни
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                Вийти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {currentSection === 'dashboard' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="px-6 py-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Фільми</h3>
                  <p className="text-gray-600 mb-6">
                    Управління фільмами та їх деталями
                  </p>
                  <button
                    onClick={() => setCurrentSection('movies')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Перейти до фільмів
                  </button>
                </div>
              </div>

              <div className="bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="px-6 py-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Сеанси</h3>
                  <p className="text-gray-600 mb-6">
                    Управління сеансами та розкладом
                  </p>
                  <button
                    onClick={() => setCurrentSection('sessions')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Перейти до сеансів
                  </button>
                </div>
              </div>

              <div className="bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="px-6 py-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ціни</h3>
                  <p className="text-gray-600 mb-6">
                    Управління цінами на квитки
                  </p>
                  <button
                    onClick={() => setCurrentSection('prices')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Перейти до цін
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentSection === 'movies' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Управління фільмами</h2>
              <button
                onClick={() => setIsAddingMovie(true)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Додати фільм
              </button>
            </div>

            {isAddingMovie && (
              <div className="bg-white shadow-lg rounded-2xl mb-8">
                <div className="px-6 py-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {isAddingMovie ? 'Додати новий фільм' : 'Редагувати фільм'}
                  </h3>
                  <form onSubmit={handleMovieSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Назва фільму
                      </label>
                      <input
                        type="text"
                        value={movieForm.title}
                        onChange={(e) =>
                          setMovieForm({ ...movieForm, title: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть назву фільму"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Опис
                      </label>
                      <textarea
                        value={movieForm.description}
                        onChange={(e) =>
                          setMovieForm({ ...movieForm, description: e.target.value })
                        }
                        required
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть опис фільму"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Тривалість (хв)
                      </label>
                      <input
                        type="number"
                        value={movieForm.duration}
                        onChange={(e) =>
                          setMovieForm({ ...movieForm, duration: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть тривалість"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        URL постера
                      </label>
                      <input
                        type="url"
                        value={movieForm.posterUrl}
                        onChange={(e) =>
                          setMovieForm({ ...movieForm, posterUrl: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть URL постера"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsAddingMovie(false)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Скасувати
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Зберегти
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {movies.map((movie) => (
                  <li key={movie.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {movie.posterUrl && (
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="h-16 w-16 rounded-lg object-cover shadow-md"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {movie.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {movie.duration} хв
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleDeleteMovie(movie.id)}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                          >
                            Видалити
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {currentSection === 'sessions' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Управління сеансами</h2>
              <button
                onClick={() => setIsAddingSession(true)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Додати сеанс
              </button>
            </div>

            {isAddingSession && (
              <div className="bg-white shadow-lg rounded-2xl mb-8">
                <div className="px-6 py-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {isAddingSession ? 'Додати новий сеанс' : 'Редагувати сеанс'}
                  </h3>
                  <form onSubmit={handleSessionSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Фільм
                      </label>
                      <select
                        value={sessionForm.movieId}
                        onChange={(e) =>
                          setSessionForm({ ...sessionForm, movieId: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Виберіть фільм</option>
                        {movies.map((movie) => (
                          <option key={movie.id} value={movie.id}>
                            {movie.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Дата
                      </label>
                      <input
                        type="date"
                        value={sessionForm.date}
                        onChange={(e) =>
                          setSessionForm({ ...sessionForm, date: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Час
                      </label>
                      <input
                        type="time"
                        value={sessionForm.time}
                        onChange={(e) =>
                          setSessionForm({ ...sessionForm, time: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Зал
                      </label>
                      <input
                        type="text"
                        value={sessionForm.hall}
                        onChange={(e) =>
                          setSessionForm({ ...sessionForm, hall: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть номер залу"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ціна квитка
                      </label>
                      <input
                        type="number"
                        value={sessionForm.price}
                        onChange={(e) =>
                          setSessionForm({ ...sessionForm, price: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть ціну квитка"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsAddingSession(false)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Скасувати
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Зберегти
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {sessions.map((session) => (
                  <li key={session.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {movies.find((m) => m.id === session.movieId)?.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {session.date} {session.time} - Зал {session.hall}
                          </p>
                          <p className="text-sm text-gray-500">
                            Ціна: {session.price} грн
                          </p>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                          >
                            Видалити
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {currentSection === 'prices' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Управління цінами</h2>
              <button
                onClick={() => setIsEditingPrices(true)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Редагувати ціни
              </button>
            </div>

            {isEditingPrices ? (
              <div className="bg-white shadow-lg rounded-2xl">
                <div className="px-6 py-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Редагування цін
                  </h3>
                  <form onSubmit={handlePriceSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Звичайний квиток
                      </label>
                      <input
                        type="number"
                        value={priceForm.regular}
                        onChange={(e) =>
                          setPriceForm({ ...priceForm, regular: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть ціну"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        VIP квиток
                      </label>
                      <input
                        type="number"
                        value={priceForm.vip}
                        onChange={(e) =>
                          setPriceForm({ ...priceForm, vip: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть ціну"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Студентський квиток
                      </label>
                      <input
                        type="number"
                        value={priceForm.student}
                        onChange={(e) =>
                          setPriceForm({ ...priceForm, student: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть ціну"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Дитячий квиток
                      </label>
                      <input
                        type="number"
                        value={priceForm.child}
                        onChange={(e) =>
                          setPriceForm({ ...priceForm, child: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Введіть ціну"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditingPrices(false)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Скасувати
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Зберегти
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-2xl">
                <div className="px-6 py-8">
                  <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <dt className="text-sm font-semibold text-gray-500 mb-2">
                        Звичайний квиток
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">{prices.regular} грн</dd>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <dt className="text-sm font-semibold text-gray-500 mb-2">VIP квиток</dt>
                      <dd className="text-2xl font-bold text-gray-900">{prices.vip} грн</dd>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <dt className="text-sm font-semibold text-gray-500 mb-2">
                        Студентський квиток
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">{prices.student} грн</dd>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <dt className="text-sm font-semibold text-gray-500 mb-2">
                        Дитячий квиток
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">{prices.child} грн</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
