import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChargeControls } from '@/components/controls/ChargeControls'
import { CircuitControls } from '@/components/controls/CircuitControls'
import { LabGuide } from '@/components/layout/LabGuide'
import { VisualLegend } from '@/components/layout/VisualLegend'
import { LabCanvas } from '@/components/lab/LabCanvas'
import { useLabStore, type LabTab } from '@/hooks/useLabStore'

const tabBlurbs: Record<LabTab, string> = {
  field:
    'Charges in space — explore fields and forces before wires and batteries.\n空間中的電荷：在導線與電池之前，先探索電場與受力。',
  circuit:
    'Charges in motion — see how voltage, resistance, and power relate in a simple loop.\n流動中的電荷：在簡單回路中理解電壓、電阻與功率的關係。',
}

export function LabTabs() {
  const activeTab = useLabStore((s) => s.activeTab)
  const setActiveTab = useLabStore((s) => s.setActiveTab)

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as LabTab)}
        className="w-full"
      >
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="w-full max-w-md shrink-0">
            <TabsTrigger value="field" className="flex-1 whitespace-pre-line leading-tight">
              {'Electrostatics\n靜電學'}
            </TabsTrigger>
            <TabsTrigger value="circuit" className="flex-1 whitespace-pre-line leading-tight">
              {'Power & Circuits\n功率與電路'}
            </TabsTrigger>
          </TabsList>
          <p className="hidden max-w-xl whitespace-pre-line text-xs text-[var(--muted)] sm:block lg:hidden">
            {tabBlurbs[activeTab]}
          </p>
        </div>

        <div className="lab-workspace grid gap-3 lg:grid-cols-[minmax(0,1fr)_min(100%,292px)] lg:items-stretch">
          <div className="canvas-frame relative z-[1] h-[min(48vh,380px)] w-full min-h-[280px] lg:h-full lg:min-h-0">
            <LabCanvas />
            <VisualLegend />
          </div>

          <div className="lab-controls-scroll min-h-0 lg:max-h-full lg:overflow-y-auto">
            {activeTab === 'field' ? <ChargeControls /> : <CircuitControls />}
          </div>
        </div>

        <LabGuide className="mt-3" />
      </Tabs>
    </section>
  )
}
