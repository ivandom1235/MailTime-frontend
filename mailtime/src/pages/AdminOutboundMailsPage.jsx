import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function AdminOutboundMailsPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOutboundMails(searchValue = trackingNumber) {
    try {
      setLoading(true);
      setError("");

      const query = new URLSearchParams();
      if (searchValue.trim()) {
        query.set("trackingNumber", searchValue.trim());
      }

      const path = query.toString()
        ? `/admin/outbound-mails?${query.toString()}`
        : "/admin/outbound-mails";
      const res = await api.get(path);
      setRows(res.outboundMails || []);
    } catch (err) {
      setRows([]);
      setError(err.message || "Failed to load outbound mails");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOutboundMails("");
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    loadOutboundMails(trackingNumber);
  }

  function handleReset() {
    setTrackingNumber("");
    loadOutboundMails("");
  }

  return (
    <div className="app-page app-page--top">
      <div className="app-page__background"></div>
      <div className="app-card app-card--dashboard">
        <div className="app-card__header">
          <p className="app-card__eyebrow">Admin Workspace</p>
          <h1>Outbound Mail Details</h1>
          <p className="app-card__subtitle">
            Search by tracking number, then open the tracking number to edit the outbound mail record.
          </p>
        </div>

        <form className="app-form" onSubmit={handleSearch}>
          <div className="app-form__group">
            <label htmlFor="tracking-number-search">Tracking Number</label>
            <input
              id="tracking-number-search"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="OUT00000001"
            />
          </div>

          <div className="app-actions">
            <button className="app-button app-button--primary" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
            <button className="app-button app-button--secondary" type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {error ? <p className="app-message app-message--error">{error}</p> : null}

        <div className="app-section app-panel--nested">
          {loading ? (
            <p className="app-message">Loading...</p>
          ) : rows.length === 0 ? (
            <p className="app-message">No outbound mail records found.</p>
          ) : (
            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Tracking Number</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Courier</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Created By</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.trackingNumber}>
                      <td>
                        <Link className="app-link" to={`/admin/outbound-mails/${encodeURIComponent(row.trackingNumber)}`}>
                          {row.trackingNumber}
                        </Link>
                      </td>
                      <td>{row.senderName}</td>
                      <td>{row.receiverName}</td>
                      <td>{row.courierVendor}</td>
                      <td>{row.company}</td>
                      <td>{row.location}</td>
                      <td>{row.createdByName || "-"}</td>
                      <td>{formatDateTime(row.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/admin" />
        </div>
      </div>
    </div>
  );
}
