import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authstore";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
