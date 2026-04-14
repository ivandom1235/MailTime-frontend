// frontend/src/pages/ExecutiveLoginPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";

function ExecutiveLoginPage() {
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

    if (token && activeRole?.name === "executive") {
      navigate("/executive", { replace: true });
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
      const res = await api.post("/auth/executive/login", {
        ...form,
        tenantSlug: tenant?.slug,
      });

      localStorage.setItem("session_token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("active_role", JSON.stringify(res.activeRole));

      navigate("/executive", { replace: true });
    } catch (err) {
      setError(err.message || "Executive login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page">
      <div className="app-page__background"></div>
      <div className="app-card app-card--narrow">
        <div className="app-card__header">
          <p className="app-card__eyebrow">WMS Executive Access</p>
          <h2>WMS Executive Login</h2>
          <p className="app-card__subtitle">{tenant?.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="app-form">
          <div className="app-form__group">
            <label htmlFor="executive-email">Email</label>
            <input
              id="executive-email"
              name="email"
              type="email"
              placeholder="Executive email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="app-form__group">
            <label htmlFor="executive-password">Password</label>
            <input
              id="executive-password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
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

export default ExecutiveLoginPage;
