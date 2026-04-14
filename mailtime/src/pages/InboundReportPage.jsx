import { useEffect, useMemo, useState } from "react";
import BackButton from "../components/BackButton";
import { BASE_URL } from "../services/api";

const CSV_COLUMNS = [
  "ID",
  "Mail Number",
  "Tracking Number",
  "Recipient Name",
  "Recipient Department",
  "Document Title",
  "Document Type",
  "Collected By",
  "Proxy Phone Number",
  "Collected At",
  "Remarks",
  "Final Status",
  "Status",
  "Sign Token",
  "Sign Token Expires At",
  "Signature Required",
  "Created At",
  "Updated At",
];

const initialFilters = {
  company: "",
  location: "",
  mailNumber: "",
  trackingNumber: "",
  recipientName: "",
  recipientDepartment: "",
  documentTitle: "",
  documentType: "",
  collectedBy: "",
  proxyPhoneNumber: "",
  finalStatus: "",
  status: "",
  collectedDateFrom: "",
  collectedDateTo: "",
  dateFrom: "",
  dateTo: "",
};

function getAuthHeaders() {
  const token =
    localStorage.getItem("session_token") || localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function buildQuery(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "company" && key !== "location" && value !== null && value !== undefined && String(value).trim() !== "") {
      params.append(key, value);
    }
  });

  return params.toString();
}

async function readJsonResponse(res, fallbackMessage) {
  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    const message = text
      ? text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      : fallbackMessage;

    throw new Error(message || fallbackMessage);
  }

  if (!res.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

async function fetchReportJson(path, fallbackMessage) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return readJsonResponse(res, fallbackMessage);
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatBoolean(value) {
  if (value === true || value === 1) return "Yes";
  if (value === false || value === 0) return "No";
  return "";
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) return "";

  const text = String(value);
  const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;

  return `"${safeText.replaceAll('"', '""')}"`;
}

function downloadRowsAsCsv(rows, filename) {
  const header = CSV_COLUMNS.map(escapeCsvValue).join(",");
  const body = rows
    .map((row) => CSV_COLUMNS.map((column) => escapeCsvValue(row[column])).join(","))
    .join("\r\n");
  const csv = [header, body].filter(Boolean).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toExportRow(row) {
  return {
    ID: row.id,
    "Mail Number": row.mail_number,
    "Tracking Number": row.tracking_number,
    "Recipient Name": row.recipient_name,
    "Recipient Department": row.recipient_department,
    "Document Title": row.document_title,
    "Document Type": row.document_type,
    "Collected By": row.collected_by,
    "Proxy Phone Number": row.proxy_phone_number,
    "Collected At": formatDateTime(row.collected_at),
    Remarks: row.remarks,
    "Final Status": row.final_status,
    Status: row.status,
    "Sign Token": row.sign_token,
    "Sign Token Expires At": formatDateTime(row.sign_token_expires_at),
    "Signature Required": formatBoolean(row.signature_required),
    "Created At": formatDateTime(row.created_at),
    "Updated At": formatDateTime(row.updated_at),
  };
}

export default function InboundReportPage() {
  const reportBasePath = "/inbound-report";
  const [rows, setRows] = useState([]);
  const [scope, setScope] = useState({ company: "", location: "" });
  const [filterOptions, setFilterOptions] = useState({
    documentTypes: [],
    finalStatuses: [],
    statuses: [],
  });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchFilterOptions() {
    try {
      const data = await fetchReportJson(
        `${reportBasePath}/filters`,
        "Failed to load inbound report filters"
      );
      const nextScope = data.scope || { company: "", location: "" };

      setFilterOptions({
        documentTypes: data.documentTypes || [],
        finalStatuses: data.finalStatuses || [],
        statuses: data.statuses || [],
      });
      setScope(nextScope);
      setFilters((prev) => ({
        ...prev,
        company: nextScope.company || "",
        location: nextScope.location || "",
      }));
    } catch (err) {
      setError(err.message || "Failed to load inbound report filters");
    }
  }

  async function fetchReport(currentFilters = filters) {
    try {
      setLoading(true);
      setError("");

      const query = buildQuery(currentFilters);
      const data = await fetchReportJson(
        `${reportBasePath}${query ? `?${query}` : ""}`,
        "Failed to load inbound report"
      );
      const nextScope = data.scope || { company: "", location: "" };

      setRows(data.rows || []);
      setScope(nextScope);
      setFilters((prev) => ({
        ...prev,
        company: nextScope.company || prev.company,
        location: nextScope.location || prev.location,
      }));
    } catch (err) {
      setError(err.message || "Failed to load inbound report");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFilterOptions();
    fetchReport();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "company" || name === "location") {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleApplyFilters(event) {
    event.preventDefault();
    fetchReport(filters);
  }

  function handleResetFilters() {
    const reset = {
      ...initialFilters,
      company: scope.company,
      location: scope.location,
    };

    setFilters(reset);
    fetchReport(reset);
  }

  const exportRows = useMemo(() => rows.map(toExportRow), [rows]);

  function handleDownloadFiltered() {
    downloadRowsAsCsv(exportRows, "filtered_inbound_mail_delivery_report.csv");
  }

  async function handleDownloadAll() {
    try {
      const data = await fetchReportJson(reportBasePath, "Failed to download inbound report");
      const allRows = (data.rows || []).map(toExportRow);
      downloadRowsAsCsv(allRows, "all_inbound_mail_delivery_report.csv");
    } catch (err) {
      setError(err.message || "Failed to download inbound report");
    }
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Inbound Mail Report</h2>

      <form
        onSubmit={handleApplyFilters}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <input type="text" name="company" placeholder="Company" value={filters.company} onChange={handleChange} disabled title="Your company is fixed for this report" />
        <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleChange} disabled title="Your location is fixed for this report" />
        <input type="text" name="mailNumber" placeholder="Mail Number" value={filters.mailNumber} onChange={handleChange} />
        <input type="text" name="trackingNumber" placeholder="Tracking Number" value={filters.trackingNumber} onChange={handleChange} />
        <input type="text" name="recipientName" placeholder="Recipient Name" value={filters.recipientName} onChange={handleChange} />
        <input type="text" name="recipientDepartment" placeholder="Recipient Department" value={filters.recipientDepartment} onChange={handleChange} />
        <input type="text" name="documentTitle" placeholder="Document Title" value={filters.documentTitle} onChange={handleChange} />

        <select name="documentType" value={filters.documentType} onChange={handleChange}>
          <option value="">All Document Types</option>
          {filterOptions.documentTypes.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <input type="text" name="collectedBy" placeholder="Collected By" value={filters.collectedBy} onChange={handleChange} />
        <input type="text" name="proxyPhoneNumber" placeholder="Proxy Phone Number" value={filters.proxyPhoneNumber} onChange={handleChange} />

        <select name="finalStatus" value={filters.finalStatus} onChange={handleChange}>
          <option value="">All Final Statuses</option>
          {filterOptions.finalStatuses.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All Statuses</option>
          {filterOptions.statuses.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <input type="date" name="collectedDateFrom" value={filters.collectedDateFrom} onChange={handleChange} title="Collected from" />
        <input type="date" name="collectedDateTo" value={filters.collectedDateTo} onChange={handleChange} title="Collected to" />
        <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleChange} title="Created from" />
        <input type="date" name="dateTo" value={filters.dateTo} onChange={handleChange} title="Created to" />

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Apply Filters"}
          </button>
          <button type="button" onClick={handleResetFilters}>Reset</button>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button type="button" onClick={handleDownloadAll}>Download All CSV</button>
          <button type="button" onClick={handleDownloadFiltered}>Download Filtered CSV</button>
        </div>
      </form>

      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      {loading ? <p>Loading...</p> : null}

      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mail Number</th>
              <th>Tracking Number</th>
              <th>Recipient Name</th>
              <th>Recipient Department</th>
              <th>Document Title</th>
              <th>Document Type</th>
              <th>Collected By</th>
              <th>Proxy Phone Number</th>
              <th>Collected At</th>
              <th>Remarks</th>
              <th>Final Status</th>
              <th>Status</th>
              <th>Sign Token</th>
              <th>Sign Token Expires At</th>
              <th>Signature Required</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="18" style={{ textAlign: "center" }}>No inbound mail delivery records found</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.mail_number}</td>
                  <td>{row.tracking_number}</td>
                  <td>{row.recipient_name}</td>
                  <td>{row.recipient_department}</td>
                  <td>{row.document_title}</td>
                  <td>{row.document_type}</td>
                  <td>{row.collected_by}</td>
                  <td>{row.proxy_phone_number}</td>
                  <td>{formatDateTime(row.collected_at)}</td>
                  <td>{row.remarks}</td>
                  <td>{row.final_status}</td>
                  <td>{row.status}</td>
                  <td>{row.sign_token}</td>
                  <td>{formatDateTime(row.sign_token_expires_at)}</td>
                  <td>{formatBoolean(row.signature_required)}</td>
                  <td>{formatDateTime(row.created_at)}</td>
                  <td>{formatDateTime(row.updated_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/executive" />
        </div>
      </div>
    </div>
  );
}
