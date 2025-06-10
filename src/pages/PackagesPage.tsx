import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PackageService, { Game } from '../services/packageService'; // Named import of the class

const PackagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { gameId } = useParams<{ gameId?: string }>();
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load games from backend
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        const gamesData = await PackageService.getGames();
        setGames(gamesData);
        setFilteredGames(gamesData);
      } catch (error: any) {
        console.error('Failed to fetch games:', error);
        setError(error.message || 'Failed to load games');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Filter games based on search
  useEffect(() => {
    let filtered = games;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  }, [games, searchTerm]);

  // Handle game selection - navigate to chat page
  const handleGameSelect = useCallback((game: Game) => {
    console.log('Navigating with game:', game);
    
    // Navigate to chat page (HomePage) with game info
    navigate('/chat', {
      state: {
        selectedGame: game,
        preMessage: ` `
      }
    });
  }, [navigate]);

  // Show loading state while initially fetching games
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load games
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('games.title', 'Select Game')}
          </h1>
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            {t('common.backToHome', 'Back to Chat')}
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Message */}
        <div className="mb-6 text-center">
          <h2 className="text-lg text-gray-600 dark:text-gray-400">
            Welcome {user?.firstName}! Choose a game to start ordering
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {games.length} games available
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Games Grid - Updated for smaller tiles */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={handleGameSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No games found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated Game Card Component - Smaller and simpler
interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  const handleClick = () => {
    console.log('GameCard clicked, game:', game);
    onSelect(game);
  };

  return (
    <div
      onClick={handleClick}
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      {/* Badges */}
      <div className="absolute top-2 left-2 flex gap-1 z-10">
        {game.popular && (
          <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
            Hot
          </span>
        )}
        {game.new && (
          <span className="px-1.5 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
            New
          </span>
        )}
      </div>

      {/* Package Count Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">
          {game.packageCount}
        </span>
      </div>

      {/* Game Image/Icon */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br ${game.gradient} flex items-center justify-center`}>
          <div className="text-white text-2xl font-bold opacity-80">
            {game.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Game Info - Simplified */}
      <div className="p-3 relative z-10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-center truncate">
          {game.name}
        </h3>
        
        {/* Package count info */}
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {game.packageCount} packages
          </span>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;