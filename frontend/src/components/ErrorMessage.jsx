import './ErrorMessage.css';

function ErrorMessage({ message, hint, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <svg className="error-message__icon" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M10 6v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="10" cy="13.5" r="1" fill="currentColor" />
      </svg>
      <div className="error-message__text">
        <p className="error-message__title">{message}</p>
        {hint && <p className="error-message__hint">{hint}</p>}
      </div>
      {onRetry && (
        <button type="button" className="error-message__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
