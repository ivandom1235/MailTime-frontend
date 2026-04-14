// frontend/src/pages/IncomingMailPage.jsx
import { useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";

export default function IncomingMailPage() {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    itemType: "document",
    status: "Received at Mail Room",
    receivedFromName: "",
    receivedFromAddress: "",
    receivedFromContact: "",
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessData(null);

    try {
      const data = await api.post("/executive/incoming-mails", formData);

      setSuccessData(data.mail);

      setFormData({
        recipientName: "",
        recipientEmail: "",
        recipientPhone: "",
        itemType: "document",
        status: "Received at Mail Room",
        receivedFromName: "",
        receivedFromAddress: "",
        receivedFromContact: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page app-page--top">
      <div className="app-page__background"></div>
      <div className="app-card app-card--wide">
        <div className="app-card__header">
          <p className="app-card__eyebrow">Executive Workspace</p>
          <h1>Inbound EMS</h1>
          <p className="app-card__subtitle">Capture incoming mail details for employees and recipients.</p>
        </div>

        <form onSubmit={handleSubmit} className="app-form app-form--two-column">
        <div className="app-form__group">
          <label htmlFor="recipient-name">Employee Name</label>
          <input
            id="recipient-name"
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="app-form__group">
          <label htmlFor="recipient-email">Employee Email ID</label>
          <input
            id="recipient-email"
            type="email"
            name="recipientEmail"
            value={formData.recipientEmail}
            onChange={handleChange}
          />
        </div>

        <div className="app-form__group">
          <label htmlFor="recipient-phone">Employee Contact Number</label>
          <input
            id="recipient-phone"
            type="text"
            name="recipientPhone"
            value={formData.recipientPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="app-form__group">
          <label htmlFor="item-type">Document / Non Document / Parcel</label>
          <select
            id="item-type"
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
          >
            <option value="document">Document</option>
            <option value="non_document">Non Document</option>
            <option value="parcel">Parcel</option>
          </select>
        </div>

        <div className="app-form__group">
          <label htmlFor="mail-status">Status</label>
          <select
            id="mail-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Received at Mail Room">Received at Mail Room</option>
            <option value="Collected">Collected</option>
            <option value="Not Collected">Not Collected</option>
            <option value="Collected by proxy">Collected by proxy</option>
          </select>
        </div>

        <div className="app-form__group">
          <label htmlFor="received-from-name">Received From</label>
          <input
            id="received-from-name"
            type="text"
            name="receivedFromName"
            value={formData.receivedFromName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="app-form__group app-form__group--full">
          <label htmlFor="received-from-address">Received From Address</label>
          <textarea
            id="received-from-address"
            name="receivedFromAddress"
            value={formData.receivedFromAddress}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="app-form__group">
          <label htmlFor="received-from-contact">Received From Contact Number</label>
          <input
            id="received-from-contact"
            type="text"
            name="receivedFromContact"
            value={formData.receivedFromContact}
            onChange={handleChange}
          />
        </div>

          <div className="app-actions app-form__group--full">
            <button className="app-button app-button--primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
          </div>
        </form>

        {error && <p className="app-message app-message--error">{error}</p>}

        {successData && (
          <div className="app-panel app-panel--success">
          <h3>Mail Sent Successfully</h3>
          <p><strong>Tracking Number:</strong> {successData.trackingNumber}</p>
          <p><strong>Employee Name:</strong> {successData.recipientName}</p>
          <p><strong>Employee Contact Number:</strong> {successData.recipientPhone}</p>
          <p><strong>Type:</strong> {successData.itemType}</p>
          <p><strong>Status:</strong> {successData.status}</p>
        </div>
        )}

        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/executive" />
        </div>
      </div>
    </div>
  );
}
