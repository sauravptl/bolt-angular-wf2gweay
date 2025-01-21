import { Link, useLocation } from 'react-router-dom';
import { ChatList } from './chat/ChatList';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const menuItems = [
    { icon: '💬', label: 'Chat', route: '/chat' },
    { icon: '🔄', label: 'Translate', route: '/translate' }
  ];

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="h-full surface border-r border-facebook-light-secondary dark:border-facebook-dark-secondary overflow-y-auto">
      <div className="md:hidden p-4 flex justify-end">
        <button
          onClick={onClose}
          className="p-2 text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary hover:text-facebook-light-primary dark:hover:text-facebook-dark-primary rounded-lg"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.route}
              to={item.route}
              onClick={handleLinkClick}
              className={
                location.pathname === item.route
                  ? "flex items-center p-2 rounded-lg transition-colors min-h-[44px] bg-facebook-light-primary/10 dark:bg-facebook-dark-primary/10 text-facebook-light-primary dark:text-facebook-dark-primary"
                  : "flex items-center p-2 rounded-lg transition-colors min-h-[44px] text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary hover:text-facebook-light-primary dark:hover:text-facebook-dark-primary hover:bg-facebook-light-primary/10 dark:hover:bg-facebook-dark-primary/10"
              }
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {location.pathname === '/chat' && (
          <div className="mt-6 pt-6 border-t border-facebook-light-secondary dark:border-facebook-dark-secondary">
            <ChatList />
          </div>
        )}
      </nav>
    </aside>
  );
}