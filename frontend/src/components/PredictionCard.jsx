import './PredictionCard.css';

function PredictionCard({ prediction }) {
  const { face_id: faceId, age, gender, gender_confidence: confidence, bounding_box: box } = prediction;
  const confidencePct = Math.round(confidence * 100);
  const genderKey = gender.toLowerCase() === 'female' ? 'female' : 'male';

  return (
    <article className="prediction-card">
      <header className="prediction-card__header">
        <span className="prediction-card__face-id">Face #{faceId}</span>
        <span className={`prediction-card__badge prediction-card__badge--${genderKey}`}>{gender}</span>
      </header>

      <div className="prediction-card__age">
        <span className="prediction-card__age-value">{Math.round(age)}</span>
        <span className="prediction-card__age-unit">years</span>
      </div>

      <div className="prediction-card__confidence">
        <div className="prediction-card__confidence-row">
          <span>Confidence</span>
          <span className="prediction-card__confidence-value">{confidencePct}%</span>
        </div>
        <div
          className="prediction-card__confidence-bar"
          role="progressbar"
          aria-valuenow={confidencePct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Gender prediction confidence: ${confidencePct}%`}
        >
          <div
            className={`prediction-card__confidence-fill prediction-card__confidence-fill--${genderKey}`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      {box && (
        <p className="prediction-card__box-info">
          x: {box.x} · y: {box.y} · w: {box.width} · h: {box.height}
        </p>
      )}
    </article>
  );
}

export default PredictionCard;
