import { useCallback, useEffect, useRef, useState } from 'react';
import './DetectionOverlay.css';

/**
 * Renders the original image at whatever size the layout gives it, then
 * lays bounding boxes on top scaled from the API's natural-resolution
 * coordinates to the image's current on-screen size. Re-measures on
 * resize so boxes stay aligned across breakpoints.
 */
function DetectionOverlay({ imageUrl, predictions, altText }) {
  const imgRef = useRef(null);
  const [naturalSize, setNaturalSize] = useState(null);
  const [displaySize, setDisplaySize] = useState(null);

  const measure = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    setDisplaySize({ width: img.clientWidth, height: img.clientHeight });
  }, []);

  const handleLoad = useCallback(
    (event) => {
      const img = event.target;
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      measure();
    },
    [measure],
  );

  useEffect(() => {
    const node = imgRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => measure());
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure, imageUrl]);

  const hasBoxes = Boolean(predictions?.length) && naturalSize && displaySize;
  const scaleX = hasBoxes ? displaySize.width / naturalSize.width : 1;
  const scaleY = hasBoxes ? displaySize.height / naturalSize.height : 1;

  return (
    <div className="detection-overlay">
      <img
        ref={imgRef}
        src={imageUrl}
        alt={altText || 'Uploaded image'}
        className="detection-overlay__image"
        onLoad={handleLoad}
      />

      {hasBoxes && (
        <div className="detection-overlay__boxes" aria-hidden="true">
          {predictions.map((prediction) => {
            const { bounding_box: box, face_id: faceId, age, gender } = prediction;
            const style = {
              left: `${box.x * scaleX}px`,
              top: `${box.y * scaleY}px`,
              width: `${box.width * scaleX}px`,
              height: `${box.height * scaleY}px`,
            };

            return (
              <div key={faceId} className="detection-overlay__box" style={style}>
                <span className="detection-overlay__box-label">
                  #{faceId} · {gender} · {Math.round(age)}y
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DetectionOverlay;
