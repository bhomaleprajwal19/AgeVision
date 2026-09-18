import { useEffect, useState } from 'react';
import './LoadingState.css';

const MESSAGES = ['Analyzing image…', 'Detecting faces…', 'Running AI model…'];

function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__scanner">
        <span className="loading-state__scanner-line" />
      </div>
      <p className="loading-state__message">{MESSAGES[index]}</p>
    </div>
  );
}

export default LoadingState;
