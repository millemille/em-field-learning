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
      {eyebrow && <p className="eyebrow mb-1 whitespace-pre-line">{eyebrow}</p>}
      {title && (
        <h3 className="font-display mb-2 whitespace-pre-line text-base font-semibold tracking-tight text-[var(--silver)] md:text-lg">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
