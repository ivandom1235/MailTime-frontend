import { escapeCsvValue } from "../services/csv";
import { useEffect, useMemo, useState } from "react";
import BackButton from "../components/BackButton";
import { BASE_URL, authFetch, getHeaders as getAuthHeaders } from "../services/api";
const CSV_COLUMNS = [
  "ID",
  "Company",
  "Location",
  "Sender Name",
  "Sender Email",
  "Sender Contact No",
  "Department",
  "Sender Address",
  "Sender Pincode",
  "Package Type",
  "Weight (KG)",
  "Total Cost",
  "Courier Vendor",
  "Destination",
  "Receiver Name",
  "Receiver Email",
  "Receiver Phone No",
  "Receiver Address",
  "Receiver Pincode",
  "Remarks",
  "Created At",
];

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

function toReportExportRow(row) {
  return {
    ID: row.id,
    Company: row.company,
    Location: row.location,
    "Sender Name": row.sender_name,
    "Sender Email": row.sender_email,
    "Sender Contact No": row.sender_contact_no,
    Department: row.department,
    "Sender Address": row.sender_address,
    "Sender Pincode": row.sender_pincode,
    "Package Type": row.package_type,
    "Weight (KG)": row.weight_kg,
    "Total Cost": row.total_cost,
    "Courier Vendor": row.courier_vendor,
    Destination: row.destination,
    "Receiver Name": row.receiver_name,
    "Receiver Email": row.receiver_email,
    "Receiver Phone No": row.receiver_phone_no,
    "Receiver Address": row.receiver_address,
    "Receiver Pincode": row.receiver_pincode,
    Remarks: row.remarks,
    "Created At": formatDateTime(row.created_at),
  };
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

export default function OutboundReportPage({ mode = "executive" }) {
  const isAdmin = mode === "admin";
  const reportBasePath = isAdmin ? "/admin/outbound-report" : "/outbound-report";
  const [rows, setRows] = useState([]);
  const [scope, setScope] = useState({
    company: "",
    location: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    companies: [],
    locations: [],
    departments: [],
    packageTypes: [],
    vendors: [],
    destinations: [],
  });

  const [filters, setFilters] = useState({
    company: "",
    location: "",
    senderName: "",
    department: "",
    packageType: "",
    courierVendor: "",
    destination: "",
    receiverName: "",
    dateFrom: "",
    dateTo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchFilterOptions() {
    try {
      const query = isAdmin ? buildQuery({ company: filters.company, location: filters.location }) : "";
      const res = await authFetch(`${BASE_URL}${reportBasePath}/filters${query ? `?${query}` : ""}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load filter options");
      }

      setFilterOptions(data);
      setScope(data.scope || { company: "", location: "" });
      setFilters((prev) => ({
        ...prev,
        company: data.scope?.company || "",
        location: data.scope?.location || "",
      }));
    } catch (err) {
      setError(err.message || "Failed to load filter options");
    }
  }

  async function fetchReport(currentFilters = filters) {
    try {
      setLoading(true);
      setError("");

      const query = buildQuery(currentFilters);
      const res = await authFetch(`${BASE_URL}${reportBasePath}?${query}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load report");
      }

      setRows(data.rows || []);
      setScope(data.scope || { company: "", location: "" });
      setFilters((prev) => ({
        ...prev,
        company: isAdmin ? prev.company : data.scope?.company || prev.company,
        location: isAdmin ? prev.location : data.scope?.location || prev.location,
      }));
    } catch (err) {
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFilterOptions();
    fetchReport();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    if (!isAdmin && (name === "company" || name === "location")) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleApplyFilters(e) {
    e.preventDefault();
    fetchFilterOptions();
    fetchReport(filters);
  }

  function handleResetFilters() {
    const reset = {
      company: isAdmin ? "" : scope.company,
      location: isAdmin ? "" : scope.location,
      senderName: "",
      department: "",
      packageType: "",
      courierVendor: "",
      destination: "",
      receiverName: "",
      dateFrom: "",
      dateTo: "",
    };

    setFilters(reset);
    fetchReport(reset);
  }

  const excelRows = useMemo(() => {
    return rows.map(toReportExportRow);
  }, [rows]);

  async function handleDownloadFilteredExcel() {
    downloadRowsAsCsv(excelRows, "filtered_outbound_report.csv");
  }

  async function handleDownloadAllExcel() {
    try {
      const res = await authFetch(`${BASE_URL}${reportBasePath}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load all report data");
      }

      const allExcelRows = (data.rows || []).map(toReportExportRow);
      downloadRowsAsCsv(allExcelRows, "all_outbound_report.csv");
    } catch (err) {
      setError(err.message || "Failed to download all report data");
    }
  }

  return (
    <div className="app-report">
      <header className="app-card__header">
        <h1>{isAdmin ? "Outbound Mail Reports" : "Outbound Mail Report"}</h1>
      </header>
      <p>Reports and exports include up to 1,000 records. Narrow the filters for larger reports.</p>

      <form
        onSubmit={handleApplyFilters}
        className="app-form app-report-filters"
      >
        <input aria-label="Company"
          type="text"
          name="company"
          placeholder={isAdmin ? "All Companies" : "Company"}
          value={filters.company}
          onChange={handleChange}
          list={isAdmin ? "outbound-report-companies" : undefined}
          disabled={!isAdmin}
          title={isAdmin ? "Leave blank to view all companies" : "Your company is fixed for this report"}
        />
        {isAdmin ? (
          <datalist id="outbound-report-companies">
            {filterOptions.companies.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        ) : null}

        <input aria-label="Location"
          type="text"
          name="location"
          placeholder={isAdmin ? "All Locations" : "Location"}
          value={filters.location}
          onChange={handleChange}
          list={isAdmin ? "outbound-report-locations" : undefined}
          disabled={!isAdmin}
          title={isAdmin ? "Leave blank to view all locations" : "Your location is fixed for this report"}
        />
        {isAdmin ? (
          <datalist id="outbound-report-locations">
            {filterOptions.locations.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        ) : null}

        <input aria-label="Sender Name"
          type="text"
          name="senderName"
          placeholder="Sender Name"
          value={filters.senderName}
          onChange={handleChange}
        />

        <select aria-label="Department"
          name="department"
          value={filters.department}
          onChange={handleChange}
        >
          <option value="">All Departments</option>
          {filterOptions.departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select aria-label="Package Type"
          name="packageType"
          value={filters.packageType}
          onChange={handleChange}
        >
          <option value="">All Package Types</option>
          {filterOptions.packageTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select aria-label="Courier Vendor"
          name="courierVendor"
          value={filters.courierVendor}
          onChange={handleChange}
        >
          <option value="">All Courier Vendors</option>
          {filterOptions.vendors.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select aria-label="Destination"
          name="destination"
          value={filters.destination}
          onChange={handleChange}
        >
          <option value="">All Destinations</option>
          {filterOptions.destinations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input aria-label="Receiver Name"
          type="text"
          name="receiverName"
          placeholder="Receiver Name"
          value={filters.receiverName}
          onChange={handleChange}
        />

        <input aria-label="Date From"
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleChange}
        />

        <input aria-label="Date To"
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleChange}
        />

        <div className="app-actions">
          <button className="app-button app-button--primary" type="submit">Apply Filters</button>
          <button className="app-button app-button--secondary" type="button" onClick={handleResetFilters}>
            Reset
          </button>
        </div>

        <div className="app-actions">
          <button className="app-button app-button--secondary" type="button" onClick={handleDownloadAllExcel}>
            Download All CSV
          </button>
          <button className="app-button app-button--secondary" type="button" onClick={handleDownloadFilteredExcel}>
            Download Filtered CSV
          </button>
        </div>
      </form>

      {error ? <p className="app-message app-message--error" role="alert">{error}</p> : null}
      {loading ? <p className="app-message" role="status">Loading...</p> : null}

      <div className="app-table-wrap" role="region" aria-label="Mail report results" tabIndex={0}>
        <table className="app-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Location</th>
              <th>Sender Name</th>
              <th>Sender Email</th>
              <th>Sender Contact</th>
              <th>Department</th>
              <th>Sender Address</th>
              <th>Sender Pincode</th>
              <th>Package Type</th>
              <th>Weight (KG)</th>
              <th>Total Cost</th>
              <th>Courier Vendor</th>
              <th>Destination</th>
              <th>Receiver Name</th>
              <th>Receiver Email</th>
              <th>Receiver Phone</th>
              <th>Receiver Address</th>
              <th>Receiver Pincode</th>
              <th>Remarks</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="21" className="app-table__empty"><span>No outbound mail records found</span></td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.company}</td>
                  <td>{row.location}</td>
                  <td>{row.sender_name}</td>
                  <td>{row.sender_email}</td>
                  <td>{row.sender_contact_no}</td>
                  <td>{row.department}</td>
                  <td>{row.sender_address}</td>
                  <td>{row.sender_pincode}</td>
                  <td>{row.package_type}</td>
                  <td>{row.weight_kg}</td>
                  <td>{row.total_cost}</td>
                  <td>{row.courier_vendor}</td>
                  <td>{row.destination}</td>
                  <td>{row.receiver_name}</td>
                  <td>{row.receiver_email}</td>
                  <td>{row.receiver_phone_no}</td>
                  <td>{row.receiver_address}</td>
                  <td>{row.receiver_pincode}</td>
                  <td>{row.remarks}</td>
                  <td>{formatDateTime(row.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="app-actions app-actions--center">
          <BackButton fallbackPath={isAdmin ? "/admin" : "/executive"} />
        </div>
    </div>
  );
}
