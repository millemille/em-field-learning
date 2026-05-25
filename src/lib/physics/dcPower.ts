export interface DcCircuitResult {
  voltage: number
  resistance: number
  current: number
  power: number
}

export function solveDcCircuit(voltage: number, resistance: number): DcCircuitResult {
  const r = Math.max(resistance, 0.01)
  const current = voltage / r
  const power = voltage * current
  return { voltage, resistance: r, current, power }
}

export function formatAmps(i: number): string {
  if (i >= 1) return `${i.toFixed(2)} A`
  return `${(i * 1000).toFixed(1)} mA`
}

export function formatWatts(p: number): string {
  if (p >= 1) return `${p.toFixed(2)} W`
  return `${(p * 1000).toFixed(1)} mW`
}

export function formatVolts(v: number): string {
  return `${v.toFixed(1)} V`
}

export function formatOhms(r: number): string {
  if (r >= 1000) return `${(r / 1000).toFixed(2)} kΩ`
  return `${r.toFixed(1)} Ω`
}
