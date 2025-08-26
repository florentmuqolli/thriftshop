import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showError = (message, title = "Error") => {
    addNotification({
      type: 'error',
      title,
      message,
    });
  };

  const showSuccess = (message, title = "Success") => {
    addNotification({
      type: 'success',
      title,
      message,
    });
  };

  const showWarning = (message, title = "Warning") => {
    addNotification({
      type: 'warning',
      title,
      message,
    });
  };

  const showInfo = (message, title = "Information") => {
    addNotification({
      type: 'info',
      title,
      message,
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      showError,
      showSuccess,
      showWarning,
      showInfo
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);