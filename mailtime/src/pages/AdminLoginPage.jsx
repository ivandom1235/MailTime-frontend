// frontend/src/pages/AdminLoginPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";

function AdminLoginPage() {
  const navigate = useNavigate();
  const tenant = JSON.parse(localStorage.getItem("tenant") || "null");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("session_token") || localStorage.getItem("auth_token");
    const activeRole = JSON.parse(localStorage.getItem("active_role") || "null");

    if (token && activeRole?.name === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/admin/login", {
        ...form,
        tenantSlug: tenant?.slug,
      });

      localStorage.setItem("session_token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("active_role", JSON.stringify(res.activeRole));

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page">
      <div className="app-page__background"></div>
      <div className="app-card app-card--narrow">
        <div className="app-card__header">
          <p className="app-card__eyebrow">WMS Admin Access</p>
          <h2>WMS Admin Login</h2>
          <p className="app-card__subtitle">{tenant?.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="app-form">
          <div className="app-form__group">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              placeholder="Admin email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="app-form__group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error ? <p className="app-message app-message--error">{error}</p> : null}

          <button className="app-button app-button--primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="app-actions app-actions--center">
            <BackButton fallbackPath="/select-role" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
