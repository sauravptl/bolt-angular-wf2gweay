import { useAuth } from '../contexts/AuthContext';

export default function Avatar() {
  const { user } = useAuth();
  
  if (user?.user_metadata?.avatar_url) {
    return (
      <img
        src={user.user_metadata.avatar_url}
        alt={user.email || 'User avatar'}
        className="w-9 h-9 rounded-full"
      />
    );
  }

  return (
    <div className="w-9 h-9 rounded-full bg-facebook-light-surface dark:bg-facebook-dark-surface border border-facebook-light-secondary dark:border-facebook-dark-secondary flex items-center justify-center">
      <svg 
        className="w-5 h-5 text-facebook-light-text dark:text-facebook-dark-text" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}