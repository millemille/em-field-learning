import { type Vec3, vecScale } from './coulomb'

export function forceFromUniformField(field: Vec3, testQ: number): Vec3 {
  return vecScale(field, testQ)
}
