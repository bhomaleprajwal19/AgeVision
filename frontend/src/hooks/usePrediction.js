import { useCallback, useState } from 'react';
import { predictImage } from '../services/api';

/**
 * Encapsulates the full lifecycle of a single prediction request:
 * idle -> loading -> success | error, plus a reset for starting over.
 * Keeping this logic out of App.jsx/components keeps them focused on
 * rendering rather than request bookkeeping.
 */
export function usePrediction() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const predict = useCallback(async (file) => {
    setStatus('loading');
    setError(null);

    try {
      const data = await predictImage(file);
      setResult(data);
      setStatus('success');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong while analyzing the image.';
      setError(message);
      setStatus('error');
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, predict, reset };
}
