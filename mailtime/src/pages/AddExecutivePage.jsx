// frontend/src/pages/AddExecutivePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";

function AddExecutivePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
    company: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/admin/executives", form);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Failed to create executive");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page app-page--top">
      <div className="app-page__background"></div>
      <div className="app-card app-card--wide">
        <div className="app-card__header">
          <p className="app-card__eyebrow">Admin Tools</p>
          <h2>Add Executive</h2>
          <p className="app-card__subtitle">Create a new executive account and profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="app-form app-form--two-column">
          <div className="app-form__group">
            <label htmlFor="executive-name">Full Name</label>
            <input id="executive-name" name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
          </div>
          <div className="app-form__group">
            <label htmlFor="executive-email-create">Email</label>
            <input id="executive-email-create" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          </div>
          <div className="app-form__group">
            <label htmlFor="executive-password-create">Password</label>
            <input id="executive-password-create" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          </div>
          <div className="app-form__group">
            <label htmlFor="executive-phone">Phone Number</label>
            <input id="executive-phone" name="phoneNumber" placeholder="Phone number" value={form.phoneNumber} onChange={handleChange} />
          </div>
          <div className="app-form__group">
            <label htmlFor="executive-location">Location</label>
            <input id="executive-location" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          </div>
          <div className="app-form__group">
            <label htmlFor="executive-company">Company</label>
            <input id="executive-company" name="company" placeholder="Company" value={form.company} onChange={handleChange} />
          </div>
          <div className="app-form__group app-form__group--full">
            <label htmlFor="executive-address">Address</label>
            <input id="executive-address" name="address" placeholder="Address (optional)" value={form.address} onChange={handleChange} />
          </div>

          {error ? <p className="app-message app-message--error app-form__group--full">{error}</p> : null}

          <div className="app-actions app-form__group--full">
            <button className="app-button app-button--secondary" type="button" onClick={() => navigate("/admin")}>
            Cancel
          </button>
            <button className="app-button app-button--primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create Executive"}
          </button>
          </div>

          <div className="app-actions app-actions--center app-form__group--full">
            <BackButton fallbackPath="/admin" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExecutivePage;
