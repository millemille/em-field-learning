import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChargeControls } from '@/components/controls/ChargeControls'
import { CircuitControls } from '@/components/controls/CircuitControls'
import { LabGuide } from '@/components/layout/LabGuide'
import { VisualLegend } from '@/components/layout/VisualLegend'
import { LabCanvas } from '@/components/lab/LabCanvas'
import { useLabStore, type LabTab } from '@/hooks/useLabStore'

const tabBlurbs: Record<LabTab, string> = {
  field:
    'Charges in space — explore fields and forces before wires and batteries.',
  circuit:
    'Charges in motion — see how voltage, resistance, and power relate in a simple loop.',
}

export function LabTabs() {
  const activeTab = useLabStore((s) => s.activeTab)
  const setActiveTab = useLabStore((s) => s.setActiveTab)

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as LabTab)}
        className="w-full"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <TabsList className="w-full max-w-md shrink-0">
            <TabsTrigger value="field" className="flex-1">
              Electrostatics
            </TabsTrigger>
            <TabsTrigger value="circuit" className="flex-1">
              Power & Circuits
            </TabsTrigger>
          </TabsList>
          <p className="max-w-xl text-sm text-[var(--muted)]">{tabBlurbs[activeTab]}</p>
        </div>

        <LabGuide />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_min(100%,340px)]">
          <div className="canvas-frame relative z-[1] h-[min(55vh,420px)] w-full sm:h-[min(65vh,520px)] lg:col-start-1 lg:row-start-1 lg:h-[min(70vh,560px)]">
            <LabCanvas />
            <VisualLegend />
          </div>

          <div className="min-w-0 lg:col-start-2 lg:row-start-1">
            {activeTab === 'field' ? <ChargeControls /> : <CircuitControls />}
          </div>
        </div>
      </Tabs>
    </section>
  )
}
