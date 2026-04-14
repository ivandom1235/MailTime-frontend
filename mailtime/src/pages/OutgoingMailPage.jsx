// frontend/mailtime/src/pages/OutgoingMailPage.jsx
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import api, { API_BASE_URL } from "../services/api";
import BackButton from "../components/BackButton";

function formatStatusLabel(status) {
  const labels = {
    pending_signature: "Pending Signature",
    received: "Received at Mail Room",
    "Received at Mail Room": "Received at Mail Room",
    collected: "Collected",
    not_collected: "Not Collected",
    collected_by_proxy: "Collected by proxy",
  };

  return labels[status] || status;
}

function formatItemTypeLabel(itemType) {
  const labels = {
    document: "Document",
    non_document: "Non Document",
    parcel: "Parcel",
  };

  return labels[itemType] || itemType;
}

function OutgoingMailPage() {
  const [form, setForm] = useState({
    trackingNumber: "",
    collectedBy: "",
    proxyPhoneNumber: "",
    remarks: "",
    finalStatus: "Received at Mail Room",
  });

  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [sourceMail, setSourceMail] = useState(null);

  function handleChange(e) {
    const nextForm = { ...form, [e.target.name]: e.target.value };
    setForm(nextForm);

    if (e.target.name === "trackingNumber") {
      setSourceMail(null);
      setError("");
    }

    if (e.target.name === "finalStatus" && e.target.value !== "collected_by_proxy") {
      setForm((prev) => ({
        ...prev,
        finalStatus: e.target.value,
        proxyPhoneNumber: "",
      }));
      return;
    }
  }

  useEffect(() => {
    const trackingNumber = form.trackingNumber.trim();

    if (!trackingNumber) {
      setSourceMail(null);
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLookupLoading(true);
        const res = await api.get(
          `/outgoing-mails/incoming/${encodeURIComponent(trackingNumber)}`
        );
        setError("");
        setSourceMail(res.mail);
      } catch (err) {
        setSourceMail(null);
        setError(err.message || "Failed to load inbound mail details");
      } finally {
        setLookupLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [form.trackingNumber]);

  async function handleCreateDraft(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
      };

      const res = await api.post("/outgoing-mails", payload);

      setDraft({
        id: res.draftId,
        mailNumber: res.mailNumber,
        trackingNumber: res.trackingNumber,
        signUrl: res.signUrl,
        status: res.status,
        finalStatus: res.finalStatus,
        proxyPhoneNumber: res.proxyPhoneNumber,
        sourceMail: res.sourceMail,
        signerName: null,
        signaturePath: null,
        signedAt: null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDraftStatus(id) {
    try {
      setStatusLoading(true);
      const res = await api.get(`/outgoing-mails/${id}`);
      setDraft((prev) => ({
        ...prev,
        status: res.status,
        trackingNumber: res.trackingNumber,
        finalStatus: res.finalStatus,
        proxyPhoneNumber: res.proxyPhoneNumber,
        sourceMail: prev.sourceMail,
        signerName: res.signerName,
        signaturePath: res.signaturePath,
        signedAt: res.signedAt,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  }

  useEffect(() => {
    if (!draft?.id) return;
    if (draft.status !== "pending_signature") return;

    const interval = setInterval(() => {
      fetchDraftStatus(draft.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [draft?.id, draft?.status]);

  return (
    <div className="app-page app-page--top">
      <div className="app-page__background"></div>
      <div className="app-card app-card--wide">
        <div className="app-card__header">
          <p className="app-card__eyebrow">Executive Workspace</p>
          <h1>Employee Mail Delivery</h1>
          <p className="app-card__subtitle">Create an outbound draft from an inbound tracking number and monitor signature status.</p>
        </div>

      {!draft && (
          <form onSubmit={handleCreateDraft} className="app-form">
            <div className="app-form__group">
              <label htmlFor="tracking-number">Tracking Number</label>
              <input
                id="tracking-number"
                name="trackingNumber"
                placeholder="Tracking Number"
                value={form.trackingNumber}
                onChange={handleChange}
                required
              />
            </div>

          {lookupLoading && <p>Loading inbound mail details...</p>}

          {sourceMail && (
            <div className="app-panel">
              <p><strong>Employee Name:</strong> {sourceMail.recipientName}</p>
              <p><strong>Employee Email ID:</strong> {sourceMail.recipientEmail || "-"}</p>
              <p><strong>Employee Contact Number:</strong> {sourceMail.recipientPhone}</p>
              <p><strong>Item Type:</strong> {formatItemTypeLabel(sourceMail.itemType)}</p>
              <p><strong>Inbound Status:</strong> {sourceMail.status}</p>
            </div>
          )}

            <div className="app-form__group">
              <label htmlFor="final-status">Final Status</label>
              <select
                id="final-status"
                name="finalStatus"
                value={form.finalStatus}
                onChange={handleChange}
                required
              >
                <option value="Received at Mail Room">Received at Mail Room</option>
                <option value="collected">Collected</option>
                <option value="not_collected">Not Collected</option>
                <option value="collected_by_proxy">Collected by proxy</option>
              </select>
            </div>

          {form.finalStatus === "collected_by_proxy" && (
              <div className="app-form__group">
                <label htmlFor="proxy-phone">Proxy Phone Number</label>
                <input
                  id="proxy-phone"
                  name="proxyPhoneNumber"
                  placeholder="Proxy Phone Number"
                  value={form.proxyPhoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
          )}

            <div className="app-form__group">
              <label htmlFor="collected-by">Collected By</label>
              <input
                id="collected-by"
                name="collectedBy"
                placeholder="Collected By"
                value={form.collectedBy}
                onChange={handleChange}
                required
              />
            </div>

            <div className="app-form__group">
              <label htmlFor="outgoing-remarks">Remarks</label>
              <textarea
                id="outgoing-remarks"
                name="remarks"
                placeholder="Remarks"
                value={form.remarks}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {error && <p className="app-message app-message--error">{error}</p>}

            <div className="app-actions">
              <button
                className="app-button app-button--primary"
                type="submit"
                disabled={
                  loading ||
                  lookupLoading ||
                  !sourceMail ||
                  (form.finalStatus === "collected_by_proxy" &&
                    !form.proxyPhoneNumber.trim())
                }
              >
                {loading ? "Creating..." : "Create Draft"}
              </button>
            </div>
          </form>
        )}

      {draft && (
          <div className="app-panel">
          <h2>Draft Created</h2>
          <p><strong>Mail Number:</strong> {draft.mailNumber}</p>
          <p><strong>Tracking Number:</strong> {draft.trackingNumber}</p>
          {draft.sourceMail && (
            <>
              <p><strong>Employee Name:</strong> {draft.sourceMail.recipientName}</p>
              <p><strong>Employee Email ID:</strong> {draft.sourceMail.recipientEmail || "-"}</p>
              <p><strong>Employee Contact Number:</strong> {draft.sourceMail.recipientPhone}</p>
            </>
          )}
          <p><strong>Final Status:</strong> {formatStatusLabel(draft.finalStatus)}</p>
          {draft.proxyPhoneNumber && (
            <p><strong>Proxy Phone Number:</strong> {draft.proxyPhoneNumber}</p>
          )}
          <p><strong>Status:</strong> {formatStatusLabel(draft.status)}</p>

          {draft.status === "pending_signature" && (
            <>
              <p>Scan this QR code on the tablet to sign:</p>
              <div className="app-qr">
                <QRCodeCanvas value={draft.signUrl} size={220} />
              </div>

              <p className="app-break">
                <strong>Sign URL:</strong> {draft.signUrl}
              </p>

              <button
                className="app-button app-button--secondary"
                type="button"
                onClick={() => fetchDraftStatus(draft.id)}
                disabled={statusLoading}
              >
                {statusLoading ? "Refreshing..." : "Refresh Status"}
              </button>
            </>
          )}

          {draft.signaturePath && (
            <div className="app-panel app-panel--nested">
              <h3>Signature Preview</h3>
              <img
                className="app-signature-image"
                src={`${API_BASE_URL}${draft.signaturePath}`}
                alt="Signature"
              />
              <p><strong>Signed By:</strong> {draft.signerName}</p>
              <p><strong>Signed At:</strong> {draft.signedAt}</p>
            </div>
          )}

          {draft.status !== "pending_signature" && (
            <p className="app-message app-message--success">Mail sent successfully.</p>
          )}
        </div>
      )}
        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/executive" />
        </div>
      </div>
    </div>
  );
}

export default OutgoingMailPage;
