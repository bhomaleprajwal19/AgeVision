import DetectionOverlay from './DetectionOverlay';
import { formatFileSize } from '../utils/imageUtils';
import './ImagePreview.css';

function ImagePreview({
  file,
  previewUrl,
  predictions,
  onRemove,
  onAnalyze,
  isAnalyzing,
  analyzeDisabled,
}) {
  return (
    <div className="image-preview">
      <div className="image-preview__frame">
        <DetectionOverlay imageUrl={previewUrl} predictions={predictions} altText={file.name} />
      </div>

      <div className="image-preview__meta">
        <div className="image-preview__file-info">
          <span className="image-preview__file-name" title={file.name}>
            {file.name}
          </span>
          <span className="image-preview__file-size">{formatFileSize(file.size)}</span>
        </div>
        <button
          type="button"
          className="image-preview__remove"
          onClick={onRemove}
          aria-label="Remove selected image"
        >
          Remove
        </button>
      </div>

      <button
        type="button"
        className="image-preview__analyze-btn"
        onClick={onAnalyze}
        disabled={analyzeDisabled}
      >
        {isAnalyzing ? 'Analyzing…' : 'Analyze image'}
      </button>
    </div>
  );
}

export default ImagePreview;
