interface MetricHintProps {
  label: string
  value: string
  hint: string
}

export function MetricHint({ label, value, hint }: MetricHintProps) {
  return (
    <div title={hint}>
      <p className="eyebrow">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="mt-0.5 text-[0.65rem] leading-snug text-[var(--muted)]">{hint}</p>
    </div>
  )
}
