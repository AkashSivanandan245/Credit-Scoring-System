'use client'

interface Props {
  contributions: Record<string, number>
}

const LABELS: Record<string, string> = {
  credit_score: 'Credit Score',
  late_payment_count: 'Late Payments',
  account_age_months: 'Account Age',
  total_outstanding_debt: 'Outstanding Debt',
  num_open_loans: 'Open Loans',
  mobile_banking_logins: 'Mobile Logins',
  debit_card_usage_frequency: 'Debit Usage',
  online_transfer_frequency: 'Online Transfers',
  utility_bill_payment_delay: 'Utility Delay',
  digital_payment_frequency: 'Digital Payments',
  shg_repayment_score: 'SHG Score',
  recharge_frequency: 'Recharge Freq.',
  avg_recharge_amount: 'Avg Recharge',
  debit_card_spending: 'Card Spending',
}

export default function FeatureBars({ contributions }: Props) {
  const sorted = Object.entries(contributions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const max = sorted[0]?.[1] || 1

  return (
    <div className="space-y-3">
      {sorted.map(([key, val], i) => (
        <div key={key} className="group">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">{LABELS[key] || key}</span>
            <span className="text-xs font-mono text-gray-500">{val.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(val / max) * 100}%`,
                background: `hsl(${270 - i * 20}, 70%, 60%)`,
                transitionDelay: `${i * 60}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
