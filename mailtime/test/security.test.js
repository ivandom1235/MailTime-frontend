import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeCsvValue } from '../src/services/csv.js';
import { getSessionToken, clearLegacySession } from '../src/services/session.js';
function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}
globalThis.sessionStorage = storage();
globalThis.localStorage = storage();
test('CSV exports neutralize formulas including leading whitespace and preserve quoted text', () => {
  for (const value of ['=1+1', '  =1+1', '\t@SUM(A1)', '\n+1', '-1', '\uFEFF=1']) assert.ok(escapeCsvValue(value).startsWith('"\''));
  assert.equal(escapeCsvValue('Sam "Smith"'), '"Sam ""Smith"""');
  assert.equal(escapeCsvValue(null), '');
});
test('expired or corrupt browser sessions are cleared and legacy tokens are discarded', () => {
  localStorage.setItem('session_token', 'legacy-secret');
  clearLegacySession();
  assert.equal(localStorage.getItem('session_token'), null);
  for (const payload of [null, {}, { exp: 1 }]) {
    sessionStorage.setItem('session_token', 'header.' + btoa(JSON.stringify(payload)) + '.signature');
    sessionStorage.setItem('user', '{}');
    assert.equal(getSessionToken(), null);
    assert.equal(sessionStorage.getItem('user'), null);
  }
  const token = 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })) + '.signature';
  sessionStorage.setItem('session_token', token);
  assert.equal(getSessionToken(), token);
});
