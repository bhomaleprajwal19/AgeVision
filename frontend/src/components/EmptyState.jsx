import './EmptyState.css';

function EmptyState() {
  return (
    <div className="empty-state">
      <svg className="empty-state__icon" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="18" cy="22" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M6 32l10-8 7 6 8-7 11 9"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
      <p className="empty-state__title">Your analysis will appear here</p>
      <p className="empty-state__subtitle">Upload an image on the left to detect age and gender.</p>
    </div>
  );
}

export default EmptyState;
