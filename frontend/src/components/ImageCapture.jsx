import React, { useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types';

const ImageCapture = ({
  onFileSelect,
  error,
  isCameraActive,
  setIsCameraActive,
}) => {
  const webcamRef = useRef(null);

  // Open camera
  const openCamera = () => {
    setIsCameraActive(true);
  };

  // Capture image
  const capture = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File(
            [blob],
            'captured_image.png',
            { type: 'image/png' }
          );

          onFileSelect(file);
          setIsCameraActive(false);
        })
        .catch((err) => {
          console.error('Failed to capture image:', err);
        });
    }
  }, [onFileSelect, setIsCameraActive]);

  // Close camera
  const closeCamera = () => {
    setIsCameraActive(false);
  };

  return (
    <div className="image-capture">
      {!isCameraActive ? (
        <button
          type="button"
          className="camera-open-button"
          onClick={openCamera}
        >
          Use Camera
        </button>
      ) : (
        <>
          <div className="camera-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              width={320}
              height={240}
              className="webcam-mirror"
            />
          </div>

          <div className="camera-buttons">
            <button
              type="button"
              className="capture-button"
              onClick={capture}
            >
              Capture
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={closeCamera}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

ImageCapture.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  error: PropTypes.string,
  isCameraActive: PropTypes.bool.isRequired,
  setIsCameraActive: PropTypes.func.isRequired,
};

export default ImageCapture;