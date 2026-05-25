import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { CyberPanel } from '@/components/layout/CyberPanel'
import { HelpNote } from '@/components/layout/HelpNote'
import { MetricHint } from '@/components/layout/MetricHint'
import { useLabStore } from '@/hooks/useLabStore'
import { formatNum } from '@/lib/utils'

function ControlHint({ text }: { text: string }) {
  return <p className="text-xs leading-snug text-[var(--muted)]">{text}</p>
}

export function ChargeControls() {
  const charges = useLabStore((s) => s.charges)
  const testChargeQ = useLabStore((s) => s.testChargeQ)
  const testPos = useLabStore((s) => s.testPos)
  const metrics = useLabStore((s) => s.fieldMetrics)
  const setChargeQ = useLabStore((s) => s.setChargeQ)
  const setChargeX = useLabStore((s) => s.setChargeX)
  const setTestChargeQ = useLabStore((s) => s.setTestChargeQ)
  const setTestPosX = useLabStore((s) => s.setTestPosX)
  const setTestPosZ = useLabStore((s) => s.setTestPosZ)
  const applyChargePreset = useLabStore((s) => s.applyChargePreset)

  const [a, b] = charges

  return (
    <CyberPanel eyebrow="Electrostatics" title="Field Controls" className="space-y-4">
      <HelpNote>
        Adjust source charges and the test charge. Positive µC values are green; negative are pink.
        Field lines show where a small + charge would drift.
      </HelpNote>

      <div>
        <p className="mb-2 text-xs font-medium text-[var(--silver)]">Quick scenarios</p>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={() => applyChargePreset('dipole')}>
            Dipole
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyChargePreset('repel')}>
            Repel
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyChargePreset('attract')}>
            Attract
          </Button>
        </div>
        <ControlHint text="Dipole: + and − pair. Repel: both +. Attract: opposite signs pulled together." />
      </div>

      <div className="space-y-3 border-t border-[var(--border)] pt-3">
        <p className="text-xs font-medium text-[var(--silver)]">Source charges</p>
        <Label>Charge A — amount q (µC)</Label>
        <Slider
          min={-8}
          max={8}
          step={0.1}
          value={[a.q * 1e6]}
          onValueChange={([v]) => setChargeQ('a', v * 1e-6)}
        />
        <ControlHint text="Sign = type (+/−). Larger magnitude → stronger field and longer arrows." />
        <Label>Charge A — position X (m)</Label>
        <Slider
          min={-5}
          max={-0.5}
          step={0.1}
          value={[a.x]}
          onValueChange={([v]) => setChargeX('a', v)}
        />
        <ControlHint text="Slide left/right to change separation between the two sources." />
      </div>

      <div className="space-y-3 border-t border-[var(--border)] pt-3">
        <Label>Charge B — amount q (µC)</Label>
        <Slider
          min={-8}
          max={8}
          step={0.1}
          value={[b.q * 1e6]}
          onValueChange={([v]) => setChargeQ('b', v * 1e-6)}
        />
        <Label>Charge B — position X (m)</Label>
        <Slider
          min={0.5}
          max={5}
          step={0.1}
          value={[b.x]}
          onValueChange={([v]) => setChargeX('b', v)}
        />
      </div>

      <div className="space-y-3 border-t border-[var(--border)] pt-3">
        <p className="text-xs font-medium text-[var(--silver)]">Test charge (probe)</p>
        <Label>Test charge q (µC)</Label>
        <Slider
          min={0.1}
          max={5}
          step={0.1}
          value={[testChargeQ * 1e-6]}
          onValueChange={([v]) => setTestChargeQ(v * 1e-6)}
        />
        <ControlHint text="Only scales |F|, not the field pattern. Double q → double force." />
        <Label>Test position X (m)</Label>
        <Slider
          min={-4}
          max={4}
          step={0.1}
          value={[testPos.x]}
          onValueChange={([v]) => setTestPosX(v)}
        />
        <Label>Test position Z (m) — height above plane</Label>
        <Slider
          min={0.5}
          max={5}
          step={0.1}
          value={[testPos.z]}
          onValueChange={([v]) => setTestPosZ(v)}
        />
        <ControlHint text="Move the yellow sphere into stronger/weaker regions of the field." />
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-[var(--border)] pt-3 sm:grid-cols-2">
        <MetricHint
          label="|E| at test"
          value={`${formatNum(metrics.fieldMagnitude)} N/C`}
          hint="Field strength at the test point. Grows when you move closer to a charge."
        />
        <MetricHint
          label="|F| on test"
          value={`${formatNum(metrics.forceMagnitude, 3)} N`}
          hint="Force on the test charge: F = q × E."
        />
        <MetricHint
          label="Separation"
          value={`${formatNum(metrics.chargeDistance, 1)} m`}
          hint="Distance between A and B. Wider spacing weakens the field between them."
        />
        <MetricHint
          label="Interaction"
          value={metrics.interaction}
          hint="Like charges repel; opposite charges attract."
        />
      </div>
    </CyberPanel>
  )
}
