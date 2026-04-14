import { useState } from "react";
import BackButton from "../components/BackButton";
import api from "../services/api";

const initialForm = {
  senderName: "",
  senderEmail: "",
  senderContact: "",
  senderDepartment: "",
  senderAddress: "",
  senderPincode: "",
  packageType: "document",
  weightKg: "",
  totalCost: "",
  courierVendor: "",
  destinationType: "local",
  receiverName: "",
  receiverEmail: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverPincode: "",
};

function OutboundMailPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSavedData(null);

    try {
      const res = await api.post("/outbound-mails", form);
      setSavedData(res.outboundMail);
      setForm(initialForm);
    } catch (err) {
      setError(err?.message || "Failed to save outbound mail");
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
          <h1>Outbound Mail</h1>
          <p className="app-card__subtitle">Capture sender, package, and receiver details for outbound dispatch.</p>
        </div>

        <form onSubmit={handleSubmit} className="app-form">
          <h3>Sender Details</h3>

          <input name="senderName" placeholder="Sender Name" value={form.senderName} onChange={handleChange} />
          <input name="senderEmail" placeholder="Email ID" value={form.senderEmail} onChange={handleChange} />
          <input name="senderContact" placeholder="Contact No" value={form.senderContact} onChange={handleChange} />
          <input name="senderDepartment" placeholder="Department" value={form.senderDepartment} onChange={handleChange} />
          <textarea name="senderAddress" placeholder="Address" value={form.senderAddress} onChange={handleChange} />
          <input name="senderPincode" placeholder="Address Pin Code" value={form.senderPincode} onChange={handleChange} />

          <h3>Package Details</h3>

          <select name="packageType" value={form.packageType} onChange={handleChange}>
            <option value="document">Document</option>
            <option value="non_document">NonDocument</option>
            <option value="parcel">Parcel</option>
          </select>

          <input name="weightKg" type="number" step="0.01" placeholder="Weight (kg)" value={form.weightKg} onChange={handleChange} />
          <input name="totalCost" type="number" step="0.01" placeholder="Total Cost" value={form.totalCost} onChange={handleChange} />
          <input name="courierVendor" placeholder="Courier Vendor" value={form.courierVendor} onChange={handleChange} />

          <select name="destinationType" value={form.destinationType} onChange={handleChange}>
            <option value="local">Local</option>
            <option value="intracity">Intracity</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>

          <h3>Receiver Details</h3>

          <input name="receiverName" placeholder="Receiver Name" value={form.receiverName} onChange={handleChange} />
          <input name="receiverEmail" placeholder="Receiver Email" value={form.receiverEmail} onChange={handleChange} />
          <input name="receiverPhone" placeholder="Phone Number" value={form.receiverPhone} onChange={handleChange} />
          <textarea name="receiverAddress" placeholder="Receiver Address" value={form.receiverAddress} onChange={handleChange} />
          <input name="receiverPincode" placeholder="Receiver Address Pin Code" value={form.receiverPincode} onChange={handleChange} />

          <div className="app-actions">
            <button className="app-button app-button--primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {error ? <p className="app-message app-message--error">{error}</p> : null}

        {savedData ? (
          <div className="app-panel">
            <h3>Post Summary</h3>
            <p><strong>Tracking Number:</strong> {savedData.tracking_number}</p>
            <p><strong>Summary:</strong> {savedData.summary}</p>
            <p><strong>Timestamp:</strong> {savedData.created_at}</p>
            <p><strong>Total Cost:</strong> Rs. {savedData.total_cost}</p>
          </div>
        ) : null}

        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/executive" />
        </div>
      </div>
    </div>
  );
}

export default OutboundMailPage;
