import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";

const CSV_COLUMNS = [
  "ID",
  "Company",
  "Location",
  "Created By",
  "Tracking Number",
  "Employee Name",
  "Employee Email",
  "Employee Phone",
  "Item Type",
  "Status",
  "Received From",
  "Received From Address",
  "Received From Contact",
  "Created At",
];

const initialFilters = {
  company: "",
  location: "",
  trackingNumber: "",
  recipientName: "",
  recipientEmail: "",
  recipientPhone: "",
  itemType: "",
  status: "",
  receivedFromName: "",
  dateFrom: "",
  dateTo: "",
};

function buildQuery(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      params.append(key, value);
    }
  });

  return params.toString();
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
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
    Company: row.company,
    Location: row.location,
    "Created By": row.createdByName || row.createdByUserId,
    "Tracking Number": row.trackingNumber,
    "Employee Name": row.recipientName,
    "Employee Email": row.recipientEmail,
    "Employee Phone": row.recipientPhone,
    "Item Type": row.itemType,
    Status: row.status,
    "Received From": row.receivedFromName,
    "Received From Address": row.receivedFromAddress,
    "Received From Contact": row.receivedFromContact,
    "Created At": formatDateTime(row.createdAt),
  };
}

export default function AdminInboundReportPage() {
  const [rows, setRows] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    companies: [],
    locations: [],
    itemTypes: [],
    statuses: [],
  });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchFilterOptions() {
    try {
      const data = await api.get("/admin/inbound-report/filters");
      setFilterOptions({
        companies: data.companies || [],
        locations: data.locations || [],
        itemTypes: data.itemTypes || [],
        statuses: data.statuses || [],
      });
    } catch (err) {
      setError(err.message || "Failed to load inbound report filters");
    }
  }

  async function fetchReport(currentFilters = filters) {
    try {
      setLoading(true);
      setError("");

      const query = buildQuery(currentFilters);
      const data = await api.get(`/admin/inbound-report${query ? `?${query}` : ""}`);
      setRows(data.rows || []);
    } catch (err) {
      setRows([]);
      setError(err.message || "Failed to load inbound report");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFilterOptions();
    fetchReport(initialFilters);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleApplyFilters(event) {
    event.preventDefault();
    fetchReport(filters);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
    fetchReport(initialFilters);
  }

  const exportRows = useMemo(() => rows.map(toExportRow), [rows]);

  function handleDownloadFiltered() {
    downloadRowsAsCsv(exportRows, "filtered_admin_inbound_mail_report.csv");
  }

  async function handleDownloadAll() {
    try {
      const data = await api.get("/admin/inbound-report");
      const allRows = (data.rows || []).map(toExportRow);
      downloadRowsAsCsv(allRows, "all_admin_inbound_mail_report.csv");
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
        <input
          type="text"
          name="company"
          placeholder="All Companies"
          value={filters.company}
          onChange={handleChange}
          list="admin-inbound-companies"
        />
        <datalist id="admin-inbound-companies">
          {filterOptions.companies.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>

        <input
          type="text"
          name="location"
          placeholder="All Locations"
          value={filters.location}
          onChange={handleChange}
          list="admin-inbound-locations"
        />
        <datalist id="admin-inbound-locations">
          {filterOptions.locations.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>

        <input type="text" name="trackingNumber" placeholder="Tracking Number" value={filters.trackingNumber} onChange={handleChange} />
        <input type="text" name="recipientName" placeholder="Employee Name" value={filters.recipientName} onChange={handleChange} />
        <input type="text" name="recipientEmail" placeholder="Employee Email" value={filters.recipientEmail} onChange={handleChange} />
        <input type="text" name="recipientPhone" placeholder="Employee Phone" value={filters.recipientPhone} onChange={handleChange} />

        <select name="itemType" value={filters.itemType} onChange={handleChange}>
          <option value="">All Item Types</option>
          {filterOptions.itemTypes.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All Statuses</option>
          {filterOptions.statuses.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <input type="text" name="receivedFromName" placeholder="Received From" value={filters.receivedFromName} onChange={handleChange} />
        <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleChange} />
        <input type="date" name="dateTo" value={filters.dateTo} onChange={handleChange} />

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button type="submit" disabled={loading}>{loading ? "Loading..." : "Apply Filters"}</button>
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
              <th>Company</th>
              <th>Location</th>
              <th>Created By</th>
              <th>Tracking Number</th>
              <th>Employee Name</th>
              <th>Employee Email</th>
              <th>Employee Phone</th>
              <th>Item Type</th>
              <th>Status</th>
              <th>Received From</th>
              <th>Received From Address</th>
              <th>Received From Contact</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="14" style={{ textAlign: "center" }}>No inbound mail records found</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.company}</td>
                  <td>{row.location}</td>
                  <td>{row.createdByName || row.createdByUserId}</td>
                  <td>
                    <Link className="app-link" to={`/admin/inbound-mails/${encodeURIComponent(row.trackingNumber)}`}>
                      {row.trackingNumber}
                    </Link>
                  </td>
                  <td>{row.recipientName}</td>
                  <td>{row.recipientEmail}</td>
                  <td>{row.recipientPhone}</td>
                  <td>{row.itemType}</td>
                  <td>{row.status}</td>
                  <td>{row.receivedFromName}</td>
                  <td>{row.receivedFromAddress}</td>
                  <td>{row.receivedFromContact}</td>
                  <td>{formatDateTime(row.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="app-actions app-actions--center">
          <BackButton fallbackPath="/admin" />
        </div>
      </div>
    </div>
  );
}
