// frontend/src/pages/AdminDashboardPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function loadExecutives() {
      try {
        const res = await api.get("/admin/executives");
        setExecutives(res.executives || []);
      } catch (error) {
        setExecutives([]);
      } finally {
        setLoading(false);
      }
    }

    loadExecutives();
  }, []);

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("session_token");
    localStorage.removeItem("user");
    localStorage.removeItem("active_role");
    localStorage.removeItem("tenant");
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-page app-page--top">
      <div className="app-page__background"></div>
      <div className="app-card app-card--dashboard">
        <div className="app-toolbar">
          <div className="app-toolbar__content">
            <p className="app-card__eyebrow">WMS Admin Workspace</p>
            <h2>WMS Admin Dashboard</h2>
            <p className="app-card__subtitle">Welcome, {user?.name}</p>
          </div>

          <div className="app-actions">
            <button className="app-button app-button--secondary" onClick={() => navigate("/admin/outbound-mails")}>
              View Outbound Mail
            </button>
            <button className="app-button app-button--secondary" onClick={() => navigate("/admin/inbound-report")}>
              View Inbound Report
            </button>
            <button className="app-button app-button--secondary" onClick={() => navigate("/admin/outbound-report")}>
              View Outbound Reports
            </button>
            <button className="app-button app-button--secondary" onClick={() => navigate("/admin/password")}>
              Edit Password
            </button>
            <button className="app-button app-button--primary" onClick={() => navigate("/admin/executives/new")}>
              Add Executive
            </button>
            <button className="app-button app-button--danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="app-section">
          <h3>Executives</h3>
          {actionError ? <p className="app-message app-message--error">{actionError}</p> : null}

          {loading ? (
            <p className="app-message">Loading...</p>
          ) : executives.length === 0 ? (
            <p className="app-message">No executives found.</p>
          ) : (
            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Company</th>
                  </tr>
                </thead>
                <tbody>
                  {executives.map((executive) => (
                    <tr key={executive.id}>
                      <td>{executive.name}</td>
                      <td>{executive.email}</td>
                      <td>{executive.phoneNumber}</td>
                      <td>{executive.location}</td>
                      <td>{executive.company}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
