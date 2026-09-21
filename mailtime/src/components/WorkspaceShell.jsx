import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';

const adminLinks = [
  { to: '/admin', label: 'Home', icon: 'home' },
  { to: '/admin/inbound-report', label: 'Inbound', icon: 'inbound' },
  { to: '/admin/outbound-mails', label: 'Outbound', icon: 'outbound' },
  { to: '/admin#executives', label: 'Execs', icon: 'users' },
  { to: '/admin/password', label: 'Settings', icon: 'lock' },
];
const executiveLinks = [
  { to: '/executive', label: 'Home', icon: 'home' },
  { to: '/executive/incoming-mail', label: 'Inbound', icon: 'inbound' },
  { to: '/executive/outbound-mail', label: 'Outbound', icon: 'outbound' },
  { to: '/outgoing-mail', label: 'Delivery', icon: 'mail' },
  { to: '/executive/inbound-report', label: 'Reports', icon: 'report' },
];

export default function WorkspaceShell({ children }) {
  const { pathname, hash } = useLocation();
  const tenant = JSON.parse(localStorage.getItem('tenant') || 'null');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isExecutive = (pathname.startsWith('/executive') && pathname !== '/executive/login') || ['/incoming-mail', '/outgoing-mail'].includes(pathname);
  const isWorkspace = isAdmin || isExecutive;
  const links = isAdmin ? adminLinks : executiveLinks;
  const initials = (user?.name || (isAdmin ? 'WMS Admin' : 'WMS Executive')).trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('');

  useEffect(() => {
    if (hash === '#executives') document.getElementById('executives')?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  function isActive(link) {
    if (link.to.endsWith('#executives')) return pathname === '/admin' && hash === '#executives';
    if (link.label === 'Home') return pathname === link.to && !hash;
    if (isAdmin && link.label === 'Outbound') return pathname.startsWith('/admin/outbound');
    if (!isAdmin && link.label === 'Reports') return pathname.endsWith('-report');
    if (!isAdmin && link.label === 'Inbound') return ['/incoming-mail', link.to].includes(pathname);
    return pathname === link.to;
  }

  return (
    <div className={`workspace${isWorkspace ? ' workspace--with-nav' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="workspace-header">
        <Link className="workspace-brand" to={isWorkspace ? (isAdmin ? '/admin' : '/executive') : '/login'} aria-label="WMS workspace home">
          <span className="workspace-brand__mark"><Icon name="box" /></span>
          <span className="workspace-brand__text">
            <span className="workspace-brand__label">WMS Workspace</span>
            <span className="workspace-brand__name">{tenant?.name || 'Mail management'}</span>
          </span>
        </Link>
        {isWorkspace ? <span className="workspace-avatar" title={user?.name || (isAdmin ? 'WMS Admin' : 'WMS Executive')} aria-label={user?.name || 'Workspace user'}>{initials}</span> : <span className="workspace-access"><Icon name="lock" /> Workspace access</span>}
      </header>
      {isWorkspace && (
        <nav className="workspace-nav" aria-label="Workspace navigation">
          {links.map(link => (
            <Link key={link.to} to={link.to} className={`workspace-nav__link${isActive(link) ? ' is-active' : ''}`} aria-current={isActive(link) ? 'page' : undefined}>
              <Icon name={link.icon} /><span>{link.label}</span>
            </Link>
          ))}
        </nav>
      )}
      <main id="main-content" className="workspace-content" tabIndex={-1}>{children}</main>
    </div>
  );
}
