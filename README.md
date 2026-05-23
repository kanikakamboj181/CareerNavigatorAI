# CareerNavigatorAI 🚀

CareerNavigatorAI is a compact full-stack application that helps students discover the best-fit technology careers by combining a small Random Forest model with a clean React + Tailwind frontend and a lightweight Flask API.

This repository contains everything required to run the app locally: the frontend (Vite + React + Tailwind), the backend API (Flask + SQLAlchemy + JWT), and the model & data utilities used to prepare and retrain the Random Forest model.

**Top-level summary**
- Frontend: `frontend/` — React (Vite) + Tailwind UI, charts and interactive sliders for predictions.
- Backend: `backend/` — Flask API exposing `/api/*` endpoints (JWT-based auth).
- Model & data: `backend/ml_old/` (scripts to download/process/train) and `model_artifacts/` (precomputed numpy artifacts).

## ✨ Key Features

- ML-powered role recommendation (Random Forest) using 7 skill dimensions.
- JWT authentication handled by `flask-jwt-extended` (see `backend/config.py`).
- Persistent user profiles stored in SQLite (created under `backend/instance/`).
- Offline-capable market insights (cached JSON) used to enrich role metadata.
- Modern responsive frontend using Tailwind, Chart.js and React.

## 🛠️ Tech Stack

- Backend: Python, Flask, Flask-CORS, Flask-JWT-Extended, SQLAlchemy
- ML: scikit-learn, pandas, numpy
- Frontend: React 18, Vite, Tailwind CSS, react-chartjs-2, react-hot-toast, react-icons

## 🚀 Local setup — quick guide

Prereqs: `python` 3.9+, `node` 18+, `npm` or `pnpm`.

1) Create a Python virtual environment and install backend deps

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate    # Windows
# or: source .venv/bin/activate  # macOS / Linux
pip install --upgrade pip
pip install flask flask-cors flask-jwt-extended sqlalchemy pandas numpy scikit-learn
```

If you prefer, create a `requirements.txt` with those packages for repeatable installs.

2) Prepare or retrain model/data (optional)

The repository includes `backend/ml_old/` scripts to fetch market data, download or synthesise student samples, preprocess, and train the Random Forest.

```bash
# (optional) generate market insights
python backend/ml_old/fetch_market_data.py

# (optional) download or synthesize the student dataset
python backend/ml_old/download_dataset.py

# (optional) run the data pipeline to create feature artifacts
python backend/ml_old/data_pipeline.py

# (optional) train and save the model artifacts
python backend/ml_old/train_model.py
```

Trained artifacts are stored under `model_artifacts/` and `instance/ml/artifacts/` (if present). The API will load model/data from the configured paths when available.

3) Run the Flask backend API

```bash
# from repo root
python backend/run.py
# The backend starts on http://127.0.0.1:5000 and exposes the API under /api
```

You can optionally set environment variables to override defaults (see `backend/config.py`):

- `SECRET_KEY` — Flask secret
- `JWT_SECRET_KEY` — JWT signing key
- `DATABASE_URL` — SQLAlchemy database URI (defaults to `sqlite:///database.db`)

4) Run the frontend (dev mode)

```bash
cd frontend
npm install
npm run dev
# Frontend dev server runs on http://localhost:5173 and talks to backend at http://127.0.0.1:5000
```

To create a production build:

```bash
cd frontend
npm run build
```

Then serve the static `dist/` files or integrate with your preferred hosting.

## API overview

- The Flask app registers its routes under `/api` (see `backend/adapters/inbound/api_rest.py`). The React client talks to these endpoints via the `frontend/src/api/client.js` axios client.

## Development notes & tips

- CORS in `app_factory.py` allows `http://localhost:5173` (Vite dev server). If you change the dev port, update the CORS origins.
- Auth: the backend uses JWT tokens. Tokens are issued by the API and stored client-side by the React app.
- If you update model code, re-run `train_model.py` and restart the backend so the ML service reloads artifacts.

## Where to look in the codebase

- `frontend/src/` — React pages and components (Landing, Prediction, Results, History, Profile, Navbar, Logo)
- `frontend/index.html`, `frontend/src/index.css`, `frontend/tailwind.config.js` — UI theming and Tailwind config
- `backend/adapters/inbound/` — Flask app factory and API blueprint
- `backend/adapters/outbound/db/models.py` — SQLAlchemy models and DB setup
- `backend/ml_old/` — scripts for dataset, pipeline, training, and market fetch

## Troubleshooting

- If frontend cannot reach backend, ensure both servers are running and check CORS origins in `backend/adapters/inbound/app_factory.py`.
- If authentication fails, verify `JWT_SECRET_KEY` matches between runs or reset tokens by re-logging in.

## Next steps you might want

- Add a `requirements.txt` to pin backend dependencies.
- Add GitHub Actions to run linting/tests and build the frontend artifacts.
- Improve model persistence and add a small admin UI to retrain and version models.

---

If you'd like, I can also:
- Generate a `requirements.txt` for the backend from the detected imports,
- Add a quick `docker-compose.yml` to run backend+frontend together, or
- Expand the README with endpoint examples and sample `curl` requests.

Which of these would you like me to do next?
