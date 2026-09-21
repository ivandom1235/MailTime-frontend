const paths = {
  box: 'M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  home: 'm3 10 9-7 9 7M5 9v11h5v-6h4v6h5V9',
  inbound: 'M12 3v18m-7-7 7 7 7-7',
  outbound: 'M12 21V3m-7 7 7-7 7 7',
  mail: 'm3 7 9 6 9-6M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  report: 'M9 17v-2m3 2v-4m3 4v-6M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6',
  chart: 'M3 4h18M5 4v13h14V4M8 12l3-3 3 3 3-5M12 17v4m-4 0 4-4 4 4',
  users: 'M16 21h5v-2a5 5 0 0 0-5-5M16 3a4 4 0 0 1 0 8M15 21H3v-2a6 6 0 0 1 12 0v2ZM13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  lock: 'M7 10V7a5 5 0 0 1 10 0v3M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm6 5v2',
  plus: 'M12 4v16M4 12h16',
  logout: 'M9 8V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3m-2-4h15m-5-5 5 5-5 5',
  search: 'm21 21-6-6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  edit: 'm16 3 5 5-12 12-6 1 1-6L16 3Zm-2 2 5 5',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  back: 'M20 12H4m6-6-6 6 6 6',
};

export default function Icon({ name, className = '' }) {
  return (
    <svg className={`app-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name] || paths.box} />
    </svg>
  );
}
