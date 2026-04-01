import { Navigate } from "react-router-dom";

// User protected
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

// Admin protected
export function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role === "admin" ? children : <Navigate to="/dashboard" />;
}