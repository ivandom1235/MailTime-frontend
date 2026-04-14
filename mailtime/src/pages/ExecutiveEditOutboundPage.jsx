import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import api from "../services/api";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function ExecutiveEditOutboundPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [rows, setRows] = useState([]);
  const [scope, setScope] = useState({ company: "", location: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ courierVendor: "", remarks: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadRows(searchValue = trackingNumber) {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const query = new URLSearchParams();
      if (searchValue.trim()) {
        query.set("trackingNumber", searchValue.trim());
      }

      const data = await api.get(`/outbound-mails/editable${query.toString() ? `?${query.toString()}` : ""}`);
      setRows(data.rows || []);
      setScope(data.scope || { company: "", location: "" });
    } catch (err) {
      setRows([]);
      setError(err.message || "Failed to load outbound mails");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRows("");
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    loadRows(trackingNumber);
  }

  function handleReset() {
    setTrackingNumber("");
    setEditingId(null);
    setEditForm({ courierVendor: "", remarks: "" });
    loadRows("");
  }

  function startEdit(row) {
    setEditingId(row.id);
    setEditForm({
      courierVendor: row.courierVendor || "",
      remarks: row.remarks || "",
    });
    setError("");
    setSuccess("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ courierVendor: "", remarks: "" });
  }

  async function saveEdit(row) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await api.put(
        `/outbound-mails/${encodeURIComponent(row.trackingNumber)}/editable`,
        editForm
      );

      setRows((prev) =>
        prev.map((item) => (item.id === row.id ? data.outboundMail : item))
      );
      setEditingId(null);
      setSuccess("Outbound mail updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update outbound mail");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-page app-page--top">
      <div className="app-page__background"></div>
      <div className="app-card app-card--dashboard">
        <div className="app-card__header">
          <p className="app-card__eyebrow">Executive Workspace</p>
          <h1>Edit Outbound</h1>
          <p className="app-card__subtitle">
            Edit courier vendor and remarks for outbound mail from your company and location.
          </p>
        </div>

        <form className="app-form" onSubmit={handleSearch}>
          <div className="app-form app-form--two-column">
            <div className="app-form__group">
              <label htmlFor="company">Company</label>
              <input id="company" value={scope.company} disabled />
            </div>
            <div className="app-form__group">
              <label htmlFor="location">Location</label>
              <input id="location" value={scope.location} disabled />
            </div>
          </div>

          <div className="app-form__group">
            <label htmlFor="trackingNumber">Tracking Number</label>
            <input
              id="trackingNumber"
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
        {success ? <p className="app-message app-message--success">{success}</p> : null}
        {loading ? <p className="app-message">Loading...</p> : null}

        <div className="app-section app-panel--nested">
          {rows.length === 0 && !loading ? (
            <p className="app-message">No outbound mail records found.</p>
          ) : (
            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Tracking Number</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Package Type</th>
                    <th>Courier Vendor</th>
                    <th>Remarks</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.trackingNumber}</td>
                      <td>{row.senderName}</td>
                      <td>{row.receiverName}</td>
                      <td>{row.packageType}</td>
                      <td>
                        {editingId === row.id ? (
                          <input
                            value={editForm.courierVendor}
                            onChange={(event) =>
                              setEditForm((prev) => ({ ...prev, courierVendor: event.target.value }))
                            }
                          />
                        ) : (
                          row.courierVendor
                        )}
                      </td>
                      <td>
                        {editingId === row.id ? (
                          <textarea
                            value={editForm.remarks}
                            onChange={(event) =>
                              setEditForm((prev) => ({ ...prev, remarks: event.target.value }))
                            }
                          />
                        ) : (
                          row.remarks || "-"
                        )}
                      </td>
                      <td>{formatDateTime(row.createdAt)}</td>
                      <td>
                        {editingId === row.id ? (
                          <div className="app-actions">
                            <button className="app-button app-button--small app-button--primary" type="button" onClick={() => saveEdit(row)} disabled={saving}>
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button className="app-button app-button--small app-button--secondary" type="button" onClick={cancelEdit}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button className="app-button app-button--small app-button--secondary" type="button" onClick={() => startEdit(row)}>
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/executive" />
        </div>
      </div>
    </div>
  );
}
