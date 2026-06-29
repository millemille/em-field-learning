import { HeroIntro } from '@/components/layout/HeroIntro'
import { LabTabs } from '@/components/controls/LabTabs'

function App() {
  return (
    <>
      <main>
        <HeroIntro />
        <LabTabs />
      </main>
      <footer className="mx-auto max-w-4xl border-t border-[var(--border)] px-4 py-8 text-sm text-[var(--muted)]">
        <p className="mb-2 text-center">
          EM Field Lab uses simplified physics for intuition — real devices also have wire
          resistance, temperature effects, and safety limits.
          <br />
          EM Field Lab 使用簡化物理模型來建立直覺
          — 真實裝置還會受到導線電阻、溫度效應與安全限制影響。
        </p>
        <p className="text-center text-xs opacity-80">
          Not a substitute for hands-on lab safety or professional engineering review.
          <br />
          不能取代實作實驗室安全訓練或專業工程審查。
        </p>
      </footer>
    </>
  )
}

export default App
