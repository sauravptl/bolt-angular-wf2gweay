import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import ChatPage from '../../pages/ChatPage';
import TranslatePage from '../../pages/TranslatePage';
import { useState } from 'react';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      <Header onMenuClick={toggleSidebar} />
      <div className="flex-1 flex min-h-0">
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div 
          className={`fixed md:static inset-y-0 left-0 w-[280px] transform transition-transform duration-300 ease-in-out z-30 md:transform-none ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/translate" element={<TranslatePage />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}