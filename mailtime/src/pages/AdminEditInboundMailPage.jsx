import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";

const emptyForm = {
  company: "",
  location: "",
  trackingNumber: "",
  recipientName: "",
  recipientEmail: "",
  recipientPhone: "",
  itemType: "document",
  status: "Received at Mail Room",
  receivedFromName: "",
  receivedFromAddress: "",
  receivedFromContact: "",
};

function getFormFromInboundMail(inboundMail) {
  return {
    company: inboundMail.company || "",
    location: inboundMail.location || "",
    trackingNumber: inboundMail.trackingNumber || "",
    recipientName: inboundMail.recipientName || "",
    recipientEmail: inboundMail.recipientEmail || "",
    recipientPhone: inboundMail.recipientPhone || "",
    itemType: inboundMail.itemType || "document",
    status: inboundMail.status || "Received at Mail Room",
    receivedFromName: inboundMail.receivedFromName || "",
    receivedFromAddress: inboundMail.receivedFromAddress || "",
    receivedFromContact: inboundMail.receivedFromContact || "",
  };
}

export default function AdminEditInboundMailPage() {
  const navigate = useNavigate();
  const { trackingNumber } = useParams();
  const decodedTrackingNumber = decodeURIComponent(trackingNumber || "");
  const [form, setForm] = useState(emptyForm);
  const [inboundMail, setInboundMail] = useState(null);
  const [currentTrackingNumber, setCurrentTrackingNumber] = useState(decodedTrackingNumber);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadInboundMail() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/admin/inbound-mails/${encodeURIComponent(decodedTrackingNumber)}`);
        setInboundMail(res.inboundMail);
        setCurrentTrackingNumber(res.inboundMail?.trackingNumber || decodedTrackingNumber);
        setForm(getFormFromInboundMail(res.inboundMail));
      } catch (err) {
        setError(err.message || "Failed to load inbound mail");
      } finally {
        setLoading(false);
      }
    }

    loadInboundMail();
  }, [decodedTrackingNumber]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await api.put(
        `/admin/inbound-mails/${encodeURIComponent(currentTrackingNumber)}`,
        form
      );
      setInboundMail(res.inboundMail);
      setCurrentTrackingNumber(res.inboundMail?.trackingNumber || form.trackingNumber);
      setForm(getFormFromInboundMail(res.inboundMail));
      setSuccess("Inbound mail updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to save inbound mail");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-page app-page--top">
      <div className="app-page__background"></div>
      <div className="app-card app-card--wide">
        <div className="app-card__header">
          <p className="app-card__eyebrow">Admin Workspace</p>
          <h1>Edit Inbound Mail</h1>
          <p className="app-card__subtitle">Tracking Number: {currentTrackingNumber}</p>
        </div>

        {loading ? <p className="app-message">Loading...</p> : null}
        {error ? <p className="app-message app-message--error">{error}</p> : null}
        {success ? <p className="app-message app-message--success">{success}</p> : null}

        {!loading && inboundMail ? (
          <form className="app-form app-form--two-column" onSubmit={handleSubmit}>
            <div className="app-form__group">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" value={form.company} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" value={form.location} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="trackingNumber">Tracking Number</label>
              <input id="trackingNumber" name="trackingNumber" value={form.trackingNumber} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="recipientName">Employee Name</label>
              <input id="recipientName" name="recipientName" value={form.recipientName} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="recipientEmail">Employee Email</label>
              <input id="recipientEmail" name="recipientEmail" value={form.recipientEmail} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="recipientPhone">Employee Phone</label>
              <input id="recipientPhone" name="recipientPhone" value={form.recipientPhone} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="itemType">Item Type</label>
              <select id="itemType" name="itemType" value={form.itemType} onChange={handleChange}>
                <option value="document">Document</option>
                <option value="non_document">Non Document</option>
                <option value="parcel">Parcel</option>
              </select>
            </div>

            <div className="app-form__group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="Received at Mail Room">Received at Mail Room</option>
                <option value="Collected">Collected</option>
                <option value="Not Collected">Not Collected</option>
                <option value="Collected by proxy">Collected by proxy</option>
              </select>
            </div>

            <div className="app-form__group">
              <label htmlFor="receivedFromName">Received From</label>
              <input id="receivedFromName" name="receivedFromName" value={form.receivedFromName} onChange={handleChange} />
            </div>

            <div className="app-form__group app-form__group--full">
              <label htmlFor="receivedFromAddress">Received From Address</label>
              <textarea id="receivedFromAddress" name="receivedFromAddress" value={form.receivedFromAddress} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="receivedFromContact">Received From Contact</label>
              <input id="receivedFromContact" name="receivedFromContact" value={form.receivedFromContact} onChange={handleChange} />
            </div>

            <div className="app-actions app-form__group--full">
              <button className="app-button app-button--primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="app-button app-button--secondary"
                type="button"
                onClick={() => navigate("/admin/inbound-report")}
              >
                Back to Report
              </button>
            </div>
          </form>
        ) : null}

        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/admin/inbound-report" />
        </div>
      </div>
    </div>
  );
}
