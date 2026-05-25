import { HelpNote } from '@/components/layout/HelpNote'

export function HeroIntro() {
  return (
    <header className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <p className="eyebrow mb-2">Electromagnetism · Interactive Lab</p>
      <h1 className="font-display mb-4 text-3xl font-bold tracking-tight text-[var(--silver)] md:text-4xl">
        EM Field Lab
      </h1>
      <div className="space-y-4 text-[var(--muted)]">
        <p>
          <strong className="text-[var(--foreground)]">Electromagnetism</strong> describes how
          electric charges and currents produce forces and energy in space. You do not have to see
          charges move to feel the effect — a charged balloon can attract your hair because it
          reshapes the electric field around you.
        </p>
        <p>
          This page is built for <strong className="text-[var(--foreground)]">beginners and
          intermediate learners</strong>. Each lab links a concept to something you can see: field
          arrows for <span className="font-mono text-[var(--accent)]">E</span>, a force arrow for{' '}
          <span className="font-mono text-[var(--accent)]">F = qE</span>, and glowing components
          for power <span className="font-mono text-[var(--accent)]">P = IV</span> in a DC circuit.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <HelpNote title="Electric field (E)">
          Think of <strong className="text-[var(--foreground)]">E</strong> as the push per unit
          charge at each point in space. Stronger field → longer cyan arrows in the lab. Units:
          newtons per coulomb (N/C), same as volts per meter (V/m).
        </HelpNote>
        <HelpNote title="Force on a charge (F)">
          A charge <strong className="text-[var(--foreground)]">q</strong> in a field feels{' '}
          <span className="font-mono text-[var(--accent)]">F = qE</span>. Same direction as E for
          positive q, opposite for negative. Move the yellow test charge to see |F| change.
        </HelpNote>
        <HelpNote title="Current & resistance">
          In wires, <strong className="text-[var(--foreground)]">voltage</strong> (V) drives{' '}
          <strong className="text-[var(--foreground)]">current</strong> (I, amps).{' '}
          <strong className="text-[var(--foreground)]">Resistance</strong> (Ω) limits flow: more R
          → less I for the same battery.
        </HelpNote>
        <HelpNote title="Power (P)">
          <strong className="text-[var(--foreground)]">Power</strong> is energy per second (watts).
          In the circuit lab, <span className="font-mono text-[var(--accent)]">P = V × I</span>.
          That energy often becomes heat in the resistor — watch the glow increase with P.
        </HelpNote>
      </div>

      <p className="mt-6 text-sm opacity-80">
        Models here are idealized (point charges, perfect resistor, no battery internal loss).
        Use sliders and presets, orbit the 3D view with your mouse, and read the panel hints beside
        each control.
      </p>
    </header>
  )
}
