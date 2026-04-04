'use client'
import { useEffect, useRef } from 'react'

interface Props { score: number; decision: string; confidence: number }

const COLORS = { Low: '#22c55e', Medium: '#f59e0b', High: '#f43f5e' }
const LABELS = { Low: 'Low Risk', Medium: 'Medium Risk', High: 'High Risk' }

export default function ScoreGauge({ score, decision, confidence }: Props) {
  const arcRef = useRef<SVGCircleElement>(null)

  const r = 70
  const circ = 2 * Math.PI * r
  const pct = score / 100
  const offset = circ * (1 - pct * 0.75)   // 270° arc (0.75 of full circle)
  const color = score < 30 ? COLORS.Low : score < 70 ? COLORS.Medium : COLORS.High
  const levelKey = score < 30 ? 'Low' : score < 70 ? 'Medium' : 'High'

  useEffect(() => {
    if (!arcRef.current) return
    arcRef.current.style.setProperty('--target-offset', `${offset}`)
    arcRef.current.style.strokeDashoffset = `${circ}`
    void arcRef.current.getBoundingClientRect()
    arcRef.current.classList.add('score-arc')
  }, [score, offset, circ])

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="180" height="160" viewBox="0 0 180 160">
        {/* Track */}
        <circle
          cx="90" cy="100" r={r}
          fill="none" stroke="#1e1e2e" strokeWidth="12"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
          transform="rotate(-225 90 100)"
        />
        {/* Fill */}
        <circle
          ref={arcRef}
          cx="90" cy="100" r={r}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
          transform="rotate(-225 90 100)"
          style={{ transition: 'stroke 0.4s', filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
        {/* Score text */}
        <text x="90" y="92" textAnchor="middle" fill={color}
          style={{ fontFamily: 'var(--font-sora)', fontSize: '32px', fontWeight: 700 }}>
          {Math.round(score)}
        </text>
        <text x="90" y="112" textAnchor="middle" fill="#6b7280"
          style={{ fontFamily: 'var(--font-sora)', fontSize: '11px', fontWeight: 400 }}>
          RISK SCORE
        </text>
      </svg>

      {/* Decision badge */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium px-4 py-1.5 rounded-full border"
          style={{ color, borderColor: color + '40', background: color + '15' }}>
          {LABELS[levelKey]}
        </span>
        <span className="text-xs text-gray-500">
          {confidence.toFixed(1)}% confidence
        </span>
      </div>

      {/* Decision chip */}
      <div className={`w-full text-center py-3 rounded-xl font-semibold text-sm tracking-wide
        ${decision === 'Approve' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          decision === 'Review'  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                   'bg-rose-500/10  text-rose-400  border border-rose-500/20'}`}>
        {decision === 'Approve' ? '✓ Recommend Approve' :
         decision === 'Review'  ? '⚡ Manual Review Required' :
                                  '✕ Recommend Reject'}
      </div>
    </div>
  )
}
