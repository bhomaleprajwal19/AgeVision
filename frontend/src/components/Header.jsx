import './Header.css';

const STATUS_LABELS = {
  checking: 'Checking API…',
  online: 'API Online',
  offline: 'API Offline',
};

function Header({ apiStatus }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <svg className="header__mark" viewBox="0 0 32 32" aria-hidden="true">
            <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="20" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="2" y="20" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="25" cy="25" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <div className="header__titles">
            <span className="header__title">AgeVision</span>
            <span className="header__subtitle">AI-powered facial attribute analysis</span>
          </div>
        </div>

        <div className={`header__status header__status--${apiStatus}`} role="status" aria-live="polite">
          <span className="header__status-dot" aria-hidden="true" />
          <span className="header__status-label">{STATUS_LABELS[apiStatus] ?? STATUS_LABELS.checking}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
