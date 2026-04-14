import { useNavigate } from "react-router-dom";

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

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
            <p className="app-card__eyebrow">Executive Workspace</p>
            <h2>Executive Dashboard</h2>
            <p className="app-card__subtitle">
              Welcome{user?.name ? `, ${user.name}` : ""}. Choose whether you want to
              register inbound mail or create a new outbound dispatch.
            </p>
          </div>

          <button className="app-button app-button--danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="app-grid app-grid--cards">
          <button
            type="button"
            className="app-action-card"
            onClick={() => navigate("/executive/incoming-mail")}
          >
            <h3>Inbound Mail Capture</h3>
            <p>Register incoming documents, parcels, sender details, and recipient information.</p>
          </button>

          <button
            type="button"
            className="app-action-card"
            onClick={() => navigate("/outgoing-mail")}
          >
            <h3>Inbound Mail Employee Delivery</h3>
            <p>Create delivery drafts, review signature status, and complete employee handover.</p>
          </button>

          <button
            type="button"
            className="app-action-card"
            onClick={() => navigate("/executive/outbound-mail")}
          >
            <h3>Outbound Mail Dispatch</h3>
            <p>Create outbound courier records with sender, package, and receiver details.</p>
          </button>
          <button
            type="button"
            className="app-action-card"
            onClick={() => navigate("/executive/outbound-report")}
          >
            <h3>Outbound Report</h3>
            <p>Review outbound records raised from your assigned company and location.</p>
          </button>
        </div>

      </div>
    </div>
  );
}
