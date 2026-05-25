import { useLabStore } from '@/hooks/useLabStore'
import { cn } from '@/lib/utils'

const items = {
  field: [
    { color: 'bg-[var(--positive)]', label: 'Positive charge' },
    { color: 'bg-[var(--negative)]', label: 'Negative charge' },
    { color: 'bg-[var(--accent)]', label: 'E-field arrows' },
    { color: 'bg-[#ffe566]', label: 'Test charge & force' },
  ],
  circuit: [
    { color: 'bg-[var(--accent)]', label: 'Electrons (flow ∝ I)' },
    { color: 'bg-[#ff6b4a]', label: 'Resistor heat (∝ P)' },
    { color: 'bg-[#2a3344] border border-[var(--silver)]', label: 'Battery' },
  ],
} as const

export function VisualLegend() {
  const activeTab = useLabStore((s) => s.activeTab)
  const legend = items[activeTab]

  return (
    <div
      className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[200px] rounded-lg border border-[var(--border)] bg-black/55 px-2.5 py-2 backdrop-blur-sm"
      aria-label="Visualization legend"
    >
      <p className="eyebrow mb-1.5">Legend</p>
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
