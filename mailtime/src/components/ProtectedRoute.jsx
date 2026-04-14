import { Navigate } from "react-router-dom";

function getActiveRoleName() {
  try {
    return JSON.parse(localStorage.getItem("active_role") || "null")?.name || "";
  } catch (error) {
    return "";
  }
}

export default function ProtectedRoute({ allowedRole, children }) {
  const token =
    localStorage.getItem("session_token") || localStorage.getItem("auth_token");
  const activeRoleName = getActiveRoleName();

  if (!token || activeRoleName !== allowedRole) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("session_token");
    localStorage.removeItem("user");
    localStorage.removeItem("active_role");
    return <Navigate to="/login" replace />;
  }

  return children;
}
