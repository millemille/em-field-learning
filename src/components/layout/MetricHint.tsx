interface MetricHintProps {
  label: string
  value: string
  hint: string
  compact?: boolean
}

export function MetricHint({ label, value, hint, compact = false }: MetricHintProps) {
  return (
    <div title={hint} className="min-w-0">
      <p className="eyebrow whitespace-pre-line leading-tight">{label}</p>
      <p className="metric-value text-base whitespace-pre-line leading-tight">{value}</p>
      {!compact && (
        <p className="mt-0.5 whitespace-pre-line text-[0.65rem] leading-snug text-[var(--muted)]">
          {hint}
        </p>
      )}
    </div>
  )
}
