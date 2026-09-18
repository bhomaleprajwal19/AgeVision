# AgeVision — Age & Gender Detection Frontend

A React + Vite frontend for an existing Age & Gender Detection API (custom CNN, TensorFlow/Keras, OpenCV Haar Cascade, FastAPI). This project only consumes the API — it does not touch the model, face detection, or backend contract.

## Stack

- React 18 + Vite
- Plain CSS (no UI framework)
- Fetch API via a small service layer (`src/services/api.js`)

## Getting started

```bash
npm install
npm run dev
```

The app expects the FastAPI backend to be running and reachable at the URL in `.env`:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Change this if your backend runs elsewhere, then restart the dev server (Vite only reads `.env` at startup).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — preview the production build locally

## Project structure

```
src/
├── components/      # Presentational + interactive UI pieces
├── services/api.js  # All fetch calls to the backend (GET /health, POST /predict)
├── hooks/usePrediction.js  # Prediction request lifecycle (loading/result/error)
├── utils/imageUtils.js     # File validation + formatting helpers
├── App.jsx           # Top-level state: selected file, wiring panels together
└── main.jsx
```

## How bounding boxes are aligned

`DetectionOverlay.jsx` renders the original uploaded image at whatever size the layout gives it, reads the image's natural resolution on load, and compares it to the rendered (client) size to get `scaleX` / `scaleY`. Every box from `bounding_box` (`x`, `y`, `width`, `height`) is multiplied by those factors before being positioned, so boxes stay aligned with the original image regardless of screen size. A `ResizeObserver` re-measures on layout changes (e.g. rotating a phone, resizing the window).

## Notes

- The `/predict` request sends the file under the `file` field as `multipart/form-data`, matching the backend contract exactly. `Content-Type` is left for the browser to set (required for the multipart boundary).
- "No faces detected" is treated as a normal, expected outcome — not an error — with a message suggesting a clearer photo.
- The `GET /health` check runs once on load and only drives the header's status indicator; it never blocks the rest of the UI.
