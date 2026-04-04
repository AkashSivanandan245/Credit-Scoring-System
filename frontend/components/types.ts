export interface FormData {
  credit_score: number
  late_payment_count: number
  account_age_months: number
  total_outstanding_debt: number
  num_open_loans: number
  mobile_banking_logins: number
  debit_card_usage_frequency: number
  online_transfer_frequency: number
  utility_bill_payment_delay: number
  digital_payment_frequency: number
  shg_repayment_score: number
  recharge_frequency: number
  avg_recharge_amount: number
  debit_card_spending: number
}

export interface PredictionResult {
  risk_score: number
  risk_level: 'Low' | 'Medium' | 'High'
  decision: 'Approve' | 'Review' | 'Reject'
  confidence: number
  feature_contributions: Record<string, number>
}

export interface FieldConfig {
  key: keyof FormData
  label: string
  min: number
  max: number
  step: number
  unit?: string
  category: 'financial' | 'digital' | 'behavioral'
  icon: string
}
