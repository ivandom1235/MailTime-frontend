export function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  // Spreadsheet applications can ignore leading whitespace before a formula.
  const safe = /^[\s\uFEFF]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}
