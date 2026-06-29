import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HelpNoteProps {
  title?: string
  children: ReactNode
  className?: string
  variant?: 'default' | 'tip' | 'formula'
}

export function HelpNote({ title, children, className, variant = 'default' }: HelpNoteProps) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2.5 text-sm leading-relaxed',
        variant === 'tip' &&
          'border-[var(--accent)]/25 bg-[var(--accent-dim)] text-[var(--foreground)]',
        variant === 'formula' &&
          'border-[var(--border)] bg-black/25 font-mono text-xs text-[var(--silver)]',
        variant === 'default' &&
          'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]',
        className,
      )}
    >
      {title && (
        <p className="mb-1 whitespace-pre-line text-xs font-semibold uppercase tracking-[0.14em] text-[var(--silver)]">
          {title}
        </p>
      )}
      {children}
    </div>
  )
}
