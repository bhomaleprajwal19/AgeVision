import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import PredictionPanel from './components/PredictionPanel';
import ImageCapture from './components/ImageCapture';
import { usePrediction } from './hooks/usePrediction';
import { checkHealth } from './services/api';
import { validateImageFile } from './utils/imageUtils';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const { status, result, error, predict, reset } = usePrediction();

  // Backend health check
  useEffect(() => {
    let cancelled = false;

    checkHealth()
      .then(() => {
        if (!cancelled) setApiStatus('online');
      })
      .catch(() => {
        if (!cancelled) setApiStatus('offline');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Create preview URL for selected image
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Handle uploaded/captured image
  const handleFileSelect = useCallback(
    (selectedFile) => {
      const validation = validateImageFile(selectedFile);

      if (!validation.valid) {
        setFileError(validation.reason);
        return;
      }

      setFileError(null);
      reset();
      setFile(selectedFile);
      setIsCameraActive(false);
    },
    [reset],
  );

  // Remove image and reset
  const handleRemoveImage = useCallback(() => {
    setFile(null);
    setFileError(null);
    setIsCameraActive(false);
    reset();
  }, [reset]);

  // Analyze image
  const handleAnalyze = useCallback(() => {
    if (!file || status === 'loading') return;

    predict(file).catch(() => {
      // Error state is already handled by the hook.
    });
  }, [file, status, predict]);

  const isAnalyzeDisabled = !file || status === 'loading';

  return (
    <div className="app">
      <Header apiStatus={apiStatus} />

      <main className="app__main">
        <section className="app__hero">
          <h1 className="app__hero-title">
            AI-powered age &amp; gender detection
          </h1>

          <p className="app__hero-subtitle">
            Upload an image and let the computer vision model analyze every
            detected face.
          </p>
        </section>

        <div className="app__dashboard">
          {/* Image Upload / Camera */}
          <section className="app__panel" aria-label="Image upload">
            {!file ? (
              <>
                {/* Hide uploader when camera is active */}
                {!isCameraActive && (
                  <ImageUploader
                    onFileSelect={handleFileSelect}
                    error={fileError}
                  />
                )}

                <ImageCapture
                  onFileSelect={handleFileSelect}
                  error={fileError}
                  isCameraActive={isCameraActive}
                  setIsCameraActive={setIsCameraActive}
                />
              </>
            ) : (
              <ImagePreview
                file={file}
                previewUrl={previewUrl}
                predictions={result?.predictions}
                onRemove={handleRemoveImage}
                onAnalyze={handleAnalyze}
                isAnalyzing={status === 'loading'}
                analyzeDisabled={isAnalyzeDisabled}
              />
            )}
          </section>

          {/* Analysis Results */}
          <section className="app__panel" aria-label="Analysis results">
            <PredictionPanel
              status={status}
              result={result}
              error={error}
              onReset={handleRemoveImage}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;