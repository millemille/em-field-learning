import { useLabStore } from '@/hooks/useLabStore'
import { cn } from '@/lib/utils'

const items = {
  field: [
    { color: 'bg-[var(--positive)]', label: 'Positive charge / 正電荷' },
    { color: 'bg-[var(--negative)]', label: 'Negative charge / 負電荷' },
    { color: 'bg-[var(--accent)]', label: 'E-field arrows / 電場箭頭' },
    { color: 'bg-[#ffe566]', label: 'Test charge & force / 測試電荷與受力' },
  ],
  circuit: [
    { color: 'bg-[var(--accent)]', label: 'Electrons (flow ∝ I) / 電子（流速 ∝ I）' },
    { color: 'bg-[#ff6b4a]', label: 'Resistor heat (∝ P) / 電阻熱（∝ P）' },
    { color: 'bg-[#2a3344] border border-[var(--silver)]', label: 'Battery / 電池' },
  ],
} as const

export function VisualLegend() {
  const activeTab = useLabStore((s) => s.activeTab)
  const legend = items[activeTab]

  return (
    <div
      className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[200px] rounded-lg border border-[var(--border)] bg-black/55 px-2.5 py-2 backdrop-blur-sm"
      aria-label="Visualization legend / 視覺圖例"
    >
      <p className="eyebrow mb-1.5">Legend / 圖例</p>
      <ul className="space-y-1">
        {legend.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-[0.7rem] text-[var(--muted)]">
            <span className={cn('h-2 w-2 shrink-0 rounded-full', item.color)} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
