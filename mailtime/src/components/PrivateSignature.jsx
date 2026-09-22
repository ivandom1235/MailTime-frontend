import { useEffect, useState } from 'react';
import { authFetch, API_BASE_URL } from '../services/api';

export default function PrivateSignature({ path }) {
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true, url;
    const abort = new AbortController();
    async function load() {
      try {
        const response = await authFetch(`${API_BASE_URL}${path}`, { signal: abort.signal });
        if (!response.ok) throw new Error('Signature preview is unavailable');
        const blob = await response.blob();
        if (active) { url = URL.createObjectURL(blob); setSource(url); }
      } catch (failure) { if (active) setError(failure.message); }
    }
    load();
    return () => { active = false; abort.abort(); if (url) URL.revokeObjectURL(url); };
  }, [path]);
  if (error) return <p role="alert">{error}</p>;
  return source ? <img className="app-signature-image" src={source} alt="Signature" /> : <p>Loading signature…</p>;
}
