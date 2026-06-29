import { useState } from 'react'
import { useLabStore } from '@/hooks/useLabStore'
import { cn } from '@/lib/utils'

const items = {
  field: [
    { color: 'bg-[var(--positive)]', label: 'Positive charge / 正電荷' },
    { color: 'bg-[var(--negative)]', label: 'Negative charge / 負電荷' },
    { color: 'bg-[var(--accent)]', label: 'E-field arrows / 電場箭頭' },
    { color: 'bg-[#e8c87a]', label: 'Test charge & force / 測試電荷與受力' },
  ],
  circuit: [
    { color: 'bg-[var(--accent)]', label: 'Electrons (flow ∝ I) / 電子（流速 ∝ I）' },
    { color: 'bg-[#ff6b4a]', label: 'Resistor heat (∝ P) / 電阻熱（∝ P）' },
    { color: 'bg-[#2a3344] border border-[var(--silver)]', label: 'Battery / 電池' },
  ],
  solar: [
    { color: 'bg-[#ffcc44]', label: 'Sun (size not to scale) / 太陽（大小非比例）' },
    { color: 'bg-[var(--accent)]', label: 'Planets & Moon / 行星與月球' },
    { color: 'bg-[#8b7a68]', label: 'Asteroid belt / 小行星帶' },
    { color: 'bg-[#f0f4fc] border border-[var(--silver)]', label: 'Focus label / 選中天體名稱' },
    { color: 'bg-[var(--accent)]/40 border border-[var(--accent)]', label: 'Orbit paths (toggle) / 軌道（可切換）' },
  ],
} as const

export function VisualLegend() {
  const activeTab = useLabStore((s) => s.activeTab)
  const legend = items[activeTab]
  const [open, setOpen] = useState(true)

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={cn(
        'absolute bottom-3 left-3 z-10 max-w-[200px] rounded-lg border border-[var(--border)] bg-[var(--surface)] text-left backdrop-blur-sm',
        'cursor-pointer transition-colors hover:border-[var(--border-accent)]',
        open ? 'px-2.5 py-2' : 'px-2.5 py-1.5',
      )}
      aria-expanded={open}
      aria-label={open ? 'Hide legend / 隱藏圖例' : 'Show legend / 顯示圖例'}
    >
      <p className="eyebrow mb-0 flex items-center justify-between gap-2">
        <span>Legend / 圖例</span>
        <span className="text-[0.65rem] text-[var(--muted)]" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </p>
      {open && (
        <ul className="mt-1.5 space-y-1">
          {legend.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-[0.7rem] text-[var(--muted)]">
              <span className={cn('h-2 w-2 shrink-0 rounded-full', item.color)} />
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </button>
  )
}
