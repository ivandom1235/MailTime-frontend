// frontend/mailtime/src/pages/OutgoingMailSignPage.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import api from "../services/api";
import BackButton from "../components/BackButton";

function OutgoingMailSignPage() {
  const { draftId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const sigRef = useRef(null);

  const [draft, setDraft] = useState(null);
  const [signerName, setSignerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDraft() {
      try {
        const res = await api.get(
          `/outgoing-mails/${draftId}/sign-details?token=${token}`
        );
        setDraft(res);
        setSignerName(res.collectedBy || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDraft();
  }, [draftId, token]);

  function clearSignature() {
    sigRef.current?.clear();
  }

  async function handleSubmit() {
    setError("");
    setMessage("");

    if (!signerName.trim()) {
      setError("Signer name is required");
      return;
    }

    if (sigRef.current?.isEmpty()) {
      setError("Please provide a signature");
      return;
    }

    try {
      setSaving(true);

      const signatureDataUrl = sigRef.current.getCanvas().toDataURL("image/png");

      await api.post(`/outgoing-mails/${draftId}/sign`, {
        token,
        signerName,
        signatureDataUrl,
      });

      setMessage("Signature saved successfully. You can close this page.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="app-page app-page--status"><p className="app-message">Loading...</p></div>;
  }

  if (error && !draft) {
    return <div className="app-page app-page--status"><p className="app-message app-message--error">{error}</p></div>;
  }

  return (
    <div className="app-page app-page--top">
      <div className="app-page__background"></div>
      <div className="app-card app-card--wide">
        <div className="app-card__header">
          <p className="app-card__eyebrow">Signature Capture</p>
        <h1>Outbound Mail Signature</h1>
          <p className="app-card__subtitle">Review the dispatch details and add a signature to complete the workflow.</p>
        </div>

        <div className="app-panel">
        <p><strong>Mail Number:</strong> {draft.mailNumber}</p>
        <p><strong>Recipient:</strong> {draft.recipientName}</p>
        <p><strong>Department:</strong> {draft.recipientDepartment || "-"}</p>
        <p><strong>Document:</strong> {draft.documentTitle}</p>
        <p><strong>Document Type:</strong> {draft.documentType || "-"}</p>
        <p><strong>Collected By:</strong> {draft.collectedBy}</p>
        <p><strong>Proxy Phone Number:</strong> {draft.proxyPhoneNumber || "-"}</p>
        <p><strong>Collected At:</strong> {draft.collectedAt}</p>
        <p><strong>Remarks:</strong> {draft.remarks || "-"}</p>
        </div>

        <div className="app-form">
          <div className="app-form__group">
            <label htmlFor="signer-name">Signer Name</label>
            <input
              id="signer-name"
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
            />
          </div>

          <div className="app-form__group">
            <label>Signature</label>
            <div className="app-signature-pad">
              <SignatureCanvas
                ref={sigRef}
                penColor="black"
                canvasProps={{
                  width: 800,
                  height: 260,
                  className: "app-signature-pad__canvas",
                }}
              />
            </div>
          </div>
        </div>

        {error && <p className="app-message app-message--error">{error}</p>}

        {message && <p className="app-message app-message--success">{message}</p>}

        <div className="app-actions">
          <button className="app-button app-button--secondary" type="button" onClick={clearSignature}>
            Clear
          </button>
          <button className="app-button app-button--primary" type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Signature"}
          </button>
        </div>

        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/outgoing-mail" />
        </div>
      </div>
    </div>
  );
}

export default OutgoingMailSignPage;
