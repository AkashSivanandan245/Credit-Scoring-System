# CreditGuard — Credit Risk Assessment System

An end-to-end machine learning web application that predicts credit default risk for bank clients using a trained Logistic Regression model, served via a Flask REST API and visualised through a modern React dashboard with an AI-powered intake chatbot.

---

## About the Project

CreditGuard automates credit risk assessment for banks. A bank employee enters client details — or simply chats with the AI assistant — and the system returns an instant, data-driven risk score categorised as Low, Medium, or High risk, along with a recommendation.

The project covers the full ML lifecycle: raw data analysis, feature engineering, model training and evaluation, REST API deployment, and a production-ready frontend.

---

## Features

- Real-time risk scoring — probability-based score with Low / Medium / High classification
- Interactive dashboard — animated gauge, radar chart, factor contribution bars, score trend
- AI Intake Assistant — conversational chatbot that collects client details in natural language and auto-fills the form
- Real ML model — Logistic Regression selected for best ROC-AUC score
- Assessment history — track and compare multiple client assessments per session
- Dark-themed professional UI

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                  React Dashboard                      │
│                  Hosted on Vercel                     │
│   Sliders | Gauge | Radar | AI Chat | History        │
└─────────────────────┬────────────────────────────────┘
                      │ HTTP POST (JSON)
                      ▼
┌──────────────────────────────────────────────────────┐
│           Flask API — Hugging Face Spaces             │
│      /predict              |        /chat             │
│  final_model.pkl           |  Groq LLaMA 3.3 70B    │
│  predict_proba()           |  Natural language → JSON │
└──────────────────────────────────────────────────────┘
```

---

## Machine Learning Pipeline

### Feature Selection

Three techniques were applied to identify the most predictive and independent features:

| Technique | Purpose |
|-----------|---------|
| Correlation (Pearson) | Detect linear relationships between features and target |
| Mutual Information (MI) | Capture non-linear dependencies |
| VIF (Variance Inflation Factor) | Remove multicollinear features — threshold VIF > 5 |

### Final 5 Features

| Feature | Range | Effect on Risk |
|---------|-------|---------------|
| `late_payment` | 0 – 10 | Higher → More risk |
| `financial_stability` | 0 – 10 | Higher → Less risk |
| `deposits` | 0 – 10 | Higher → Less risk |
| `atm` | 0 – 10 | Higher → More risk |
| `age` | 18 – 80 | Older → Slight risk |

### Model Comparison (ROC-AUC)

| Model | Performance |
|-------|------------|
| **Logistic Regression** | **Best ROC-AUC — Selected** |
| Random Forest | 2nd |
| XGBoost | 3rd |

**Why Logistic Regression:** After MI and VIF-based feature selection, the remaining features had strong linear separability. On a small-to-medium dataset with clean features, simpler models generalise better. Logistic Regression is also fully interpretable — each coefficient shows the direction and magnitude of a feature's effect, which is critical in regulated financial applications.

### Risk Thresholds

| Score | Risk Level | Recommendation |
|-------|-----------|---------------|
| 0 – 40% | Low Risk | Approve with standard terms |
| 40 – 70% | Medium Risk | Manual review — consider collateral |
| 70 – 100% | High Risk | Decline application |

---

## Project Structure

```
creditguard/
├── backend/
│   ├── app.py                  # Flask API (/predict and /chat routes)
│   ├── final_model.pkl         # Trained Logistic Regression model
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Docker config for Hugging Face Spaces
│   └── README.md               # HF Spaces config (sdk: docker)
│
└── frontend/
    ├── src/
    │   ├── App.js              # Main React dashboard
    │   ├── index.js            # Entry point
    │   └── index.css           # Dark theme + animations
    ├── public/index.html
    ├── .env.example            # Environment variable template
    ├── package.json
    └── vercel.json             # Vercel deployment config
```

---

## Tech Stack

### Backend

| Technology | Purpose |
|-----------|---------|
| Flask | REST API framework |
| Flask-CORS | Allow cross-origin requests from the frontend |
| scikit-learn | Load and run the trained ML model |
| joblib | Deserialise `final_model.pkl` |
| NumPy | Format inputs for `predict_proba()` |
| Groq Python SDK | Connect to LLaMA 3.3 70B for the AI chatbot |
| Gunicorn | Production WSGI server |
| Docker | Containerise the environment for Hugging Face Spaces |

### Frontend

| Technology | Purpose |
|-----------|---------|
| React.js | Component-based UI framework |
| Recharts | Radar chart and score trend line chart |
| CSS Variables | Dark theme, animations, transitions |

### Deployment

| Service | Platform |
|---------|---------|
| Flask API + ML model | Hugging Face Spaces (Docker SDK) |
| React Dashboard | Vercel |
| AI Chatbot LLM | Groq (free tier — LLaMA 3.3 70B) |

---

## AI Intake Assistant

Instead of manually adjusting sliders, a bank employee can describe the client in natural language and the chatbot automatically extracts and fills all 5 risk parameters.

**Example:**

```
Bot:   What is the client's age?
User:  She is 35 years old

Bot:   How many times has she missed a payment in the last year?
User:  She missed 2 payments

Bot:   How would you describe her financial stability?
User:  She earns around 50,000 a month and has some savings

Bot:   Thank you! I have all the information needed. Let me fill in the form now.
```

All 5 sliders auto-fill instantly. Employee clicks Assess Risk to run the ML model.

---

## API Reference

### POST /predict

```json
// Request
{
  "late_payment": 2,
  "financial_stability": 6,
  "deposits": 7,
  "atm": 3,
  "age": 35
}

// Response
{
  "score": 28.5,
  "label": "Low Risk",
  "grade": "A",
  "probability": 0.285
}
```

### POST /chat

```json
// Request
{
  "system": "...",
  "messages": [{ "role": "user", "content": "She is 35 years old" }]
}

// Response
{
  "content": "Got it. How many times has she missed a payment in the last year?"
}
```

---

## Limitations

- Model is static — does not retrain automatically as new data arrives
- Only 5 features — production credit scoring systems typically use 50–200 features
- Designed for existing bank clients only — unbanked individuals have no transaction history to assess
- Risk thresholds (40/70) are heuristic — not calibrated via cost-benefit analysis of false positives vs false negatives

---


