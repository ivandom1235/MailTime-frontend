import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";

const emptyForm = {
  company: "",
  location: "",
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

function getFormFromOutboundMail(outboundMail) {
  return {
    company: outboundMail.company || "",
    location: outboundMail.location || "",
    senderName: outboundMail.senderName || "",
    senderEmail: outboundMail.senderEmail || "",
    senderContact: outboundMail.senderContact || "",
    senderDepartment: outboundMail.senderDepartment || "",
    senderAddress: outboundMail.senderAddress || "",
    senderPincode: outboundMail.senderPincode || "",
    packageType: outboundMail.packageType || "document",
    weightKg: outboundMail.weightKg ?? "",
    totalCost: outboundMail.totalCost ?? "",
    courierVendor: outboundMail.courierVendor || "",
    destinationType: outboundMail.destinationType || "local",
    receiverName: outboundMail.receiverName || "",
    receiverEmail: outboundMail.receiverEmail || "",
    receiverPhone: outboundMail.receiverPhone || "",
    receiverAddress: outboundMail.receiverAddress || "",
    receiverPincode: outboundMail.receiverPincode || "",
  };
}

export default function AdminEditOutboundMailPage() {
  const navigate = useNavigate();
  const { trackingNumber } = useParams();
  const decodedTrackingNumber = decodeURIComponent(trackingNumber || "");
  const [form, setForm] = useState(emptyForm);
  const [outboundMail, setOutboundMail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadOutboundMail() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/admin/outbound-mails/${encodeURIComponent(decodedTrackingNumber)}`);
        setOutboundMail(res.outboundMail);
        setForm(getFormFromOutboundMail(res.outboundMail));
      } catch (err) {
        setError(err.message || "Failed to load outbound mail");
      } finally {
        setLoading(false);
      }
    }

    loadOutboundMail();
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
        `/admin/outbound-mails/${encodeURIComponent(decodedTrackingNumber)}`,
        form
      );
      setOutboundMail(res.outboundMail);
      setForm(getFormFromOutboundMail(res.outboundMail));
      setSuccess("Outbound mail updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to save outbound mail");
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
          <h1>Edit Outbound Mail</h1>
          <p className="app-card__subtitle">Tracking Number: {decodedTrackingNumber}</p>
        </div>

        {loading ? <p className="app-message">Loading...</p> : null}
        {error ? <p className="app-message app-message--error">{error}</p> : null}
        {success ? <p className="app-message app-message--success">{success}</p> : null}

        {!loading && outboundMail ? (
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
              <label htmlFor="senderName">Sender Name</label>
              <input id="senderName" name="senderName" value={form.senderName} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="senderEmail">Sender Email</label>
              <input id="senderEmail" name="senderEmail" value={form.senderEmail} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="senderContact">Sender Contact</label>
              <input id="senderContact" name="senderContact" value={form.senderContact} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="senderDepartment">Sender Department</label>
              <input id="senderDepartment" name="senderDepartment" value={form.senderDepartment} onChange={handleChange} />
            </div>

            <div className="app-form__group app-form__group--full">
              <label htmlFor="senderAddress">Sender Address</label>
              <textarea id="senderAddress" name="senderAddress" value={form.senderAddress} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="senderPincode">Sender Pincode</label>
              <input id="senderPincode" name="senderPincode" value={form.senderPincode} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="packageType">Package Type</label>
              <select id="packageType" name="packageType" value={form.packageType} onChange={handleChange}>
                <option value="document">Document</option>
                <option value="non_document">Non Document</option>
                <option value="parcel">Parcel</option>
              </select>
            </div>

            <div className="app-form__group">
              <label htmlFor="weightKg">Weight (kg)</label>
              <input id="weightKg" name="weightKg" type="number" step="0.01" value={form.weightKg} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="totalCost">Total Cost</label>
              <input id="totalCost" name="totalCost" type="number" step="0.01" value={form.totalCost} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="courierVendor">Courier Vendor</label>
              <input id="courierVendor" name="courierVendor" value={form.courierVendor} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="destinationType">Destination Type</label>
              <select id="destinationType" name="destinationType" value={form.destinationType} onChange={handleChange}>
                <option value="local">Local</option>
                <option value="intracity">Intracity</option>
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>

            <div className="app-form__group">
              <label htmlFor="receiverName">Receiver Name</label>
              <input id="receiverName" name="receiverName" value={form.receiverName} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="receiverEmail">Receiver Email</label>
              <input id="receiverEmail" name="receiverEmail" value={form.receiverEmail} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="receiverPhone">Receiver Phone</label>
              <input id="receiverPhone" name="receiverPhone" value={form.receiverPhone} onChange={handleChange} />
            </div>

            <div className="app-form__group app-form__group--full">
              <label htmlFor="receiverAddress">Receiver Address</label>
              <textarea id="receiverAddress" name="receiverAddress" value={form.receiverAddress} onChange={handleChange} />
            </div>

            <div className="app-form__group">
              <label htmlFor="receiverPincode">Receiver Pincode</label>
              <input id="receiverPincode" name="receiverPincode" value={form.receiverPincode} onChange={handleChange} />
            </div>

            <div className="app-actions app-form__group--full">
              <button className="app-button app-button--primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="app-button app-button--secondary"
                type="button"
                onClick={() => navigate("/admin/outbound-mails")}
              >
                Back to Search
              </button>
            </div>
          </form>
        ) : null}

        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/admin/outbound-mails" />
        </div>
      </div>
    </div>
  );
}
