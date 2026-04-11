'use client'
import { useState } from 'react'
import ScoreGauge from './ScoreGauge'
import FeatureBars from './FeatureBars'
import InputField from './InputField'
import { FormData, PredictionResult } from './types'
import { FIELDS, DEFAULTS, CATEGORY_COLORS } from './fieldConfig'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const CATEGORIES = [
  { key: 'financial',  label: 'Financial Profile',  desc: 'Credit & debt history' },
  { key: 'digital',    label: 'Digital Footprint',  desc: 'Banking & payment activity' },
  { key: 'behavioral', label: 'Behavioral Signals', desc: 'Utility & mobile patterns' },
] as const

export default function Dashboard() {
  const [form, setForm] = useState<FormData>(DEFAULTS as unknown as FormData)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'financial' | 'digital' | 'behavioral'>('financial')

  const handleChange = (key: string, val: number) => {
    setForm(f => ({ ...f, [key]: val }))
  }

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data: PredictionResult = await res.json()
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Prediction failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(DEFAULTS as unknown as FormData)
    setResult(null)
    setError(null)
  }

  const tabFields = FIELDS.filter(f => f.category === activeTab)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 sticky top-0 z-20 backdrop-blur bg-[#0a0a0f]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <span className="text-rose-400 text-sm">◈</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-wide">CreditLens</h1>
              <p className="text-[10px] text-gray-500 leading-none mt-0.5">Financial Inclusion Scoring · Unbanked Women </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">Model Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        {/* LEFT — Inputs */}
        <div className="space-y-5">
          {/* Category Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map(cat => {
              const colors = CATEGORY_COLORS[cat.key]
              const count = FIELDS.filter(f => f.category === cat.key).length
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    activeTab === cat.key
                      ? `${colors.bg} ${colors.border} ring-1 ring-inset ${colors.border}`
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`text-xs font-semibold mb-0.5 ${activeTab === cat.key ? colors.text : 'text-gray-300'}`}>
                    {cat.label}
                  </div>
                  <div className="text-[10px] text-gray-500">{cat.desc}</div>
                  <div className={`text-lg font-bold mt-1 ${activeTab === cat.key ? colors.text : 'text-gray-600'}`}>
                    {count}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-up">
            {tabFields.map(field => (
              <InputField
                key={field.key}
                field={field}
                value={form[field.key]}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handlePredict}
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50
                text-white text-sm font-semibold tracking-wide transition-all
                active:scale-[0.98] shadow-lg shadow-rose-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analysing...
                </span>
              ) : '⚡ Run Risk Assessment'}
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-3.5 rounded-xl border border-white/10 text-gray-400
                hover:border-white/20 hover:text-white text-sm font-medium transition-all"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* RIGHT — Results */}
        <div className="space-y-4">
          {/* Score card */}
          <div className="rounded-2xl border border-white/8 bg-[#111118] p-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Risk Assessment
            </h2>
            {result ? (
              <div className="fade-up">
                <ScoreGauge
                  score={result.risk_score}
                  decision={result.decision}
                  confidence={result.confidence}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                  <span className="text-3xl opacity-30">◎</span>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  Fill in the applicant details<br />and run the assessment
                </p>
              </div>
            )}
          </div>

          {/* Feature importance */}
          {result && Object.keys(result.feature_contributions).some(k => result.feature_contributions[k] > 0) && (
            <div className="rounded-2xl border border-white/8 bg-[#111118] p-5 fade-up">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                Feature Importance
              </h2>
              <FeatureBars contributions={result.feature_contributions} />
            </div>
          )}

          {/* Summary stats */}
          {result && (
            <div className="grid grid-cols-2 gap-3 fade-up">
              {[
                { label: 'Risk Score',  value: `${result.risk_score.toFixed(1)}`, unit: '/ 100' },
                { label: 'Confidence', value: `${result.confidence.toFixed(1)}`, unit: '%' },
                { label: 'Risk Level', value: result.risk_level, unit: '' },
                { label: 'Decision',   value: result.decision,   unit: '' },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="text-[10px] text-gray-500 mb-1">{stat.label}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white">{stat.value}</span>
                    {stat.unit && <span className="text-xs text-gray-600">{stat.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Score Legend</p>
            <div className="space-y-2">
              {[
                { range: '0 – 34',   label: 'Low Risk',    action: 'Approve',       color: '#22c55e' },
                { range: '35 – 64',  label: 'Medium Risk', action: 'Manual Review', color: '#f59e0b' },
                { range: '65 – 100', label: 'High Risk',   action: 'Reject',        color: '#f43f5e' },
              ].map(l => (
                <div key={l.range} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                  <span className="text-xs text-gray-400 w-16 flex-shrink-0">{l.range}</span>
                  <span className="text-xs text-gray-500">{l.label} · {l.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
