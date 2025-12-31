import { useEffect } from "react";
import { useCountStore } from "./stores/common.store";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { Notification } from "./components/Notification";
function App() {
  const { count: countFromStore } = useCountStore();

  useEffect(() => {
    console.log("Count from store:", countFromStore);
  }, [countFromStore]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Notification />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
