/**
 * Scaled solar-system model for visualization.
 * Orbital periods follow Kepler's third law (T² ∝ a³) using real Earth-year periods.
 * Orbital distances use AU (compressed). Planet radii are proportional to Earth except the Sun.
 */

export const AU_TO_SCENE = 2.4

/** Equatorial radius relative to Earth (= 1). Sources: NASA fact sheets (approx.). */
export const RADIUS_RELATIVE_TO_EARTH: Record<string, number> = {
  mercury: 0.383,
  venus: 0.949,
  earth: 1,
  mars: 0.532,
  jupiter: 11.21,
  saturn: 9.45,
  uranus: 4.01,
  neptune: 3.88,
  moon: 0.273,
}

/** Earth sphere radius in scene units; other planets scale from this. */
export const EARTH_VISUAL_RADIUS = 0.14

export function proportionalPlanetRadius(bodyId: string): number {
  const rel = RADIUS_RELATIVE_TO_EARTH[bodyId] ?? 1
  return EARTH_VISUAL_RADIUS * rel
}

/** Orbital period in Earth years (sidereal, approximate). */
export const ORBITAL_PERIOD_YEARS: Record<string, number> = {
  mercury: 0.241,
  venus: 0.615,
  earth: 1.0,
  mars: 1.881,
  jupiter: 11.86,
  saturn: 29.46,
  uranus: 84.01,
  neptune: 164.8,
  moon: 0.0748, // ~27.3 days
}

/** Sidereal rotation period in Earth days (negative = retrograde). */
export const ROTATION_PERIOD_DAYS: Record<string, number> = {
  sun: 25.4,
  mercury: 58.6,
  venus: -243,
  earth: 0.997,
  mars: 1.03,
  jupiter: 0.41,
  saturn: 0.45,
  uranus: 0.72,
  neptune: 0.67,
  moon: 27.3,
}

export interface PlanetDef {
  id: string
  name: string
  nameZh: string
  semiMajorAxisAu: number
  orbitalPeriodYears: number
  rotationPeriodDays: number
  /** Visual radius in scene units (proportional to Earth, except Sun). */
  visualRadius: number
  color: string
  emissive: string
  emissiveIntensity: number
}

/** Single source at the Sun; decay=0 keeps direction correct without distance dimming in this scaled view. */
export const SUN_LIGHT = {
  intensity: 4.5,
  color: '#fff8eb',
} as const

export const SUN = {
  id: 'sun',
  /** Solid disk — kept smaller than Mercury's orbit radius (~0.93 scene units). */
  visualRadius: 0.26,
  color: '#ffcc44',
  emissive: '#ffaa22',
  emissiveIntensity: 1.8,
  rotationPeriodDays: ROTATION_PERIOD_DAYS.sun,
} as const

export const PLANETS: PlanetDef[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    nameZh: '水星',
    semiMajorAxisAu: 0.387,
    orbitalPeriodYears: ORBITAL_PERIOD_YEARS.mercury,
    rotationPeriodDays: ROTATION_PERIOD_DAYS.mercury,
    visualRadius: proportionalPlanetRadius('mercury'),
    color: '#9a9488',
    emissive: '#6a655c',
    emissiveIntensity: 0.25,
  },
  {
    id: 'venus',
    name: 'Venus',
    nameZh: '金星',
    semiMajorAxisAu: 0.723,
    orbitalPeriodYears: ORBITAL_PERIOD_YEARS.venus,
    rotationPeriodDays: ROTATION_PERIOD_DAYS.venus,
    visualRadius: proportionalPlanetRadius('venus'),
    color: '#e8c87a',
    emissive: '#c9a84a',
    emissiveIntensity: 0.3,
  },
  {
    id: 'earth',
    name: 'Earth',
    nameZh: '地球',
    semiMajorAxisAu: 1.0,
    orbitalPeriodYears: ORBITAL_PERIOD_YEARS.earth,
    rotationPeriodDays: ROTATION_PERIOD_DAYS.earth,
    visualRadius: proportionalPlanetRadius('earth'),
    color: '#4fd1ff',
    emissive: '#2a8fb8',
    emissiveIntensity: 0.45,
  },
  {
    id: 'mars',
    name: 'Mars',
    nameZh: '火星',
    semiMajorAxisAu: 1.524,
    orbitalPeriodYears: ORBITAL_PERIOD_YEARS.mars,
    rotationPeriodDays: ROTATION_PERIOD_DAYS.mars,
    visualRadius: proportionalPlanetRadius('mars'),
    color: '#e07050',
    emissive: '#b84830',
    emissiveIntensity: 0.35,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameZh: '木星',
    semiMajorAxisAu: 5.203,
    orbitalPeriodYears: ORBITAL_PERIOD_YEARS.jupiter,
    rotationPeriodDays: ROTATION_PERIOD_DAYS.jupiter,
    visualRadius: proportionalPlanetRadius('jupiter'),
    color: '#e8c090',
    emissive: '#a67a48',
    emissiveIntensity: 0.35,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameZh: '土星',
    semiMajorAxisAu: 9.537,
    orbitalPeriodYears: ORBITAL_PERIOD_YEARS.saturn,
    rotationPeriodDays: ROTATION_PERIOD_DAYS.saturn,
    visualRadius: proportionalPlanetRadius('saturn'),
    color: '#f0e4b8',
    emissive: '#c4b070',
    emissiveIntensity: 0.3,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameZh: '天王星',
    semiMajorAxisAu: 19.19,
    orbitalPeriodYears: ORBITAL_PERIOD_YEARS.uranus,
    rotationPeriodDays: ROTATION_PERIOD_DAYS.uranus,
    visualRadius: proportionalPlanetRadius('uranus'),
    color: '#9ed8f0',
    emissive: '#5aa8c8',
    emissiveIntensity: 0.35,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameZh: '海王星',
    semiMajorAxisAu: 30.07,
    orbitalPeriodYears: ORBITAL_PERIOD_YEARS.neptune,
    rotationPeriodDays: ROTATION_PERIOD_DAYS.neptune,
    visualRadius: proportionalPlanetRadius('neptune'),
    color: '#68a8f8',
    emissive: '#3868c8',
    emissiveIntensity: 0.4,
  },
]

/** Venus orbit (AU) — Moon path must stay outside this ring around the Sun. */
const VENUS_ORBIT_AU = 0.723
const EARTH_ORBIT_AU = 1

/**
 * Visual lunar orbit around Earth: enlarged for visibility but capped so it never
 * crosses inside Venus's orbit (Earth at 1 AU, Venus at ~0.723 AU).
 */
const MOON_ORBIT_PHYSICS_MAX =
  auToScene(EARTH_ORBIT_AU) - auToScene(VENUS_ORBIT_AU) - 0.1

export const MOON_ORBIT_SCENE_RADIUS = Math.max(
  EARTH_VISUAL_RADIUS * 2.4,
  MOON_ORBIT_PHYSICS_MAX,
)

export const MOON = {
  id: 'moon',
  name: 'Moon',
  nameZh: '月球',
  /** Mean distance from Earth in AU (used only for period / labeling). */
  distanceFromEarthAu: 0.00257,
  orbitSceneRadius: MOON_ORBIT_SCENE_RADIUS,
  orbitalPeriodYears: ORBITAL_PERIOD_YEARS.moon,
  rotationPeriodDays: ROTATION_PERIOD_DAYS.moon,
  visualRadius: proportionalPlanetRadius('moon'),
  color: '#c8d0e0',
  emissive: '#98a0b0',
  emissiveIntensity: 0.35,
} as const

export const ASTEROID_BELT = {
  innerAu: 2.2,
  outerAu: 3.2,
  count: 420,
} as const

/** One Earth year in simulation seconds at timeScale = 1. */
export const SECONDS_PER_EARTH_YEAR = 12

export function auToScene(au: number): number {
  return au * AU_TO_SCENE
}

/** Orbital angle (rad) at elapsed simulation seconds. */
export function orbitalAngle(periodYears: number, elapsedSec: number, timeScale: number): number {
  const years = (elapsedSec * timeScale) / SECONDS_PER_EARTH_YEAR
  return ((years / periodYears) % 1) * Math.PI * 2
}

/** Position on ecliptic (XZ plane, Y up). */
export function orbitalPosition(
  semiMajorAxisAu: number,
  periodYears: number,
  elapsedSec: number,
  timeScale: number,
  phase = 0,
): { x: number; y: number; z: number } {
  const r = auToScene(semiMajorAxisAu)
  const theta = orbitalAngle(periodYears, elapsedSec, timeScale) + phase
  return { x: r * Math.cos(theta), y: 0, z: r * Math.sin(theta) }
}

/** Moon position in Earth's local frame (visual orbit radius, real period). */
export function moonLocalPosition(
  elapsedSec: number,
  timeScale: number,
  phase = 1.2,
): { x: number; y: number; z: number } {
  const r = MOON.orbitSceneRadius
  const theta = orbitalAngle(MOON.orbitalPeriodYears, elapsedSec, timeScale) + phase
  const x = r * Math.cos(theta)
  const z = r * Math.sin(theta)
  const y = z * 0.14
  return { x, y, z }
}

/** Spin rate (rad/s) from sidereal rotation period in days. */
export function spinRate(rotationPeriodDays: number, timeScale: number): number {
  const daysPerSimYear = 365.25
  const simYearsPerSec = timeScale / SECONDS_PER_EARTH_YEAR
  const daysPerSec = daysPerSimYear * simYearsPerSec
  const sign = rotationPeriodDays < 0 ? -1 : 1
  const period = Math.abs(rotationPeriodDays)
  return sign * ((2 * Math.PI) / period) * daysPerSec
}

export function formatOrbitalPeriodYears(years: number): string {
  if (years < 1 / 12) return `${(years * 365.25).toFixed(0)} d`
  if (years < 1) return `${(years * 12).toFixed(1)} mo`
  return `${years.toFixed(2)} yr`
}

export function getPlanetById(id: string): PlanetDef | undefined {
  return PLANETS.find((p) => p.id === id)
}

/** Kepler third law: period in years when a is in AU (circular orbit). */
export function periodFromSemiMajorAxisAu(au: number): number {
  return au ** 1.5
}

function planetOrbitPhase(planetId: string): number {
  return planetId === 'earth' ? 0 : planetId.charCodeAt(0) * 0.02
}

/** World position of a focusable body at simulation time. */
export function getBodyWorldPosition(
  bodyId: string,
  elapsedSec: number,
  timeScale: number,
): { x: number; y: number; z: number } {
  if (bodyId === 'sun') return { x: 0, y: 0, z: 0 }

  if (bodyId === 'moon') {
    const earth = getPlanetById('earth')!
    const e = orbitalPosition(
      earth.semiMajorAxisAu,
      earth.orbitalPeriodYears,
      elapsedSec,
      timeScale,
      0,
    )
    const m = moonLocalPosition(elapsedSec, timeScale, 1.2)
    return { x: e.x + m.x, y: e.y + m.y, z: e.z + m.z }
  }

  const planet = getPlanetById(bodyId)
  if (!planet) return { x: 0, y: 0, z: 0 }

  return orbitalPosition(
    planet.semiMajorAxisAu,
    planet.orbitalPeriodYears,
    elapsedSec,
    timeScale,
    planetOrbitPhase(planet.id),
  )
}

function focusCam(bodyId: string, distanceMul: number) {
  const r = bodyId === 'sun' ? SUN.visualRadius : proportionalPlanetRadius(bodyId)
  const d = Math.max(r * distanceMul, 1.5)
  return {
    distance: d,
    minDistance: Math.max(r * 1.8, 0.4),
    maxDistance: Math.max(d * 4, 12),
    ringScale: r * 1.5,
  }
}

export const FOCUS_CAMERA: Record<
  string,
  { distance: number; minDistance: number; maxDistance: number; ringScale: number }
> = {
  sun: focusCam('sun', 14),
  mercury: focusCam('mercury', 16),
  venus: focusCam('venus', 14),
  earth: focusCam('earth', 14),
  mars: focusCam('mars', 16),
  jupiter: focusCam('jupiter', 6),
  saturn: focusCam('saturn', 7),
  uranus: focusCam('uranus', 9),
  neptune: focusCam('neptune', 9),
}

/** Free overview — orbit the whole system (Neptune ~72 scene units). */
export const OVERVIEW_CAMERA = {
  target: [0, 0, 0] as const,
  position: [88, 62, 88] as const,
  minDistance: 4,
  maxDistance: 180,
}
