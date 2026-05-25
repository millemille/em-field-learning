import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { CyberPanel } from '@/components/layout/CyberPanel'
import { HelpNote } from '@/components/layout/HelpNote'
import { MetricHint } from '@/components/layout/MetricHint'
import { useLabStore } from '@/hooks/useLabStore'
import {
  formatAmps,
  formatOhms,
  formatVolts,
  formatWatts,
  solveDcCircuit,
} from '@/lib/physics/dcPower'

function ControlHint({ text }: { text: string }) {
  return <p className="text-xs leading-snug text-[var(--muted)]">{text}</p>
}

export function CircuitControls() {
  const voltage = useLabStore((s) => s.voltage)
  const resistance = useLabStore((s) => s.resistance)
  const setVoltage = useLabStore((s) => s.setVoltage)
  const setResistance = useLabStore((s) => s.setResistance)
  const applyCircuitPreset = useLabStore((s) => s.applyCircuitPreset)

  const { current, power } = solveDcCircuit(voltage, resistance)

  return (
    <CyberPanel eyebrow="DC Circuits" title="Power Controls" className="space-y-4">
      <HelpNote>
        A battery provides voltage (electrical &quot;pressure&quot;). Current is how much charge
        flows per second. Resistance opposes flow. Power tells you how fast energy is used — here,
        mostly as heat in the resistor.
      </HelpNote>

      <div>
        <p className="mb-2 text-xs font-medium text-[var(--silver)]">Example loads</p>
        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" variant="outline" onClick={() => applyCircuitPreset('led')}>
            LED
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyCircuitPreset('heater')}>
            Heater
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyCircuitPreset('open')}>
            High-R
          </Button>
        </div>
        <ControlHint text="LED: low V, modest R. Heater: high power (bright glow). High-R: tiny current." />
      </div>

      <div className="space-y-3 border-t border-[var(--border)] pt-3">
        <Label>Voltage V — battery push</Label>
        <Slider
          min={1}
          max={120}
          step={0.5}
          value={[voltage]}
          onValueChange={([v]) => setVoltage(v)}
        />
        <ControlHint text="Higher V → more current if R stays the same. Think of turning up water pressure." />

        <Label>Resistance Ω — how hard the load fights current</Label>
        <Slider
          min={10}
          max={2000}
          step={10}
          value={[resistance]}
          onValueChange={([r]) => setResistance(r)}
        />
        <ControlHint text="Higher R → less current for the same V. Electron dots move slower in the wire." />
      </div>

      <HelpNote title="What to watch in the 3D view" variant="tip">
        Electron speed tracks current. Resistor glow tracks power. If you double V but keep R, I
        doubles and P roughly quadruples (P = V²/R).
      </HelpNote>

      <div className="grid grid-cols-1 gap-3 border-t border-[var(--border)] pt-3 sm:grid-cols-2">
        <MetricHint
          label="Voltage"
          value={formatVolts(voltage)}
          hint="Energy per unit charge from the battery. Drives the loop."
        />
        <MetricHint
          label="Resistance"
          value={formatOhms(resistance)}
          hint="Opposition to flow. Not the same as ‘how much wire’ — a thin wire can be low R too."
        />
        <MetricHint
          label="Current"
          value={formatAmps(current)}
          hint="Charge flow rate. I = V / R in this ideal model."
        />
        <MetricHint
          label="Power"
          value={formatWatts(power)}
          hint="Energy per second (heat/light/mechanical). P = V × I."
        />
      </div>
    </CyberPanel>
  )
}
