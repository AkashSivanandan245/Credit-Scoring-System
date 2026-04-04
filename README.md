# CreditLens — Alternative Credit Scoring Dashboard

AI-powered credit risk scoring for unbanked women, built with Next.js + FastAPI + XGBoost.

---

## Folder Structure

```
credit-risk-dashboard/
├── frontend/          ← Next.js dashboard (deploy to Vercel)
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── ScoreGauge.tsx
│   │   ├── FeatureBars.tsx
│   │   ├── InputField.tsx
│   │   ├── fieldConfig.ts
│   │   └── types.ts
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── tsconfig.json
│
├── backend/           ← FastAPI + model (deploy to Render)
│   ├── main.py
│   ├── requirements.txt
│   ├── Procfile
│   └── credit_risk_model.pkl   ← YOU ADD THIS
│
└── .gitignore
```

---

## Step-by-Step Deployment

### STEP 1 — Add your model file
Copy your `credit_risk_model.pkl` into the `backend/` folder.

### STEP 2 — Test locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs at http://localhost:8000
# Test: http://localhost:8000/health
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# Runs at http://localhost:3000
```

### STEP 3 — Push to GitHub
```bash
cd credit-risk-dashboard
git init
git add .
git commit -m "Initial commit"
```
Go to github.com → New Repository → name it `credit-risk-dashboard` → copy the push commands shown and run them.

### STEP 4 — Deploy Backend to Render (free)
1. Go to render.com → Sign up / Log in
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** to `backend`
5. Set **Build Command**: `pip install -r requirements.txt`
6. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Click **Deploy**
8. Wait ~3 mins → copy your Render URL (e.g. `https://your-app.onrender.com`)

### STEP 5 — Deploy Frontend to Vercel
1. Go to vercel.com → Sign up / Log in with GitHub
2. Click **Add New → Project**
3. Import your `credit-risk-dashboard` repo
4. Set **Root Directory** to `frontend`
5. Under **Environment Variables** add:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: your Render URL from Step 4 (e.g. `https://your-app.onrender.com`)
6. Click **Deploy**
7. Done! Your dashboard is live.

---

## Local Development Notes
- The backend must be running for predictions to work
- The `.pkl` model file is gitignored — you must add it manually to the backend folder
- On Render free tier, the server sleeps after 15 mins of inactivity (first request takes ~30s to wake)
