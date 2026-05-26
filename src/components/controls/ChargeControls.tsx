import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { CyberPanel } from '@/components/layout/CyberPanel'
import { MetricHint } from '@/components/layout/MetricHint'
import { useLabStore } from '@/hooks/useLabStore'
import { formatNum } from '@/lib/utils'

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
    <CyberPanel
      eyebrow={'Electrostatics\n靜電學'}
      title={'Field Controls\n電場控制'}
      className="space-y-3 p-3 md:p-4"
    >
      <div className="grid grid-cols-2 gap-2 border-b border-[var(--border)] pb-3">
        <MetricHint
          compact
          label={'|E| at test\n測試點 |E|'}
          value={`${formatNum(metrics.fieldMagnitude)} N/C`}
          hint="Field strength at the test point. Grows when you move closer to a charge.\n測試點的場強。越靠近電荷，數值越大。"
        />
        <MetricHint
          compact
          label={'|F| on test\n測試受力 |F|'}
          value={`${formatNum(metrics.forceMagnitude, 3)} N`}
          hint={'Force on the test charge: F = q × E.\n測試電荷受力：F = q × E。'}
        />
        <MetricHint
          compact
          label={'Separation\n間距'}
          value={`${formatNum(metrics.chargeDistance, 1)} m`}
          hint="Distance between A and B. Wider spacing weakens the field between them.\nA 與 B 之間的距離。越分開，中間區域的場越弱。"
        />
        <MetricHint
          compact
          label={'Interaction\n交互作用'}
          value={metrics.interaction}
          hint="Like charges repel; opposite charges attract.\n同號相斥，異號相吸。"
        />
      </div>

      <div>
        <p className="mb-1.5 whitespace-pre-line text-[0.65rem] font-medium uppercase tracking-wide text-[var(--silver)]">
          {'Quick scenarios\n快速情境'}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <Button size="sm" variant="outline" className="h-auto py-1.5" onClick={() => applyChargePreset('dipole')}>
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">Dipole</span>
              <span className="block opacity-80">偶極</span>
            </span>
          </Button>
          <Button size="sm" variant="outline" className="h-auto py-1.5" onClick={() => applyChargePreset('repel')}>
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">Repel</span>
              <span className="block opacity-80">排斥</span>
            </span>
          </Button>
          <Button size="sm" variant="outline" className="h-auto py-1.5" onClick={() => applyChargePreset('attract')}>
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">Attract</span>
              <span className="block opacity-80">吸引</span>
            </span>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 border-t border-[var(--border)] pt-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-[0.65rem] font-medium uppercase tracking-wide text-[var(--silver)]">
            Charge A / 電荷 A
          </p>
          <Label className="!normal-case !tracking-normal">{'q (µC)\n電量'}</Label>
          <Slider
            min={-8}
            max={8}
            step={0.1}
            value={[a.q * 1e6]}
            onValueChange={([v]) => setChargeQ('a', v * 1e-6)}
          />
          <Label className="!normal-case !tracking-normal">{'X (m)\n位置'}</Label>
          <Slider
            min={-5}
            max={-0.5}
            step={0.1}
            value={[a.x]}
            onValueChange={([v]) => setChargeX('a', v)}
          />
        </div>
        <div className="space-y-2">
          <p className="text-[0.65rem] font-medium uppercase tracking-wide text-[var(--silver)]">
            Charge B / 電荷 B
          </p>
          <Label className="!normal-case !tracking-normal">{'q (µC)\n電量'}</Label>
          <Slider
            min={-8}
            max={8}
            step={0.1}
            value={[b.q * 1e6]}
            onValueChange={([v]) => setChargeQ('b', v * 1e-6)}
          />
          <Label className="!normal-case !tracking-normal">{'X (m)\n位置'}</Label>
          <Slider
            min={0.5}
            max={5}
            step={0.1}
            value={[b.x]}
            onValueChange={([v]) => setChargeX('b', v)}
          />
        </div>
      </div>

      <div className="space-y-2 border-t border-[var(--border)] pt-3">
        <p className="whitespace-pre-line text-[0.65rem] font-medium uppercase tracking-wide text-[var(--silver)]">
          {'Test charge\n測試電荷'}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="!normal-case !tracking-normal">{'q (µC)\n電量'}</Label>
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={[testChargeQ * 1e6]}
              onValueChange={([v]) => setTestChargeQ(v * 1e-6)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="!normal-case !tracking-normal">{'X (m)\n位置'}</Label>
            <Slider
              min={-4}
              max={4}
              step={0.1}
              value={[testPos.x]}
              onValueChange={([v]) => setTestPosX(v)}
            />
          </div>
        </div>
        <Label className="!normal-case !tracking-normal">{'Z height (m)\n高度 Z'}</Label>
        <Slider
          min={0.5}
          max={5}
          step={0.1}
          value={[testPos.z]}
          onValueChange={([v]) => setTestPosZ(v)}
        />
      </div>
    </CyberPanel>
  )
}
