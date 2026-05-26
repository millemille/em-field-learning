import { create } from 'zustand'
import type { PointCharge } from '@/lib/physics/coulomb'

export type LabTab = 'field' | 'circuit'

export interface FieldMetrics {
  fieldMagnitude: number
  forceMagnitude: number
  interaction: string
  chargeDistance: number
}

const defaultCharges: PointCharge[] = [
  { id: 'a', q: 4e-6, x: -3, y: 0, z: 0 },
  { id: 'b', q: -4e-6, x: 3, y: 0, z: 0 },
]

interface LabStore {
  activeTab: LabTab
  setActiveTab: (tab: LabTab) => void

  charges: PointCharge[]
  testChargeQ: number
  testPos: { x: number; y: number; z: number }
  fieldMetrics: FieldMetrics

  setChargeQ: (id: string, q: number) => void
  setChargeX: (id: string, x: number) => void
  setTestChargeQ: (q: number) => void
  setTestPosX: (x: number) => void
  setTestPosZ: (z: number) => void
  applyChargePreset: (preset: 'dipole' | 'repel' | 'attract') => void
  setFieldMetrics: (m: FieldMetrics) => void

  voltage: number
  resistance: number
  setVoltage: (v: number) => void
  setResistance: (r: number) => void
  applyCircuitPreset: (preset: 'led' | 'heater' | 'open') => void
}

export const useLabStore = create<LabStore>((set) => ({
  activeTab: 'field',
  setActiveTab: (tab) => set({ activeTab: tab }),

  charges: defaultCharges,
  testChargeQ: 1e-6,
  testPos: { x: 0, y: 0, z: 2 },
  fieldMetrics: {
    fieldMagnitude: 0,
    forceMagnitude: 0,
    interaction: 'Dipole\n偶極',
    chargeDistance: 6,
  },

  setChargeQ: (id, q) =>
    set((s) => ({
      charges: s.charges.map((c) => (c.id === id ? { ...c, q } : c)),
    })),
  setChargeX: (id, x) =>
    set((s) => ({
      charges: s.charges.map((c) => (c.id === id ? { ...c, x } : c)),
    })),
  setTestChargeQ: (q) => set({ testChargeQ: q }),
  setTestPosX: (x) => set((s) => ({ testPos: { ...s.testPos, x } })),
  setTestPosZ: (z) => set((s) => ({ testPos: { ...s.testPos, z } })),
  applyChargePreset: (preset) => {
    if (preset === 'dipole') {
      set({
        charges: [
          { id: 'a', q: 5e-6, x: -3.5, y: 0, z: 0 },
          { id: 'b', q: -5e-6, x: 3.5, y: 0, z: 0 },
        ],
        testPos: { x: 0, y: 0, z: 2 },
      })
    } else if (preset === 'repel') {
      set({
        charges: [
          { id: 'a', q: 6e-6, x: -3, y: 0, z: 0 },
          { id: 'b', q: 6e-6, x: 3, y: 0, z: 0 },
        ],
        testPos: { x: 0, y: 0, z: 2.5 },
      })
    } else {
      set({
        charges: [
          { id: 'a', q: 7e-6, x: -3, y: 0, z: 0 },
          { id: 'b', q: -7e-6, x: 3, y: 0, z: 0 },
        ],
        testPos: { x: 0, y: 0, z: 1.5 },
      })
    }
  },
  setFieldMetrics: (m) => set({ fieldMetrics: m }),

  voltage: 12,
  resistance: 100,
  setVoltage: (v) => set({ voltage: v }),
  setResistance: (r) => set({ resistance: r }),
  applyCircuitPreset: (preset) => {
    if (preset === 'led') set({ voltage: 3.3, resistance: 150 })
    else if (preset === 'heater') set({ voltage: 120, resistance: 14 })
    else set({ voltage: 9, resistance: 10000 })
  },
}))
