const K = 8.99e9

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface PointCharge {
  id: string
  q: number
  x: number
  y: number
  z: number
}

export function vecLen(v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
}

export function vecAdd(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

export function vecScale(v: Vec3, s: number): Vec3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s }
}

export function vecNormalize(v: Vec3): Vec3 {
  const len = vecLen(v)
  if (len < 1e-12) return { x: 0, y: 0, z: 0 }
  return vecScale(v, 1 / len)
}

export function electricFieldAt(charges: PointCharge[], point: Vec3): Vec3 {
  let ex = 0
  let ey = 0
  let ez = 0

  for (const c of charges) {
    const dx = point.x - c.x
    const dy = point.y - c.y
    const dz = point.z - c.z
    const r2 = dx * dx + dy * dy + dz * dz
    const r = Math.sqrt(r2)
    if (r < 0.35) continue
    const mag = (K * c.q) / (r2 * r)
    ex += mag * dx
    ey += mag * dy
    ez += mag * dz
  }

  return { x: ex, y: ey, z: ez }
}

export function forceOnTestCharge(
  charges: PointCharge[],
  testQ: number,
  testPos: Vec3,
): Vec3 {
  const e = electricFieldAt(charges, testPos)
  return vecScale(e, testQ)
}

export interface FieldSample {
  position: Vec3
  field: Vec3
  magnitude: number
}

export function sampleFieldGrid(
  charges: PointCharge[],
  bounds: { min: number; max: number },
  divisions: number,
): FieldSample[] {
  const samples: FieldSample[] = []
  const span = bounds.max - bounds.min
  const step = span / (divisions - 1)

  for (let ix = 0; ix < divisions; ix++) {
    for (let iy = 0; iy < divisions; iy++) {
      for (let iz = 0; iz < divisions; iz++) {
        const position = {
          x: bounds.min + ix * step,
          y: bounds.min + iy * step,
          z: bounds.min + iz * step,
        }
        const field = electricFieldAt(charges, position)
        const magnitude = vecLen(field)
        if (magnitude < 1e-6) continue
        samples.push({ position, field, magnitude })
      }
    }
  }

  return samples
}

export function chargeInteractionLabel(charges: PointCharge[]): string {
  if (charges.length < 2) return 'Single charge field\n單一電荷場'
  const [a, b] = charges
  if (a.q * b.q > 0) return 'Repel — like charges\n同號排斥'
  if (a.q * b.q < 0) return 'Attract — opposite charges\n異號吸引'
  return 'Neutral\n中性'
}

export function distanceBetween(a: PointCharge, b: PointCharge): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
