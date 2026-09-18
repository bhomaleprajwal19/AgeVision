import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';
import PredictionCard from './PredictionCard';
import './PredictionPanel.css';

function summarize(predictions) {
  const count = predictions.length;
  const avgAge = count ? predictions.reduce((sum, p) => sum + p.age, 0) / count : 0;
  const maleCount = predictions.filter((p) => p.gender.toLowerCase() === 'male').length;
  const femaleCount = predictions.filter((p) => p.gender.toLowerCase() === 'female').length;
  return { count, avgAge, maleCount, femaleCount };
}

function PredictionPanel({ status, result, error, onReset }) {
  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'error') {
    return (
      <div className="prediction-panel prediction-panel--centered">
        <ErrorMessage
          message={error || 'Something went wrong while analyzing the image.'}
          hint="Check that the backend is running and try again."
          onRetry={onReset}
        />
      </div>
    );
  }

  if (status === 'success' && result) {
    const predictions = result.predictions ?? [];
    const facesDetected = result.faces_detected ?? predictions.length;

    if (!facesDetected || predictions.length === 0) {
      return (
        <div className="prediction-panel prediction-panel--centered">
          <ErrorMessage
            message="No faces detected"
            hint="Try uploading a clearer image with visible faces."
            onRetry={onReset}
          />
        </div>
      );
    }

    const summary = summarize(predictions);

    return (
      <div className="prediction-panel">
        <div className="prediction-panel__status">
          <span className="prediction-panel__status-dot" aria-hidden="true" />
          Analysis complete
        </div>

        <div className="prediction-panel__summary">
          <div className="prediction-panel__stat">
            <span className="prediction-panel__stat-value">{summary.count}</span>
            <span className="prediction-panel__stat-label">Faces detected</span>
          </div>
          <div className="prediction-panel__stat">
            <span className="prediction-panel__stat-value">{summary.avgAge.toFixed(1)}</span>
            <span className="prediction-panel__stat-label">Avg. age</span>
          </div>
          <div className="prediction-panel__stat">
            <span className="prediction-panel__stat-value">{summary.maleCount}</span>
            <span className="prediction-panel__stat-label">Male</span>
          </div>
          <div className="prediction-panel__stat">
            <span className="prediction-panel__stat-value">{summary.femaleCount}</span>
            <span className="prediction-panel__stat-label">Female</span>
          </div>
        </div>

        <div className="prediction-panel__cards">
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.face_id} prediction={prediction} />
          ))}
        </div>
      </div>
    );
  }

  return <EmptyState />;
}

export default PredictionPanel;
