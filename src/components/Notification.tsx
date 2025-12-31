import React, { useEffect, useState } from "react";

export const Notification = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleNotification = (event: any) => {
      const { message, type } = event.detail;
      const id = Date.now();

      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    };

    window.addEventListener("show-notification", handleNotification);
    return () =>
      window.removeEventListener("show-notification", handleNotification);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`px-6 py-3 rounded-lg shadow-lg animate-fade-in ${
            notif.type === "success"
              ? "bg-green-500 text-white"
              : notif.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <i
              className={`fas ${
                notif.type === "success"
                  ? "fa-check-circle"
                  : notif.type === "error"
                  ? "fa-exclamation-circle"
                  : "fa-info-circle"
              } text-xl`}
            ></i>
            <span className="font-semibold">{notif.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
