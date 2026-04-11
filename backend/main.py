from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="Credit Risk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.environ.get("MODEL_PATH", "credit_risk_model.pkl")
model = None

@app.on_event("startup")
def load_model():
    global model
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Model loaded from {MODEL_PATH}")
    except Exception as e:
        print(f"Warning: Could not load model: {e}")

class PredictionInput(BaseModel):
    credit_score: float
    late_payment_count: float
    account_age_months: float
    total_outstanding_debt: float
    num_open_loans: float
    mobile_banking_logins: float
    debit_card_usage_frequency: float
    online_transfer_frequency: float
    utility_bill_payment_delay: float
    digital_payment_frequency: float
    shg_repayment_score: float
    recharge_frequency: float
    avg_recharge_amount: float
    debit_card_spending: float

class PredictionOutput(BaseModel):
    risk_score: float
    risk_level: str
    decision: str
    confidence: float
    feature_contributions: dict

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    features = np.array([[
        data.credit_score,
        data.late_payment_count,
        data.account_age_months,
        data.total_outstanding_debt,
        data.num_open_loans,
        data.mobile_banking_logins,
        data.debit_card_usage_frequency,
        data.online_transfer_frequency,
        data.utility_bill_payment_delay,
        data.digital_payment_frequency,
        data.shg_repayment_score,
        data.recharge_frequency,
        data.avg_recharge_amount,
        data.debit_card_spending,
    ]])

    prob = model.predict_proba(features)[0][1]
    risk_score = round(prob * 100, 2)

    if risk_score < 35:
       risk_level = "Low"
       decision = "Approve"
    elif risk_score < 65:
       risk_level = "Medium"
       decision = "Review"
    else:
       risk_level = "High"
       decision = "Reject"

    feature_names = [
        "credit_score", "late_payment_count", "account_age_months",
        "total_outstanding_debt", "num_open_loans", "mobile_banking_logins",
        "debit_card_usage_frequency", "online_transfer_frequency",
        "utility_bill_payment_delay", "digital_payment_frequency",
        "shg_repayment_score", "recharge_frequency",
        "avg_recharge_amount", "debit_card_spending"
    ]
    
    # Try to get feature importances from the model pipeline
    contributions = {}
    try:
        xgb_step = model.named_steps.get("xgbclassifier") or model.named_steps.get("model")
        if xgb_step and hasattr(xgb_step, "feature_importances_"):
            importances = xgb_step.feature_importances_
            for name, imp in zip(feature_names, importances):
                contributions[name] = round(float(imp) * 100, 2)
    except Exception:
        for name in feature_names:
            contributions[name] = 0.0

    return PredictionOutput(
        risk_score=risk_score,
        risk_level=risk_level,
        decision=decision,
        confidence=round(float(max(prob, 1 - prob)) * 100, 2),
        feature_contributions=contributions,
    )
