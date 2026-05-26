import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { CyberPanel } from '@/components/layout/CyberPanel'
import { MetricHint } from '@/components/layout/MetricHint'
import { useLabStore } from '@/hooks/useLabStore'
import {
  formatAmps,
  formatOhms,
  formatVolts,
  formatWatts,
  solveDcCircuit,
} from '@/lib/physics/dcPower'

export function CircuitControls() {
  const voltage = useLabStore((s) => s.voltage)
  const resistance = useLabStore((s) => s.resistance)
  const setVoltage = useLabStore((s) => s.setVoltage)
  const setResistance = useLabStore((s) => s.setResistance)
  const applyCircuitPreset = useLabStore((s) => s.applyCircuitPreset)

  const { current, power } = solveDcCircuit(voltage, resistance)

  return (
    <CyberPanel
      eyebrow={'DC Circuits\n直流電路'}
      title={'Power Controls\n功率控制'}
      className="space-y-3 p-3 md:p-4"
    >
      <div className="grid grid-cols-2 gap-2 border-b border-[var(--border)] pb-3">
        <MetricHint
          compact
          label={'Voltage\n電壓'}
          value={formatVolts(voltage)}
          hint="Energy per unit charge from the battery. Drives the loop.\n電池提供的每單位電荷能量，驅動整個回路。"
        />
        <MetricHint
          compact
          label={'Resistance\n電阻'}
          value={formatOhms(resistance)}
          hint="Opposition to flow. Not the same as ‘how much wire’ — a thin wire can be low R too.\n對電流流動的阻礙。這不等於「線很長」；細線也可能有低電阻。"
        />
        <MetricHint
          compact
          label={'Current\n電流'}
          value={formatAmps(current)}
          hint={'Charge flow rate. I = V / R in this ideal model.\n電荷流率。在此理想模型中 I = V / R。'}
        />
        <MetricHint
          compact
          label={'Power\n功率'}
          value={formatWatts(power)}
          hint="Energy per second (heat/light/mechanical). P = V × I.\n每秒能量（熱／光／機械）。P = V × I。"
        />
      </div>

      <div>
        <p className="mb-1.5 whitespace-pre-line text-[0.65rem] font-medium uppercase tracking-wide text-[var(--silver)]">
          {'Example loads\n範例負載'}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <Button size="sm" variant="outline" className="h-auto py-1.5" onClick={() => applyCircuitPreset('led')}>
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">LED</span>
              <span className="block opacity-80">發光二極體</span>
            </span>
          </Button>
          <Button size="sm" variant="outline" className="h-auto py-1.5" onClick={() => applyCircuitPreset('heater')}>
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">Heater</span>
              <span className="block opacity-80">加熱器</span>
            </span>
          </Button>
          <Button size="sm" variant="outline" className="h-auto py-1.5" onClick={() => applyCircuitPreset('open')}>
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">High-R</span>
              <span className="block opacity-80">高電阻</span>
            </span>
          </Button>
        </div>
      </div>

      <div className="space-y-2.5 border-t border-[var(--border)] pt-3">
        <Label className="!normal-case !tracking-normal">{'Voltage V\n電壓 V'}</Label>
        <Slider
          min={1}
          max={120}
          step={0.5}
          value={[voltage]}
          onValueChange={([v]) => setVoltage(v)}
        />
        <Label className="!normal-case !tracking-normal">{'Resistance Ω\n電阻 Ω'}</Label>
        <Slider
          min={10}
          max={2000}
          step={10}
          value={[resistance]}
          onValueChange={([r]) => setResistance(r)}
        />
      </div>
    </CyberPanel>
  )
}
