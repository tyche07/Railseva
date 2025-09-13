
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { UserRole, ViewMode, Language, Notification, NotificationType } from './types';
import LoginScreen from './components/LoginScreen';
import MobileView from './components/mobile/MobileView';
import WebView from './components/web/WebView';
import NotificationBanner from './components/NotificationBanner';
import { AppContext, AppContextType } from './context/AppContext';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { syncData } from './services/offlineService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.OPERATOR);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MOBILE);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isOnline = useOnlineStatus();

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      console.log("Application is online. Attempting to sync data...");
      syncData().then(result => {
          console.log(result.message);
          // Force a storage event to notify all components to refresh data
          window.dispatchEvent(new Event('storage'));
      });
    }
  }, [isOnline]);

  const addNotification = useCallback((message: string, type: NotificationType) => {
    const newNotification: Notification = {
        id: `notif-${Date.now()}-${Math.random()}`,
        message,
        type,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Add mock notifications on login for demonstration
  useEffect(() => {
      if (isAuthenticated) {
          addNotification('Critical inspection required for SL-ZN1-KM25-011 due to reported mismatch.', NotificationType.ERROR);
          setTimeout(() => {
              addNotification('Warranty for 312 components expiring in the next 30 days.', NotificationType.WARNING);
          }, 1500); // Stagger the notifications
      } else {
          setNotifications([]); // Clear notifications on logout
      }
  }, [isAuthenticated, addNotification]);

  const login = useCallback((role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === Language.ENGLISH ? Language.HINDI : Language.ENGLISH);
  }, []);

  const contextValue: AppContextType = useMemo(() => ({
    userRole,
    language,
    isOnline,
    toggleLanguage,
    logout,
    notifications,
    addNotification,
    removeNotification,
  }), [userRole, language, isOnline, toggleLanguage, logout, notifications, addNotification, removeNotification]);

  const renderContent = () => {
    if (!isAuthenticated) {
      return <LoginScreen onLogin={login} />;
    }
    return viewMode === ViewMode.MOBILE ? <MobileView /> : <WebView />;
  };

  return (
    <AppContext.Provider value={contextValue}>
      <NotificationBanner />
      <div className="min-h-screen bg-gray-100 font-sans text-brand-gray">
        {isAuthenticated && (
          <div className="bg-white shadow-md p-2 flex justify-end items-center space-x-4">
            <span className="text-sm font-medium">View Mode:</span>
            <button
              onClick={() => setViewMode(ViewMode.MOBILE)}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === ViewMode.MOBILE ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}
            >
              Mobile
            </button>
            <button
              onClick={() => setViewMode(ViewMode.WEB)}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === ViewMode.WEB ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}
            >
              Web
            </button>
          </div>
        )}
        {renderContent()}
      </div>
    </AppContext.Provider>
  );
};

export default App;