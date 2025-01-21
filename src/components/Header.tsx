import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { signOutUser, user } = useAuth();

  return (
    <header className="surface border-b border-facebook-light-secondary dark:border-facebook-dark-secondary p-4 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden mr-2 text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary p-2 rounded-lg hover:bg-facebook-light-primary/10 dark:hover:bg-facebook-dark-primary/10 min-h-[44px] min-w-[44px] transition-colors"
          aria-label="Toggle menu">
          ☰
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-facebook-light-primary to-[#F97316] dark:from-facebook-dark-primary dark:to-[#F97316] bg-clip-text text-transparent">
            Gemican AI
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-facebook-light-primary/10 dark:bg-facebook-dark-primary/10 text-facebook-light-primary dark:text-facebook-dark-primary rounded-full transition-colors">
            Beta
          </span>
        </div>
        <button 
          onClick={toggleTheme}
          className="ml-2 text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary hover:text-facebook-light-primary dark:hover:text-facebook-dark-primary p-2 rounded-lg min-h-[44px] min-w-[44px] transition-colors"
          aria-label="Toggle theme">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary transition-colors">
            {user.email}
          </div>
        )}
        <div className="relative group">
          <Avatar />
          <div className="absolute right-0 mt-2 w-48 py-1 bg-facebook-light-surface dark:bg-facebook-dark-surface rounded-lg shadow-lg border border-facebook-light-secondary dark:border-facebook-dark-secondary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <button
              onClick={signOutUser}
              className="w-full px-4 py-2 text-left text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary hover:bg-facebook-light-primary/10 dark:hover:bg-facebook-dark-primary/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}