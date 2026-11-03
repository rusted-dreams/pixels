# IVP Project

Run the image processing app using only the frontend:

```sh
cd frontend
npm ci
npm run dev
```

`npm run build` creates the static site in `frontend/dist`; `npm run preview` serves that build locally. No backend server or `VITE_API_BASE_URL` is needed. The existing `backend/` folder is retained for reference.

All image processing runs locally in a Web Worker using the pinned OpenCV.js 4.10.0 package. Vite bundles the runtime (including WebAssembly) with the site, so processing requires neither a CDN nor an image upload. PNG results and RGB ZIP downloads are generated in the browser. The existing task identifiers, controls, and result viewer are preserved, including support in the processing service for the backend-only resize, bitwise, logarithmic, inverse-logarithmic, and power-law operations.

Segmentation uses OpenCV k-means to group pixels into up to eight colors. It is color-based segmentation, not the semantic object classes from the separate PyTorch DeepLab model in `custom models/segment.py` (which was not connected to the backend route). Existing kernel controls and the Hough angle control now apply their displayed values; Hough angles are converted from degrees to radians for OpenCV.

Validation:

```sh
cd frontend
npm test
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

The tests use the real OpenCV runtime and cover every visible task, backend-only operations, expected pixels/dimensions, RGB output, parameter handling, and invalid inputs.
