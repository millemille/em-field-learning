import { HelpNote } from '@/components/layout/HelpNote'

export function HeroIntro() {
  return (
    <header className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <p className="eyebrow mb-2 whitespace-pre-line">
        {'Electromagnetism · Interactive Lab\n電磁學 · 互動實驗室'}
      </p>
      <h1 className="font-display mb-4 text-3xl font-bold tracking-tight text-[var(--silver)] md:text-4xl">
        EM Field Lab
      </h1>
      <div className="space-y-4 text-[var(--muted)]">
        <p>
          <strong className="text-[var(--foreground)]">Electromagnetism</strong> describes how
          electric charges and currents produce forces and energy in space. You do not have to see
          charges move to feel the effect — a charged balloon can attract your hair because it
          reshapes the electric field around you. <br />
          <strong className="text-[var(--foreground)]">
            電磁學
          </strong>
          說明電荷與電流如何在空間中產生力與能量。你不一定要看到電荷移動才感受到效果
          — 帶電氣球會吸起頭髮，因為它改變了你周圍的電場。
        </p>
        <p>
          This page is built for <strong className="text-[var(--foreground)]">beginners and
          intermediate learners</strong>. Each lab links a concept to something you can see: field
          arrows for <span className="font-mono text-[var(--accent)]">E</span>, a force arrow for{' '}
          <span className="font-mono text-[var(--accent)]">F = qE</span>, and glowing components
          for power <span className="font-mono text-[var(--accent)]">P = IV</span> in a DC circuit. /
          這個頁面是為了<strong className="text-[var(--foreground)]">初學與進階學習者</strong>
          設計。每個實驗都把概念連到可視化現象：
          <span className="font-mono text-[var(--accent)]">E</span> 用場箭頭表示、
          <span className="font-mono text-[var(--accent)]">F = qE</span> 用受力箭頭表示，以及直流電路中
          <span className="font-mono text-[var(--accent)]">P = IV</span> 的元件發光效果。
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <HelpNote title={'Electric field (E)\n電場 (E)'}>
          Think of <strong className="text-[var(--foreground)]">E</strong> as the push per unit
          charge at each point in space. Stronger field → longer cyan arrows in the lab. Units:
          newtons per coulomb (N/C), same as volts per meter (V/m). <br />
          把
          <strong className="text-[var(--foreground)]">E</strong>
          想成空間中每一點「每單位電荷受到的推力」。場越強，實驗中的青色箭頭越長。單位是牛頓每庫侖
          (N/C)，也等同伏特每公尺 (V/m)。
        </HelpNote>
        <HelpNote title={'Force on a charge (F)\n電荷受力 (F)'}>
          A charge <strong className="text-[var(--foreground)]">q</strong> in a field feels{' '}
          <span className="font-mono text-[var(--accent)]">F = qE</span>. Same direction as E for
          positive q, opposite for negative. Move the yellow test charge to see |F| change. <br />
          場中的電荷
          <strong className="text-[var(--foreground)]">q</strong> 會受到
          <span className="font-mono text-[var(--accent)]">F = qE</span>。q 為正時方向與 E 相同，q
          為負時方向相反。移動黃色測試電荷可觀察 |F| 如何改變。
        </HelpNote>
        <HelpNote title={'Current & resistance\n電流與電阻'}>
          In wires, <strong className="text-[var(--foreground)]">voltage</strong> (V) drives{' '}
          <strong className="text-[var(--foreground)]">current</strong> (I, amps).{' '}
          <strong className="text-[var(--foreground)]">Resistance</strong> (Ω) limits flow: more R
          → less I for the same battery. <br />
          在導線中，
          <strong className="text-[var(--foreground)]">電壓</strong> (V) 會驅動
          <strong className="text-[var(--foreground)]">電流</strong> (I，安培)。
          <strong className="text-[var(--foreground)]">電阻</strong> (Ω) 會限制流動：同一顆電池下，
          R 越大，I 越小。
        </HelpNote>
        <HelpNote title={'Power (P)\n功率 (P)'}>
          <strong className="text-[var(--foreground)]">Power</strong> is energy per second (watts).
          In the circuit lab, <span className="font-mono text-[var(--accent)]">P = V × I</span>.
          That energy often becomes heat in the resistor — watch the glow increase with P. <br />
          <strong className="text-[var(--foreground)]">功率</strong> 是每秒能量（瓦特）。在電路實驗裡，
          <span className="font-mono text-[var(--accent)]">P = V × I</span>。這些能量常會變成電阻的熱，
          可看到發光強度隨 P 增加。
        </HelpNote>
      </div>

      <p className="mt-6 text-sm opacity-80">
        Models here are idealized (point charges, perfect resistor, no battery internal loss).
        Use sliders and presets, orbit the 3D view with your mouse, and read the panel hints beside
        each control. <br />
        這裡的模型是理想化版本（點電荷、理想電阻、忽略電池內耗）。請使用滑桿與預設情境，
        以滑鼠旋轉 3D 視角，並閱讀每個控制項旁的提示。
      </p>
    </header>
  )
}
