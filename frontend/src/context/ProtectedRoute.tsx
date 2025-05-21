import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // @ts-ignore
  const { user, loading } = useAuth();
  if (loading) return null; // or loading spinner
  return user ? children : <Navigate to="/login" replace />;
}
