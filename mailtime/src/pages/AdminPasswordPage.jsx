import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AdminPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    try {
      setLoading(true);
      await api.put("/admin/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm(initialForm);
      setSuccess("Password updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page">
      <div className="app-page__background"></div>
      <div className="app-card app-card--narrow">
        <div className="app-card__header">
          <p className="app-card__eyebrow">Admin Tools</p>
          <h2>Edit Password</h2>
          <p className="app-card__subtitle">Update the password for your admin account.</p>
        </div>

        <form className="app-form" onSubmit={handleSubmit}>
          <div className="app-form__group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="app-form__group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              minLength="8"
              required
            />
          </div>

          <div className="app-form__group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength="8"
              required
            />
          </div>

          {error ? <p className="app-message app-message--error">{error}</p> : null}
          {success ? <p className="app-message app-message--success">{success}</p> : null}

          <div className="app-actions">
            <button className="app-button app-button--primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Password"}
            </button>
            <button className="app-button app-button--secondary" type="button" onClick={() => navigate("/admin")}>
              Cancel
            </button>
          </div>

          <div className="app-actions app-actions--center">
            <BackButton fallbackPath="/admin" />
          </div>
        </form>
      </div>
    </div>
  );
}
