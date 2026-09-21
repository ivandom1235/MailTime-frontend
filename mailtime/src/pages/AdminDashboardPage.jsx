import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Icon from '../components/Icon';

const actions = [
  { to: '/admin/outbound-mails', icon: 'mail', color: 'orange', title: 'Outbound Mail', description: 'View dispatch logs' },
  { to: '/admin/inbound-report', icon: 'report', color: 'blue', title: 'Inbound Report', description: 'Review received mail' },
  { to: '/admin/outbound-report', icon: 'chart', color: 'green', title: 'Outbound Reports', description: 'Review dispatched mail' },
  { to: '/admin/password', icon: 'lock', color: 'slate', title: 'Edit Password', description: 'Security & credentials' },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadExecutives() {
      try {
        const res = await api.get('/admin/executives');
        if (!cancelled) setExecutives(res.executives || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load executives. Please refresh to try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadExecutives();
    return () => { cancelled = true; };
  }, []);

  function handleLogout() {
    ['auth_token', 'session_token', 'user', 'active_role', 'tenant'].forEach(key => localStorage.removeItem(key));
    navigate('/login', { replace: true });
  }

  const query = search.trim().toLowerCase();
  const filteredExecutives = executives.filter(executive => [executive.name, executive.email, executive.phoneNumber, executive.location, executive.company].some(value => String(value || '').toLowerCase().includes(query)));
  const metrics = [
    { label: 'Total Execs', value: executives.length },
    { label: 'Locations', value: new Set(executives.map(item => item.location).filter(Boolean)).size },
    { label: 'Companies', value: new Set(executives.map(item => item.company).filter(Boolean)).size },
  ];

  return (
    <div className="dashboard">
      <section className="dashboard-welcome" aria-labelledby="dashboard-heading">
        <span className="app-badge">Admin Access</span>
        <h1 id="dashboard-heading">WMS Admin Dashboard</h1>
        <p>Welcome back, <strong>{user?.name || 'WMS Admin'}</strong></p>
      </section>
      <section className="dashboard-metrics" aria-label="Executive overview" aria-busy={loading}>
        {metrics.map(metric => (
          <div className="dashboard-metric" key={metric.label}>
            <p>{metric.label}</p>
            <strong>{loading || error ? '—' : metric.value}</strong>
          </div>
        ))}
      </section>
      <div className="dashboard-columns">
        <section className="dashboard-actions" aria-labelledby="quick-actions-heading">
          <div className="section-heading">
            <h2 id="quick-actions-heading" className="section-label">Quick Actions</h2>
            <span className="section-heading__note">6 tools</span>
          </div>
          <Link className="app-button app-button--primary dashboard-add" to="/admin/executives/new"><Icon name="plus" /> Add Executive</Link>
          <div className="dashboard-action-grid">
            {actions.map(action => (
              <Link className="app-action-card" to={action.to} key={action.to}>
                <span className={'action-icon action-icon--' + action.color}><Icon name={action.icon} /></span>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </Link>
            ))}
          </div>
          <div className="dashboard-logout"><button className="app-button app-button--quiet-danger" onClick={handleLogout} type="button"><Icon name="logout" /> Log out</button></div>
        </section>
        <section className="executives-section" id="executives" aria-labelledby="executives-heading">
          <div className="section-heading">
            <h2 id="executives-heading">Executives <span className="count-badge">{loading || error ? '—' : executives.length}</span></h2>
            {search && <button className="app-text-button" type="button" onClick={() => setSearch('')}>View all</button>}
          </div>
          <div className="executive-search">
            <Icon name="search" />
            <label className="sr-only" htmlFor="executive-search">Search executives</label>
            <input id="executive-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search executives, email, company..." />
          </div>
          {error ? <p className="app-message app-message--error" role="alert">{error}</p> : loading ? <p className="app-message" role="status">Loading executives...</p> : filteredExecutives.length === 0 ? <p className="app-message" role="status">{query ? 'No executives match your search.' : 'No executives yet. Add an executive to get started.'}</p> : (
            <div className="executive-list" aria-live="polite">
              {filteredExecutives.map(executive => (
                <article className="executive-card" key={executive.id}>
                  <div className="executive-card__identity">
                    <span className="executive-avatar" aria-hidden="true">{(executive.name || 'Executive').trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('')}</span>
                    <div className="executive-card__person">
                      <h3>{executive.name || 'Executive'}</h3>
                      <p><Icon name="mail" /><span>{executive.email || 'No email provided'}</span></p>
                    </div>
                  </div>
                  <dl className="executive-card__details">
                    <div><dt>Phone</dt><dd>{executive.phoneNumber || '—'}</dd></div>
                    <div><dt>Location</dt><dd>{executive.location || '—'}</dd></div>
                    <div><dt>Company</dt><dd>{executive.company || '—'}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
