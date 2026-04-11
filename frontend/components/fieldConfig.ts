import { FieldConfig } from './types'

export const FIELDS: FieldConfig[] = [
  // Financial
  { key: 'credit_score',            label: 'Financial Inclusion Score', min: 300, max: 900,    step: 1,   unit: '(650 if unknown)', category: 'financial',  icon: '📊' },
  { key: 'late_payment_count',      label: 'Late Payment Count',        min: 0,   max: 50,     step: 1,                             category: 'financial',  icon: '⚠️' },
  { key: 'account_age_months',      label: 'Account Age',               min: 0,   max: 360,    step: 1,   unit: 'mo',               category: 'financial',  icon: '📅' },
  { key: 'total_outstanding_debt',  label: 'Outstanding Debt',          min: 0,   max: 500000, step: 100, unit: '₹',                category: 'financial',  icon: '💳' },
  { key: 'num_open_loans',          label: 'Open Loans',                min: 0,   max: 20,     step: 1,                             category: 'financial',  icon: '🏦' },
  { key: 'shg_repayment_score',     label: 'SHG Repayment Score',       min: 0,   max: 100,    step: 0.1,                           category: 'financial',  icon: '🤝' },
  // Digital
  { key: 'mobile_banking_logins',      label: 'Mobile Banking Logins',  min: 0,   max: 200,    step: 1,   unit: '/mo',              category: 'digital',    icon: '📱' },
  { key: 'debit_card_usage_frequency', label: 'Debit Card Frequency',   min: 0,   max: 100,    step: 1,   unit: '/mo',              category: 'digital',    icon: '💰' },
  { key: 'online_transfer_frequency',  label: 'Online Transfers',       min: 0,   max: 100,    step: 1,   unit: '/mo',              category: 'digital',    icon: '🔄' },
  { key: 'digital_payment_frequency',  label: 'Digital Payments',       min: 0,   max: 200,    step: 1,   unit: '/mo',              category: 'digital',    icon: '⚡' },
  { key: 'debit_card_spending',     label: 'Debit Card Spending',       min: 0,   max: 100000, step: 100, unit: '₹',                category: 'digital',    icon: '🛒' },
  // Behavioral
  { key: 'utility_bill_payment_delay', label: 'Utility Bill Delay',     min: 0,   max: 1,      step: 1,   unit: '(0/1)',            category: 'behavioral', icon: '🔌' },
  { key: 'recharge_frequency',      label: 'Recharge Frequency',        min: 0,   max: 60,     step: 1,   unit: '/mo',              category: 'behavioral', icon: '📶' },
  { key: 'avg_recharge_amount',     label: 'Avg Recharge Amount',       min: 0,   max: 5000,   step: 10,  unit: '₹',                category: 'behavioral', icon: '💵' },
]

export const DEFAULTS: Record<string, number> = {
  credit_score: 650,
  late_payment_count: 3,
  account_age_months: 24,
  total_outstanding_debt: 20000,
  num_open_loans: 2,
  mobile_banking_logins: 20,
  debit_card_usage_frequency: 12,
  online_transfer_frequency: 8,
  utility_bill_payment_delay: 0,
  digital_payment_frequency: 15,
  shg_repayment_score: 65,
  recharge_frequency: 4,
  avg_recharge_amount: 250,
  debit_card_spending: 6000,
}

export const CATEGORY_COLORS = {
  financial:  { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', dot: '#8b5cf6' },
  digital:    { bg: 'bg-sky-500/10',    border: 'border-sky-500/20',    text: 'text-sky-400',    dot: '#38bdf8' },
  behavioral: { bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-400',  dot: '#fbbf24' },
}
