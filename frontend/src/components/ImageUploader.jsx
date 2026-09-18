import { useCallback, useRef, useState } from 'react';
import ErrorMessage from './ErrorMessage';
import './ImageUploader.css';

function ImageUploader({ onFileSelect, error }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPicker();
      }
    },
    [openPicker],
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragOver(false);
      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile) onFileSelect(droppedFile);
    },
    [onFileSelect],
  );

  const handleChange = useCallback(
    (event) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) onFileSelect(selectedFile);
      // Allow re-selecting the same file after a remove/reset.
      event.target.value = '';
    },
    [onFileSelect],
  );

  return (
    <div className="uploader">
      <div
        className={`uploader__dropzone${isDragOver ? ' uploader__dropzone--active' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload an image for analysis. Drag and drop, or press Enter to browse your device."
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg className="uploader__icon" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 6v24m0-24 9 9m-9-9-9 9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M8 30v6a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <p className="uploader__title">Drop your image here</p>
        <p className="uploader__subtitle">or browse from your device</p>
        <p className="uploader__hint">Supports JPG and PNG, up to 10MB</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="uploader__input"
          onChange={handleChange}
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default ImageUploader;
