import { useEffect } from "react";
import { useCountStore } from "./stores/common.store";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const { count: countFromStore } = useCountStore();

  useEffect(() => {}, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
