import { HelpNote } from '@/components/layout/HelpNote'
import { useLabStore } from '@/hooks/useLabStore'

export function LabGuide() {
  const activeTab = useLabStore((s) => s.activeTab)

  if (activeTab === 'field') {
    return (
      <div className="mb-4 space-y-3">
        <HelpNote title="What this lab shows">
          Two point charges sit in space (green = positive, pink = negative). They create an{' '}
          <strong className="text-[var(--foreground)]">electric field</strong> everywhere around
          them — shown as cyan arrows. The thin silver curves are{' '}
          <strong className="text-[var(--foreground)]">field lines</strong>: the direction a tiny
          positive test charge would be pushed. The yellow sphere is your{' '}
          <strong className="text-[var(--foreground)]">test charge</strong>; the yellow arrow is the{' '}
          <strong className="text-[var(--foreground)]">force</strong> on it.
        </HelpNote>
        <HelpNote title="Try this" variant="tip">
          Start with <strong>Dipole</strong>, then switch to <strong>Repel</strong> and{' '}
          <strong>Attract</strong>. Watch how field lines bend between opposite charges and push
          apart for like charges. Move the test charge closer to a source — |E| and |F| grow
          quickly (Coulomb&apos;s law falls off with distance squared).
        </HelpNote>
        <p className="text-xs text-[var(--muted)]">
          Drag with mouse to orbit · scroll to zoom · readouts update as you move sliders
        </p>
      </div>
    )
  }

  return (
    <div className="mb-4 space-y-3">
      <HelpNote title="What this lab shows">
        A simple <strong className="text-[var(--foreground)]">DC (direct current)</strong> loop:
        battery → wires → resistor → back to battery. Cyan dots are electrons drifting along the
        wire; their speed reflects current. The resistor glows brighter when it dissipates more{' '}
        <strong className="text-[var(--foreground)]">power</strong> (energy per second).
      </HelpNote>
      <HelpNote title="Try this" variant="tip">
        Raise voltage with resistance fixed — current and power both increase. Raise resistance
        with voltage fixed — current drops. Compare <strong>LED</strong> (low voltage, moderate R)
        vs <strong>Heater</strong> (high power). <strong>High-R</strong> is like almost no current
        flowing.
      </HelpNote>
      <HelpNote variant="formula">
        Ohm&apos;s law: I = V / R &nbsp;·&nbsp; Power: P = V × I = V² / R
      </HelpNote>
    </div>
  )
}
