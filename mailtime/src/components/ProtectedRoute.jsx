import { getSessionToken } from '../services/session';
import { Navigate } from "react-router-dom";

function getActiveRoleName() {
  try {
    return JSON.parse(sessionStorage.getItem("active_role") || "null")?.name || "";
  } catch {
    return "";
  }
}

export default function ProtectedRoute({ allowedRole, children }) {
  const token = getSessionToken();
  const activeRoleName = getActiveRoleName();

  if (!token || activeRoleName !== allowedRole) {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("session_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("active_role");
    return <Navigate to="/login" replace />;
  }

  return children;
}
