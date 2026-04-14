// frontend/src/pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";
import "./styles/login-page.css";

function LoginPage() {
  const navigate = useNavigate();
  const [tenantSlug, setTenantSlug] = useState("wms");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("session_token") || localStorage.getItem("auth_token");
    const activeRole = JSON.parse(localStorage.getItem("active_role") || "null");

    if (!token) return;

    if (activeRole?.name === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    if (activeRole?.name === "executive") {
      navigate("/executive", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/company-login", { tenantSlug });

      localStorage.removeItem("auth_token");
      localStorage.removeItem("session_token");
      localStorage.removeItem("user");
      localStorage.removeItem("active_role");
      localStorage.setItem("tenant", JSON.stringify(res.tenant));

      navigate("/select-role", { replace: true });
    } catch (err) {
      setError(err.message || "Company login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__background"></div>

      <div className="login-card">
        <div className="login-card__header">
          <p className="login-card__eyebrow">Workspace Access</p>
          <h2>Company Login</h2>
          <p className="login-card__subtitle">
            Enter your company slug to continue to role selection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form__group">
            <label htmlFor="tenantSlug">Company Slug</label>
            <input
              id="tenantSlug"
              name="tenantSlug"
              type="text"
              placeholder="Enter company slug"
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              autoComplete="off"
            />
          </div>

          {error ? <p className="login-form__error">{error}</p> : null}

          <button className="login-form__button" type="submit" disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>

          <div className="login-form__footer">
            <BackButton fallbackPath="/login" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
