const keys = ['auth_token', 'session_token', 'user', 'active_role', 'tenant'];
export function clearSession() { keys.forEach(key => sessionStorage.removeItem(key)); }
export function clearLegacySession() { keys.forEach(key => localStorage.removeItem(key)); }
export function getSessionToken() {
  const token = sessionStorage.getItem('session_token') || sessionStorage.getItem('auth_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!Number.isFinite(payload.exp) || payload.exp * 1000 <= Date.now()) throw new Error('Expired session');
    return token;
  } catch { clearSession(); return null; }
}
