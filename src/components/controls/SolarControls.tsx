import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { CyberPanel } from '@/components/layout/CyberPanel'
import { MetricHint } from '@/components/layout/MetricHint'
import { useLabStore } from '@/hooks/useLabStore'
import { PLANETS, formatOrbitalPeriodYears, getPlanetById } from '@/lib/physics/orbits'

export function SolarControls() {
  const timeScale = useLabStore((s) => s.solarTimeScale)
  const showOrbits = useLabStore((s) => s.solarShowOrbits)
  const focusId = useLabStore((s) => s.solarFocusId)
  const setTimeScale = useLabStore((s) => s.setSolarTimeScale)
  const setShowOrbits = useLabStore((s) => s.setSolarShowOrbits)
  const setFocusId = useLabStore((s) => s.setSolarFocusId)
  const applySolarPreset = useLabStore((s) => s.applySolarPreset)

  const focus =
    focusId === null
      ? null
      : focusId === 'sun'
        ? { name: 'Sun', nameZh: '太陽', orbitalPeriodYears: null as number | null }
        : getPlanetById(focusId)

  const periodLabel =
    focusId === null
      ? '—'
      : focus && focus.orbitalPeriodYears != null
        ? formatOrbitalPeriodYears(focus.orbitalPeriodYears)
        : '—'

  return (
    <CyberPanel
      eyebrow={'Solar System\n太陽系'}
      title={'Orbit Controls\n軌道控制'}
      className="space-y-3 p-3 md:p-4"
    >
      <div className="grid grid-cols-2 gap-2 border-b border-[var(--border)] pb-3">
        <MetricHint
          compact
          label={'Time scale\n時間倍率'}
          value={`${timeScale.toFixed(1)}×`}
          hint="Speeds up or slows all orbital and spin motion together.\n同時加快或減慢所有公轉與自轉。"
        />
        <MetricHint
          compact
          label={'Focus body\n觀察天體'}
          value={focus ? `${focus.name} / ${focus.nameZh}` : '—'}
          hint="Camera tracks this body; its name appears in the 3D view when selected.\n相機會跟隨此天體；選中時 3D 視圖會顯示名稱。"
        />
        <MetricHint
          compact
          label={'Orbital period\n公轉週期'}
          value={periodLabel}
          hint="Sidereal period at this body's mean distance (Earth years or converted).\n該天體平均距離下的恆星週期。"
        />
        <MetricHint
          compact
          label={'Trajectories\n軌跡'}
          value={showOrbits ? 'On / 開' : 'Off / 關'}
          hint="Show or hide circular orbit paths in the ecliptic plane.\n顯示或隱藏黃道面上的圓形軌道。"
        />
      </div>

      <div>
        <p className="mb-1.5 whitespace-pre-line text-[0.65rem] font-medium uppercase tracking-wide text-[var(--silver)]">
          {'Quick views\n快速視角'}
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          <Button
            size="sm"
            variant={focusId === null ? 'default' : 'outline'}
            className="h-auto py-1.5"
            onClick={() => applySolarPreset('overview')}
          >
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">Full system</span>
              <span className="block opacity-80">全覽</span>
            </span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-auto py-1.5"
            onClick={() => applySolarPreset('earth')}
          >
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">Earth–Moon</span>
              <span className="block opacity-80">地月</span>
            </span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-auto py-1.5"
            onClick={() => applySolarPreset('inner')}
          >
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">Inner</span>
              <span className="block opacity-80">內行星</span>
            </span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-auto py-1.5"
            onClick={() => applySolarPreset('outer')}
          >
            <span className="text-center text-[0.7rem] leading-tight">
              <span className="block">Outer</span>
              <span className="block opacity-80">外行星</span>
            </span>
          </Button>
        </div>
      </div>

      <div className="space-y-2 border-t border-[var(--border)] pt-3">
        <Label className="!normal-case !tracking-normal">{'Simulation speed\n模擬速度'}</Label>
        <Slider
          min={0.1}
          max={4}
          step={0.1}
          value={[timeScale]}
          onValueChange={([v]) => setTimeScale(v)}
        />
      </div>

      <div className="space-y-2 border-t border-[var(--border)] pt-3">
        <Label className="!normal-case !tracking-normal">{'Focus body\n觀察天體'}</Label>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={focusId === null ? 'default' : 'outline'}
            className="h-7 px-2 text-[0.65rem]"
            onClick={() => setFocusId(null)}
          >
            None
          </Button>
          <Button
            size="sm"
            variant={focusId === 'sun' ? 'default' : 'outline'}
            className="h-7 px-2 text-[0.65rem]"
            onClick={() => setFocusId(focusId === 'sun' ? null : 'sun')}
          >
            Sun
          </Button>
          {PLANETS.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant={focusId === p.id ? 'default' : 'outline'}
              className="h-7 px-2 text-[0.65rem]"
              onClick={() => setFocusId(focusId === p.id ? null : p.id)}
            >
              {p.name}
            </Button>
          ))}
        </div>
        <p className="text-[0.65rem] text-[var(--muted)]">
          {'None or drag/zoom releases focus — view stays where you left it.\n無或拖曳/縮放會取消聚焦，視角維持不變。'}
        </p>
      </div>

      <div className="border-t border-[var(--border)] pt-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={showOrbits}
            onChange={(e) => setShowOrbits(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
          />
          <span className="whitespace-pre-line leading-snug">
            {'Show orbit trajectories\n顯示軌道軌跡'}
          </span>
        </label>
      </div>
    </CyberPanel>
  )
}
