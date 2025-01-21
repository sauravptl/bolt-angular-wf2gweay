import { useChatStore } from '../../stores/chatStore';
import { formatDistanceToNow } from 'date-fns';
import { Dialog } from '@headlessui/react';
import { useState, useCallback } from 'react';

export function ChatList() {
  const { sessions, currentSession, createSession, setCurrentSession, deleteSession } = useChatStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const handleCreateChat = useCallback(() => {
    createSession();
  }, [createSession]);

  const handleSelectChat = useCallback((id: string) => {
    setCurrentSession(id);
  }, [setCurrentSession]);

  const handleDeleteClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChatToDelete(id);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (chatToDelete) {
      deleteSession(chatToDelete);
    }
    setDeleteModalOpen(false);
    setChatToDelete(null);
  }, [chatToDelete, deleteSession]);

  const handleCancelDelete = useCallback(() => {
    setDeleteModalOpen(false);
    setChatToDelete(null);
  }, []);

  return (
    <>
      <div className="space-y-2">
        <button
          onClick={handleCreateChat}
          className="w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-facebook-light-text dark:text-facebook-dark-text hover:bg-facebook-light-primary/10 dark:hover:bg-facebook-dark-primary/10"
        >
          <span className="text-xl">➕</span>
          <span>New Chat</span>
        </button>

        <div className="space-y-1">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => handleSelectChat(session.id)}
              className={`group w-full flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                currentSession?.id === session.id
                  ? 'bg-facebook-light-primary/10 dark:bg-facebook-dark-primary/10 text-facebook-light-primary dark:text-facebook-dark-primary'
                  : 'text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary hover:bg-facebook-light-primary/5 dark:hover:bg-facebook-dark-primary/5'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelectChat(session.id);
                }
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl">💬</span>
                <div className="truncate text-left">
                  <div className="truncate font-medium">{session.title}</div>
                  <div className="text-xs opacity-70">
                    {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => handleDeleteClick(e, session.id)}
                className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                aria-label={`Delete chat ${session.title}`}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog 
        open={deleteModalOpen} 
        onClose={handleCancelDelete}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="surface border border-facebook-light-secondary dark:border-facebook-dark-secondary rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-medium mb-4">
              Delete Chat
            </Dialog.Title>
            <p className="text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary mb-6">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-lg text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary hover:bg-facebook-light-primary/5 dark:hover:bg-facebook-dark-primary/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}