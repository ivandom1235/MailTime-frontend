import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./styles/role-select.css";

function RoleSelectPage() {
  const navigate = useNavigate();
  const tenant = JSON.parse(localStorage.getItem("tenant") || "null");

  useEffect(() => {
    if (!tenant?.slug) {
      navigate("/login", { replace: true });
    }
  }, [tenant, navigate]);

  function handleRoleSelect(role) {
    if (role === "admin") {
      navigate("/admin/login", { replace: true });
      return;
    }

    if (role === "executive") {
      navigate("/executive/login", { replace: true });
      return;
    }
  }

  return (
    <div className="role-page">
      <div className="role-page__background"></div>

      <div className="role-card">
        <div className="role-card__header">
          <p className="role-card__eyebrow">Workspace Access</p>
          <h2>Select Role</h2>
          <p className="role-card__subtitle">
            {tenant?.name || "Company"}
          </p>
        </div>

        <div className="role-options">
          <button
            className="role-option role-option--primary"
            onClick={() => handleRoleSelect("admin")}
          >
            <div>
              <h3>Admin</h3>
              <p>Manage users, roles, and system configuration</p>
            </div>
            <span>&rarr;</span>
          </button>

          <button
            className="role-option"
            onClick={() => handleRoleSelect("executive")}
          >
            <div>
              <h3>Executive</h3>
              <p>Handle operations, mail tracking, and workflows</p>
            </div>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="role-footer">
          <BackButton fallbackPath="/login" />
        </div>
      </div>
    </div>
  );
}

export default RoleSelectPage;
