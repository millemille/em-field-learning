import { HelpNote } from '@/components/layout/HelpNote'
import { useLabStore } from '@/hooks/useLabStore'
import { cn } from '@/lib/utils'

interface LabGuideProps {
  className?: string
}

export function LabGuide({ className }: LabGuideProps) {
  const activeTab = useLabStore((s) => s.activeTab)

  const fieldContent = (
    <>
      <HelpNote title={'What this lab shows\n這個實驗在展示什麼'}>
        Two point charges sit in space (green = positive, pink = negative). They create an{' '}
        <strong className="text-[var(--foreground)]">electric field</strong> everywhere around
        them — shown as cyan arrows. The thin silver curves are{' '}
        <strong className="text-[var(--foreground)]">field lines</strong>: the direction a tiny
        positive test charge would be pushed. The yellow sphere is your{' '}
        <strong className="text-[var(--foreground)]">test charge</strong>; the yellow arrow is the{' '}
        <strong className="text-[var(--foreground)]">force</strong> on it. <br />
        空間中有兩個點電荷（綠色為正、粉色為負），
        它們會在周圍形成<strong className="text-[var(--foreground)]">電場</strong>，以青色箭頭顯示。細銀色曲線是
        <strong className="text-[var(--foreground)]">場線</strong>，表示微小正測試電荷會被推動的方向。黃色球是你的
        <strong className="text-[var(--foreground)]">測試電荷</strong>；黃色箭頭是它受到的
        <strong className="text-[var(--foreground)]">力</strong>。
      </HelpNote>
      <HelpNote title={'Try this\n試試看'} variant="tip">
        Start with <strong>Dipole</strong>, then switch to <strong>Repel</strong> and{' '}
        <strong>Attract</strong>. Watch how field lines bend between opposite charges and push
        apart for like charges. Move the test charge closer to a source — |E| and |F| grow
        quickly (Coulomb&apos;s law falls off with distance squared). <br />
        先從 <strong>Dipole</strong>{' '}
        開始，再切換到 <strong>Repel</strong> 和 <strong>Attract</strong>。觀察異號電荷之間場線如何彎曲、
        同號電荷如何彼此排開。把測試電荷移近來源電荷時，|E| 與 |F| 會快速增加（庫侖定律隨距離平方衰減）。
      </HelpNote>
      <p className="text-xs text-[var(--muted)]">
        Drag with mouse to orbit · scroll to zoom · readouts update as you move sliders <br />
        滑鼠拖曳可旋轉 · 滾輪縮放 · 調整滑桿時數值會即時更新
      </p>
    </>
  )

  const circuitContent = (
    <>
      <HelpNote title={'What this lab shows\n這個實驗在展示什麼'}>
        A simple <strong className="text-[var(--foreground)]">DC (direct current)</strong> loop:
        battery → wires → resistor → back to battery. Cyan dots are electrons drifting along the
        wire; their speed reflects current. The resistor glows brighter when it dissipates more{' '}
        <strong className="text-[var(--foreground)]">power</strong> (energy per second). <br />
        這是一個簡單的
        <strong className="text-[var(--foreground)]">直流（DC）</strong>回路：電池 → 導線 → 電阻 → 回到電池。
        青色點代表沿線漂移的電子，速度反映電流大小。電阻消耗更多
        <strong className="text-[var(--foreground)]">功率</strong>（每秒能量）時會更亮。
      </HelpNote>
      <HelpNote title={'Try this\n試試看'} variant="tip">
        Raise voltage with resistance fixed — current and power both increase. Raise resistance
        with voltage fixed — current drops. Compare <strong>LED</strong> (low voltage, moderate R)
        vs <strong>Heater</strong> (high power). <strong>High-R</strong> is like almost no current
        flowing. <br />
        固定電阻時提高電壓，電流與功率都會上升；固定電壓時提高電阻，電流會下降。比較
        <strong>LED</strong>（低電壓、中等 R）與 <strong>Heater</strong>（高功率）。
        <strong>High-R</strong> 則接近幾乎無電流。
      </HelpNote>
      <HelpNote variant="formula">
        Ohm&apos;s law: I = V / R &nbsp;·&nbsp; Power: P = V × I = V² / R <br />
        歐姆定律：I = V / R
        &nbsp;·&nbsp; 功率：P = V × I = V² / R
      </HelpNote>
    </>
  )

  return (
    <details
      className={cn(
        'group rounded-lg border border-[var(--border)] bg-black/20 px-3 py-2',
        className,
      )}
    >
      <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.14em] text-[var(--silver)] marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="text-[var(--accent)] transition group-open:rotate-90">
            ▸
          </span>
          Lab guide / 實驗說明
        </span>
      </summary>
      <div className="mt-3 space-y-3 border-t border-[var(--border)] pt-3">
        {activeTab === 'field' ? fieldContent : circuitContent}
      </div>
    </details>
  )
}
