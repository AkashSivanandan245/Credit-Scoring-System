'use client'
import { FieldConfig } from './types'
import { CATEGORY_COLORS } from './fieldConfig'

interface Props {
  field: FieldConfig
  value: number
  onChange: (key: string, val: number) => void
}

export default function InputField({ field, value, onChange }: Props) {
  const colors = CATEGORY_COLORS[field.category]
  const pct = ((value - field.min) / (field.max - field.min)) * 100

  return (
    <div className={`rounded-xl border p-3.5 transition-all hover:border-opacity-50 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{field.icon}</span>
          <span className={`text-xs font-medium ${colors.text}`}>{field.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
            value={value}
            onChange={e => onChange(field.key, parseFloat(e.target.value) || 0)}
            className="w-24 text-right text-sm font-mono bg-[#0a0a0f]/60 border border-white/10
              rounded-lg px-2 py-1 text-white outline-none focus:border-white/30 transition"
          />
          {field.unit && <span className="text-xs text-gray-500 whitespace-nowrap">{field.unit}</span>}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={e => onChange(field.key, parseFloat(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, ${colors.dot} ${pct}%, #1e1e2e ${pct}%)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-600">{field.min}</span>
        <span className="text-[10px] text-gray-600">{field.max}</span>
      </div>
    </div>
  )
}
