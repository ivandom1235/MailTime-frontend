import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

const actions = [
  { to: '/executive/incoming-mail', icon: 'inbound', color: 'orange', title: 'Inbound Mail Capture', description: 'Register incoming documents, parcels, sender details, and recipient information.' },
  { to: '/outgoing-mail', icon: 'mail', color: 'blue', title: 'Inbound Mail Employee Delivery', description: 'Create delivery drafts, review signature status, and complete employee handover.' },
  { to: '/executive/inbound-report', icon: 'report', color: 'blue', title: 'Inbound Mail Report', description: 'Review inbound records raised from your assigned company and location.' },
  { to: '/executive/outbound-mail', icon: 'outbound', color: 'orange', title: 'Outbound Mail Dispatch', description: 'Create outbound courier records with sender, package, and receiver details.' },
  { to: '/executive/outbound-report', icon: 'chart', color: 'green', title: 'Outbound Report', description: 'Review outbound records raised from your assigned company and location.' },
  { to: '/executive/edit-outbound', icon: 'edit', color: 'slate', title: 'Edit Outbound', description: 'Update courier vendor and remarks for outbound mail you created.' },
];

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  function handleLogout() {
    ['auth_token', 'session_token', 'user', 'active_role', 'tenant'].forEach(key => localStorage.removeItem(key));
    navigate('/login', { replace: true });
  }

  return (
    <div className="dashboard">
      <section className="dashboard-welcome" aria-labelledby="dashboard-heading">
        <span className="app-badge">Executive Access</span>
        <h1 id="dashboard-heading">WMS Executive Dashboard</h1>
        <p>Welcome back, <strong>{user?.name || 'WMS Executive'}</strong></p>
        {(user?.company || user?.location) && <p className="dashboard-welcome__assignment">{[user?.company, user?.location].filter(Boolean).join(' · ')}</p>}
      </section>
      <section aria-labelledby="quick-actions-heading">
        <div className="section-heading">
          <h2 id="quick-actions-heading" className="section-label">Quick Actions</h2>
          <span className="section-heading__note">6 tools</span>
        </div>
        <div className="app-grid app-grid--cards executive-actions">
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
    </div>
  );
}
