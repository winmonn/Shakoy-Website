import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationsContext = createContext();

// Custom hook to use the notifications context
export const useNotifications = () => {
  return useContext(NotificationsContext);
};

// Notifications provider
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (message) => {
    setNotifications((prev) => [
      { id: Date.now(), message, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};
