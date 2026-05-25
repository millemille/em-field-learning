import { cn } from '@/lib/utils'

interface CyberPanelProps {
  title?: string
  eyebrow?: string
  className?: string
  children: React.ReactNode
}

export function CyberPanel({ title, eyebrow, className, children }: CyberPanelProps) {
  return (
    <div className={cn('cyber-glass rounded-2xl p-4 md:p-5', className)}>
      {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
      {title && (
        <h3 className="font-display mb-3 text-lg font-semibold tracking-tight text-[var(--silver)]">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
