import { HeroIntro } from '@/components/layout/HeroIntro'
import { LabTabs } from '@/components/controls/LabTabs'

function App() {
  return (
    <>
      <div className="scanline-overlay" aria-hidden />
      <main>
        <HeroIntro />
        <LabTabs />
      </main>
      <footer className="mx-auto max-w-4xl border-t border-[var(--border)] px-4 py-8 text-sm text-[var(--muted)]">
        <p className="mb-2 text-center">
          EM Field Lab uses simplified physics for intuition — real devices also have wire
          resistance, temperature effects, and safety limits.
        </p>
        <p className="text-center text-xs opacity-80">
          Not a substitute for hands-on lab safety or professional engineering review.
        </p>
      </footer>
    </>
  )
}

export default App
